define(
    [
        'config',
        'node-switcher',
        './scenic/switcher/quidds',
        'log',
        'underscore',
        'jquery'
    ],

    function(config, switcher, quidds, log, _, $) {


        function initialize(io) {

            log.debug("Init Switcher");
            //create the default quiddities necessary for use switcher
            switcher.create("rtpsession", config.rtpsession);
            switcher.create("SOAPcontrolServer", "soap");

            if (config.loadFile) {
                var load = switcher.load_history_from_scratch(config.loadFile);
                if (load == "true") {
                    log.info("the file ", config.loadFile, "is loaded");
                } else {
                    log.error("the file " + config.loadFile + "is not found!");
                }
            } else {

                if (typeof config.port.soap == "number" && config.port.soap.toString().length >= 4) {
                    switcher.invoke("soap", "set_port", [config.port.soap]);
                } else {
                    log.error("The soap port is not valid" + config.port.soap);
                    process.exit();
                }
                //create default dico for stock information
                var dico = switcher.create("dico", "dico");

                //create the properties controlProperties for stock properties of quidds for control
                switcher.invoke(dico, "new-entry", ["controlProperties", "stock informations about properties controlable by controlers (midi, osc, etc..)", "Properties of Quidds for Controls"]);
                switcher.invoke(dico, "new-entry", ["destinations", "stock informations about destinations for manage edition", "dico for manage destinations"]);
                switcher.set_property_value("dico", "destinations", '[]');
            }

            switcher.register_log_callback(function(msg) {
                log.switcher(msg);
            });

            //signals for modification properties
            switcher.register_prop_callback(function(qname, qprop, pvalue) {

                /* here we define action when a property of quidd is modified */

                //we exclude byte-reate because its call every second (almost a spam...)
                if (qprop != "byte-rate") {
                    log.debug('...PROP...: ', qname, ' ', qprop, ' ', pvalue);
                } else {
                    io.sockets.emit("signals_properties_value", qname, qprop, pvalue);
                }


                if (qprop == "shmdata-writers") {
                    var shmdatas = JSON.parse(pvalue).shmdata_writers;
                    _.each(shmdatas, function(shm) {
                        //var addDataStream = switcher.invoke("defaultrtp", "add_data_stream", [shm.path]);
                    });

                }

                if (qprop == "shmdata-writers") {

                    //if the quidd have shmdata we create view meter
                    if (JSON.parse(pvalue).shmdata_writers.length > 0) createVuMeter(qname);

                    //Send to all users informing the creation of shmdatas for a specific quiddity
                    //var shmdatas = switcher.get_property_value(qname, "shmdata-writers");
                    var shmdatas = JSON.parse(pvalue).shmdata_writers;
                    log.debug("send Shmdatas for ", qname);
                    io.sockets.emit("updateShmdatas", qname, shmdatas);


                    /* check if destination have shmdata in connection */
                    //if(pvalue)

                }

                if (qprop == "shmdata-readers") {
                    io.sockets.emit("update_shmdatas_readers", qname, pvalue);
                }


                if (qprop == "started" && pvalue == "false") {

                    log.debug("remove shmdata of", qname);
                    var destinations = switcher.get_property_value("dico", "destinations"),
                        destinations = JSON.parse(destinations);

                    _.each(destinations, function(dest) {
                        _.each(dest.data_streams, function(stream) {
                            log.debug(stream.quiddName, qname);
                            if (stream.quiddName == qname) {
                                log.debug("find quidd connected!", stream.path, stream.port);
                                receivers.remove_connection(stream.path, dest.id);
                            }
                        });
                    });

                    //check if another quiddities is associate to
                    var quidds = JSON.parse(switcher.get_quiddities_description()).quiddities;
                    _.each(quidds, function(quidd) {
                        if (quidd.name.indexOf("sink_") >= 0 && quidd.name.indexOf(qname) >= 0) {
                            log.debug("remove sink", quidd.name);
                            switcher.remove(quidd.name);
                        }
                    });

                }


                //broadcast all the modification on properties
                _.each(config.subscribe_quidd_info, function(quiddName, socketId) {
                    if (quiddName == qname) {
                        var socket = io.sockets.sockets[socketId];
                        socket.emit("signals_properties_value", qname, qprop, pvalue);
                    }
                });

            });

            switcher.register_signal_callback(function(qname, qprop, pvalue) {

                log.switcher('signal : ', qname, ' ', qprop, ' ', pvalue);

                var quiddClass = JSON.parse(switcher.get_quiddity_description(pvalue[0]));
                if (!_.contains(config.quiddExclude, quiddClass.class) && qprop == "on-quiddity-created") {


                    //subscribe signal for properties add/remove and methods add/remove
                    switcher.subscribe_to_signal(pvalue[0], "on-property-added");
                    switcher.subscribe_to_signal(pvalue[0], "on-property-removed");
                    switcher.subscribe_to_signal(pvalue[0], "on-method-added");
                    switcher.subscribe_to_signal(pvalue[0], "on-method-removed");
                    switcher.subscribe_to_signal(pvalue[0], "on-connection-tried");

                    //we subscribe all properties of quidd created
                    var properties = JSON.parse(switcher.get_properties_description(pvalue[0])).properties;
                    _.each(properties, function(property) {
                        switcher.subscribe_to_property(pvalue[0], property.name);
                        log.switcher("subscribe to ", pvalue[0], property.name);
                    });


                    //the socketId of the user created quidd is memories in config, we filtered for not send again "create"
                    io.sockets.emit("create", quiddClass);
                    // var socketIdCreatedThisQuidd = false;
                    // _.each(config.listQuiddsAndSocketId, function(socketId, quiddName) {
                    //     if (quiddName == pvalue[0])
                    //         socketIdCreatedThisQuidd = socketId;
                    //     delete config.listQuiddsAndSocketId[quiddName];
                    // });
                    // if (socketIdCreatedThisQuidd) {
                    //     io.sockets.except(socketIdCreatedThisQuidd).emit("create", quiddClass);
                    // } else {
                    //     io.sockets.emit("create", quiddClass);
                    // }

                }
                //Emits to users a quiddity is removed
                if (qprop == "on-quiddity-removed") {
                    io.sockets.emit("remove", pvalue);
                    log.debug("the quiddity " + pvalue + "is removed");
                }

                if (qprop == "on-property-added" || qprop == "on-property-removed" || qprop == "on-method-added" || qprop == "on-method-removed") {
                    //console.log("New property for ",qname, pvalue);
                    _.each(config.subscribe_quidd_info, function(quiddName, socketId) {
                        if (quiddName == qname) {
                            log.switcher("send to sId (" + socketId + ") " + qprop + " : " + pvalue);
                            var socket = io.sockets.sockets[socketId];
                            socket.emit('signals_properties_info', qprop, qname, pvalue);
                        }
                    });

                }
                //subscribe to the property added
                if (qprop == "on-property-added") {
                    log.switcher("Subscribe ", qname, pvalue[0]);
                    switcher.subscribe_to_property(qname, pvalue[0]);
                }
                //unsubscribe to the property removed
                if (qprop == "on-property-removed") {
                    log.switcher("Unsubscribe ", qname, pvalue[0]);
                    switcher.unsubscribe_to_property(qname, pvalue[0]);
                }


            });

            log.debug("scenic is now initialize");
        }



        /** 
         *  Creating a view meter for viewing continuously from the
         *  interface if the video and audio streams are sent or received
         *  @param {string} quiddName The name (id) of the quiddity
         */

        function createVuMeter(quiddName) {
            log.debug("create vuMeter for " + quiddName);
            var shmdatas = $.parseJSON(switcher.get_property_value(quiddName, "shmdata-writers")).shmdata_writers;

            $.each(shmdatas, function(index, shmdata) {
                //remove the old vumeter just in case
                switcher.remove("vumeter_" + shmdata.path);
                var vumeter = switcher.create("fakesink", "vumeter_" + shmdata.path);

                if (!vumeter) {
                    log.error("failed to create fakesink quiddity : ", "vumeter_" + shmdata.path);
                    return false;
                } else {
                    log.debug("fakesink quiddity created : ", "vumeter_" + shmdata.path);
                }

                var ok = switcher.invoke(vumeter, "connect", [shmdata.path]);
                var subscribe = switcher.subscribe_to_property(vumeter, "byte-rate");
            });
        }


        return {
            test: "testSwitcher",
            initialize: initialize,
            quidds: quidds
        }

    })