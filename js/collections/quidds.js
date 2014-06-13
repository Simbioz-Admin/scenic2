define(

    /** 
     *	A module for creating collection of quiddities
     *	@exports collections/quidds
     */

    [
        'underscore',
        'backbone',
        'models/quidd',
    ],

    function(_, Backbone, QuiddModel) {

        /** 
         *	@constructor
         *  @requires Underscore
         *  @requires Backbone
         *	@requires QuiddModel
         *  @augments module:Backbone.Collection
         */

        var QuiddsCollection = Backbone.Collection.extend(

            /**
             *	@lends module:collections/quidds~QuiddsCollection.prototype
             */

            {
                model: QuiddModel,
                url: '/quidds/',
                listEncoder: [],
                parse: function(results, xhr) {
                    return results;
                },


                /** Initialization of the quidds Collection 
                 *	We declare all events for receive information about quiddities
                 */

                initialize: function() {
                    var that = this;

                    /** Event called when the server has created a quiddity */
                    socket.on("create", function(quiddInfo, socketId) {
                        console.log("CREATE", quiddInfo);
                        that.create(quiddInfo);
                    });

                    /** Event called when the server has removed a quiddity */
                    socket.on("remove", function(quidd) {

                        var PreviewQuidd = new RegExp('^((?!(gtkvideosink|pulsesink)).)*$');
                        if (!PreviewQuidd.test(quidd[0])) {

                            views.quidds.removePreviewIcon(quidd[0]);
                        }
                        that.delete(quidd);
                    });

                    /** Event called when a signal is emitted by switcher add/remove a method or property 
                     *	This event is called only if the user has the edit panel that quiddity is open
                     */
                    socket.on("signals_properties_info", function(prop, quiddName, value) {
                        that.signalsPropertiesInfo(prop, quiddName, value);
                    });


                    /** Event called when the value of a property changes */
                    socket.on("signals_properties_value", function(quiddName, prop, value) {
                        that.signalsPropertiesUpdate(quiddName, prop, value);
                    });

                    /** Event called when the shmdatas of specific quidd is created */
                    socket.on("updateShmdatas", function(qname, shmdatas) {
                        that.updateShmdatas(qname, shmdatas);
                    });

                    /** Event called when the shmdatas readers is updated */
                    socket.on("update_shmdatas_readers", function(name, shmdatas) {
                        /* we parse connection for add or remove */
                        var shmdatas = $.parseJSON(shmdatas).shmdata_readers;

                        $("[data-destination='" + name + "']").each(function(index, box) {
                            $(box).removeClass("active");
                            var path = $(box).parent().data("path");
                            _.each(shmdatas, function(shm) {
                                if (shm.path == path) $(box).addClass("active");
                            });
                        });
                    });
                },


                /**
                 *	Delete a model quiddity
                 *	This function is executed on event remove emitted by the server when switcher remove a quiddity
                 *	@param {string} quiddName The name of the quiddity (id) to remove
                 */

                delete: function(quiddInfo) {
                    var model = this.get(quiddInfo);
                    if (model) {
                        model.trigger('destroy', model);
                        if (quiddInfo.class != "sip") {
                            views.global.notification("info", quiddName + "  has deleted");
                        }
                    }
                },


                /**
                 *	create a model quiddity and add to the collection Quidds in client side
                 *	This function is executed on event create emitted by the server when switcher create a quiddity
                 *	@param {object} quiddInfo object json with information about the quiddity (name, class, etc...)
                 */

                create: function(quiddInfo) {
                    var model = new QuiddModel(quiddInfo);
                    this.add(model);
                    if (quiddInfo.class != "sip") {
                        views.global.notification("info", model.get("name") + " (" + model.get("class") + ") is created");
                    }
                    return model;
                },

                /**
                 *	add/remove property or method of a specific quiddity
                 *	This function is executed on event signals properties info emitted by the server when switcher add/remove method or property
                 *	@param {string} prop The type of event on property or method
                 *	@param {string} quiddName The name of the quiddity
                 *	@param {string}	name The name of the property or method
                 */

                signalsPropertiesInfo: function(prop, quiddName, name) {
                    var model = collections.quidds.get(quiddName);
                    if (prop == "on-property-removed") {
                        model.removeProperty(name[0]);
                    }
                    if (prop == "on-property-added") {
                        model.addProperty(name[0]);
                    }
                    if (prop == "on-method-added") {
                        model.addMethod(name[0]);
                    }
                    if (prop == "on-method-removed") {
                        model.removeMethod(name[0]);
                    }
                },


                /**
                 *	Update the property value of a specific quiddity
                 *	This function is executed on socket event signals properties update emitted by the server when switcher update a property value.
                 *	@param {string} prop The type of event on property or method
                 *	@param {string} quiddName The name of the quiddity
                 *	@param {string}	name The name of the property or method
                 *  @TODO Manage State shmdata and preview in specific QUiditty for fakeSink
                 */

                signalsPropertiesUpdate: function(quiddName, prop, value) {

                    /** if it's byte-rate we update directly the status of viewmeter */
                    if (prop == "byte-rate") {

                        var quiddNameArray = quiddName.split("_"),
                            quiddNameFakeSink = quiddName,
                            shmdata = quiddName.replace("vumeter_", "");

                        quiddName = quiddNameArray[quiddNameArray.length - 2];

                        collections.quidds.get(quiddName).updateByteRate(quiddNameFakeSink, shmdata, value);
                        // views.quidds.updateVuMeter(quiddName, name);

                    } else {
                        var model = collections.quidds.get(quiddName);
                        if (model) {
                            var properties = model.get("properties");
                            console.log("PROPS", properties);
                            if (properties.length == 0) {
                                model.set({
                                    properties: []
                                });
                                model.get('properties').push({
                                    name: prop,
                                    value: value
                                });

                            } else {
                                model.get("properties")[prop]["default value"] = value;
                            }

                            model.trigger("update:value", prop);
                        }
                    }
                },

                updateShmdatas: function(quiddName, shmdatas) {
                    var quidd = this.get(quiddName);
                    //sometimes the server ask to update shmdatas but is not yet insert in frontend, also we check that!
                    if (quidd) {
                        quidd.set("shmdatas", shmdatas);
                    }
                },

                /**
                 *	Ask to the server switcher the property value of a specific quiddity
                 *	@param {string} Name of the quiddity
                 *	@param {string} property The name of the property
                 *	@param {function} callback callback to send the value
                 */

                getPropertyValue: function(quiddName, property, callback) {
                    socket.emit("get_property_value", quiddName, property, function(err, propertyValue) {
                        if (err) return views.global.notification('error', err);
                        callback(propertyValue);
                    });
                },

                /**
                 *	Filter for get specific quidds of this collection
                 */
                SelectQuidds: function(category) {

                    var quidds = this.filter(function(quidd) {
                        return quidd.get("category") == category;
                    });

                    return quidds;
                }

            });

        return QuiddsCollection;
    })