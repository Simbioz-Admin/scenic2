define(

    /** 
     *	View Table
     *	The Table view manages activities related to the table, render and actions on menu
     *	@exports Views/Table
     */

    [
        'underscore',
        'backbone',
        'text!/templates/table/table.html',
        'text!/templates/table/sub_menu.html',
    ],

    function(_, Backbone, TemplateTable, TemplateSubMenu) {

        /** 
         *	@constructor
         *  @requires Underscore
         *  @requires Backbone
         *	@requires TemplateTable
         *	@requires TemplateSubMenu
         *  @augments module:Backbone.View
         */

        var TableView = Backbone.View.extend(

            /**
             *	@lends module: Views/Table~TableView.prototype
             */

            {
                tagName: 'div',
                className: 'table',
                events: {
                    "mouseenter #create-quiddsProperties": "getMenuProperties",
                    "mouseenter #create-midi": "getMenuMidiDevice",
                    "mouseenter .get_classes": 'get_classes',
                    "mouseleave #subMenu": 'leaveSubMenu',
                    "click .box": "ask_connection",
                    "keypress #port_destination": "set_connection",
                    "blur #port_destination": "removeInputDestination",
                },

                /* Called on initialization of the table (control / transfer) */
                initialize: function() {


                    this.model.on("trigger:menu", this.get_classes, this);

                    /* generate a btn for the table */
                    var currentTable = localStorage["currentTable"] ? localStorage["currentTable"] : config.defaultPanelTable;

                    var active = (currentTable == this.model.get("type") ? "active" : "");
                    var btnTable = $("<div></div>", {
                        text: "",
                        class: "tabTable " + this.model.get("type") + " " + active,
                        data: {
                            type: this.model.get("type")
                        }
                    });
                    btnTable.append("<div class='content'></div>");
                    $("#panelTables").prepend(btnTable);


                    /* generate the table */
                    var template = _.template(TemplateTable, {
                        type: this.model.get("type"),
                        menus: this.model.get("menus")
                    });
                    $(this.el)
                        .attr("id", this.model.get("type"))
                        .addClass(active)
                        .html(template);


                    /* add to the default panel */
                    $("#panelLeft").append(this.el);


                },


                /* Called for get list of quiddity source 
                 *	The list of quiddity source is get when source word appear in name Class quiddity
                 */

                get_classes: function(e) {
                    $("#subMenu").remove();
                    var type = e.target ? $(e.target).data("type") : e;

                    /* get the quiddity classes authorized on this table */
                    var classes = this.model.classes_authorized(type);

                    /* we not load classes if nothing is return */
                    if (classes.length == 0) return;

                    /* GroupBy category the list of classes */
                    var classesByCategory = _.groupBy(classes, function(clas) {
                        return clas.category;
                    });

                    var template = _.template(TemplateSubMenu, {
                        type: "classes",
                        classes: classesByCategory
                    });

                    $("#listSources", this.el).remove();
                    $(".table.active [data-type='" + type + "']").after(template);

                    /* here we listen select for call views.quidds.defineName */
                    $("#subMenu").menu({
                        delay: 0,
                        position: {
                            at: "right-2 top-2"
                        }
                    }, {
                        select: function(event, ui) {
                            event.preventDefault();
                            views.quidds.defineName(ui.item);
                        }
                    }).focus();

                },

                leaveSubMenu: function(e) {
                    $("#subMenu").remove();
                },

                ask_connection: function(e) {

                    var box = $(e.target),
                        destination = box.data("destination"),
                        id = box.data("id"),
                        path = box.parent().data("path");


                    /* if transfer we ask port for connect to the receiver */
                    if (this.model.get("type") == "transfer") {
                        /* if already connect */
                        if (box.hasClass("active")) return socket.emit("remove_connection", path, id, function(ok) {});
                        box.html("<div class='content-port-destination' ><input id='port_destination' autofocus='autofocus' type='text' placeholder='specify an even port'></div>");
                    }

                    if (this.model.get("type") == "audio") {
                        if (box.hasClass("active")) {
                            socket.emit("invoke", destination, "disconnect", [], function(data) {})
                        } else {

                            socket.emit("invoke", destination, "connect", [path], function(data) {});
                        }
                    }

                },

                set_connection: function(e) {
                    var that = this;

                    if (e.which == 13) //touch enter
                    {
                        var box = $(e.target).parent(),
                            id = $(e.target).closest("td").data("id"),
                            path = $(e.target).closest("tr").data("path"),
                            quiddName = $(e.target).closest("tr").data("quiddname"),
                            port = $(e.target).val(),
                            portSoap = this.model.get("collectionDestinations").get(id).get("portSoap"),
                            that = this;

                        socket.emit("connect_destination", quiddName, path, id, port, portSoap, function(ok) {
                            that.removeInputDestination(e);
                        });
                    }
                },

                /* removes the input who we defined the port */
                removeInputDestination: function(element) {
                    $(element.target).parent().parent().html("");
                },


                /* 
                 *	called for showing list of properties existing
                 *	We show only the propertie of quiddities added to the table transfer
                 */

                getMenuProperties: function(element) {
                    var quiddsMenu = {};
                    collections.quidds.each(function(quidd) {
                        var quiddCategory = quidd.get("category");
                        if (quiddCategory.indexOf("source") != -1 && quidd.get("class") != "midisrc") {
                            var listProperties = [];
                            _.each(quidd.get("properties"), function(property) {
                                if (!collections.controlProperties.get(quidd.get("name") + "_" + property.name) && property.writable == "true" && property.name != "started") {
                                    listProperties.push(property.name);
                                    quiddsMenu[quidd.get("name")] = listProperties;
                                }
                            });
                        }
                    });

                    $("#listQuiddsProperties").remove();
                    if (!$.isEmptyObject(quiddsMenu)) {
                        var template = _.template(TemplateSubMenu, {
                            type: "QuiddsAndProperties",
                            menus: quiddsMenu
                        });
                        $(element.target).after(template);
                    } else {
                        views.global.notification("error", "you need to create source before to add a property");
                    }
                },


                /* Called for get the list of device Midi */

                getMenuMidiDevice: function(element) {
                    $("#listDevicesMidi").remove();
                    collections.classesDoc.getPropertyByClass("midisrc", "device", function(property) {
                        var devicesMidi = property["values"];
                        _.each(devicesMidi, function(device, index) {
                            collections.quidds.each(function(quidd) {
                                if (quidd.get("class") == "midisrc") {
                                    _.each(quidd.get("properties"), function(property) {
                                        if (property.name == "device" && property.value == device.name) delete devicesMidi[index];
                                    });
                                }
                            });
                        });

                        var template = _.template(TemplateSubMenu, {
                            type: "devicesMidi",
                            menus: devicesMidi
                        });
                        $(element.target).after(template);
                    });
                }
            });

        return TableView;
    })