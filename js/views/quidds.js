define(

    /** 
     *	View Quidds
     *	The Launch View to manage the interface scenic pre-configuration  when launched
     *	@exports Views/Launch
     */

    [
        'underscore',
        'backbone',
        'models	/quidd',
        'text!/templates/createQuidd.html',
        'text!/templates/quidd.html',

    ],

    function(_, Backbone, QuiddModel, quiddCreateTemplate, quiddTemplate) {

        /** 
         *	@constructor
         *  @requires Underscore
         *  @requires Backbone
         *	@requires QuiddModel
         *	@requires quiddCreateTemplate
         *	@requires quiddTemplate
         *  @augments module:Backbone.View
         */

        var QuiddView = Backbone.View.extend(

            /**
             *	@lends module: Views/launch~LaunchView.prototype
             */

            {
                el: 'body',
                events: {
                    "menuselect .createQuidd a": "defineName",
                    "click #create": "create",
                },
                delayAutoDetect: false,

                initialize: function() {},



                /* open the lightbox and show the properties to define for create the quidd Source 
                 * ALERT : This function is call in views/table.js Because we use jqueryui and we cant access events in view declaration
                 */

                defineName: function(element) {
                    console.log(element);
                    var className = $(element).data("name");
                    var getDevices = $(element).hasClass("autoDetect");
                    /* get  the information about the device in property value of quiddity */
                    if (getDevices) {
                        socket.emit("get_property_by_class", className, "device", function(property) {
                            if (property) {
                                console.log("Property", property.values);
                                openPanelDefineName(property.values);
                            } else {
                                views.global.notification("error", "no video device");
                            }
                        });
                    } else {
                        openPanelDefineName(false);
                    }

                    function openPanelDefineName(devices) {

                        var template = _.template(quiddCreateTemplate, {
                            title: "Define name for " + className,
                            className: className,
                            devices: devices
                        });

                        $("#panelRight .content").html(template);
                        views.global.openPanel();

                    }
                },


                /* Called after the user define a name for create a quiddity */

                create: function(element) {

                    var that = this,
                        className = $("#className").val(),
                        quiddName = $("#quiddName").val(),
                        deviceDetected = $("#device").val();
                    /* Ask to the server create a new quiddity with className and name quiddity*/
                    console.log(socket.socket.sessionid);
                    socket.emit("create", className, quiddName, socket.socket.sessionid, function(err, quiddInfo) {
                        if (err) return views.global.notification('error', err);
                        var model = collections.quidds.create(quiddInfo);
                        //check if autoDetect it's true if yes we set the value device with device selected
                        if (deviceDetected) {
                            model.setPropertyValue("device", deviceDetected, function(ok) {
                                model.edit();
                            });
                        } else model.edit();
                    });

                },

                /* called when we can know if there are any device connected to the quiddity */

                autoDetect: function(element) {
                    /* we need to put the autodetect in timeout for not trigg directly when the mouse hover the menu */
                    this.delayAutoDetect = setTimeout(function() {

                        //create temporary v4l2 quiddity for listing device available
                        var className = $(element.target).data("name");

                        /* get  the information about the device in property value of quiddity */
                        socket.emit("get_property_by_class", className, "device", function(property) {
                            if (property) {
                                var deviceDetected = property["values"];
                                //clean list existing and add the new
                                $("#deviceDetected").remove();
                                $("[data-name='" + className + "']").append("<ul id='deviceDetected'></ul>");
                                _.each(deviceDetected, function(device) {
                                    var li = $("<li></li>", {
                                        text: device["name"] + " " + device["nick"],
                                        class: 'source',
                                        data: {
                                            name: className,
                                            devicedetected: device["value"]
                                        },
                                    });
                                    $("#deviceDetected").append(li);
                                });
                            } else {
                                views.global.notification("error", "no video device");
                            }
                        });

                    }, 500);
                },

                /* Called when user leave a class Quiddity with device autodetect */

                leaveAutoDetect: function() {
                    clearTimeout(this.delayAutoDetect);
                },

                /* Called each time we receive signal for vumter */

                updateVuMeter: function(quiddName, value) {
                    var shmdata = quiddName.replace("vumeter_", "");
                    if (value > 0) $("[data-path='" + shmdata + "']").removeClass("inactive").addClass("active");
                    else $("[data-path='" + shmdata + "']").removeClass("active").addClass("inactive");
                },

                /* called when a quiddity type previe audio video is removed for remove class active to icon Preview */

                removePreviewIcon: function(quidd) {
                    console.log(quidd);
                    var shmdata = quidd.split('_');
                    shmdata = shmdata[1] + "_" + shmdata[2] + "_" + shmdata[3] + "_" + shmdata[4];
                    $("[data-path='" + shmdata + "'] .preview").removeClass("active");
                },
                addPreviewIcon: function(quidd) {
                    var shmdata = quidd.split('_');
                    shmdata = shmdata[1] + "_" + shmdata[2] + "_" + shmdata[3] + "_" + shmdata[4];
                    console.log(shmdata);
                    $("[data-path='" + shmdata + "'] .preview").addClass("active");
                }

            });

        return QuiddView;
    })