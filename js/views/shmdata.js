define(

    /** 
     *  View Shmdata
     *  Map view for create shmdata for each quiddity in each table
     *  @exports Views/Shmdata
     */

    [
        'underscore',
        'backbone',
        'text!../../templates/shmdata.html',
        'text!../../templates/panelInfoSource.html'
    ],

    function(_, Backbone, TemplateShmdata, infoTemplate) {

        /** 
         *  @constructor
         *  @requires Underscore
         *  @requires Backbone
         *  @requires TemplateShmdata
         *  @augments module:Backbone.View
         */

        var ShmdataView = Backbone.View.extend(

            /**
             *  @lends module: Views/Shmdata~ShmdataView.prototype
             */

            {
                tagName: 'tr',
                className: 'shmdata',
                table: null,
                events: {
                    "click th": "infoShmdata"
                },

                /* called for each new mapper */
                initialize: function(options) {
                    /* Subscribe to the remove of a specific mapper */
                    this.model.on('remove', this.removeView, this);
                    this.model.on("change:byteRate", this.updateByteRate, this);
                    this.table = options.table;
                    //console.log("Create shmdata for the quidd " + this.model.get("quidd") + " for the table " + this.table);
                    this.render();

                },

                /* Called for render the view */
                render: function() {
                    var nameShm = this.model.get("path").split('_')[3];
                    templateShmdata = _.template(TemplateShmdata, {
                        name: nameShm
                    });
                    $(this.el).append(templateShmdata);
                    $(this.el).attr("data-path", this.model.get("path"));
                    $("#" + this.table + " #quidd_" + this.model.get("quidd") + " .shmdatas").append(this.el);
                    this.renderConnexions();
                },
                renderConnexions: function() {
                    var that = this;
                    var table = collections.tables.findWhere({
                        type: this.table
                    });

                    table.get("collectionDestinations").each(function(destination) {

                        /* check if the connexion existing between source and destination */
                        var active = '';
                        var port = '';
                        if (table.get("type") == "transfer") {
                            _.each(destination.get("data_streams"), function(stream) {
                                if (stream.path == that.model.get("path")) {
                                    active = "active";
                                    port = stream.port;
                                }
                            });
                        }

                        if (table.get("type") == "audio") {
                            var shmdata_readers;
                            _.each(destination.get("properties"), function(prop) {
                                if (prop.name == "shmdata-readers" && prop.value) shmdata_readers = $.parseJSON(prop.value).shmdata_readers;
                            });

                            _.each(shmdata_readers, function(shm) {
                                if (shm.path == that.model.get("path")) active = "active";
                            });

                        }
                        $(that.el).append('<td class="box  ' + active + " " + table.get("name") + '" data-destination="' + destination.get("name") + '" data-id="' + destination.get("name") + '">' + port + '</td>')

                    });

                },
                updateByteRate: function() {
                    if (this.model.get("byteRate") > 0) $(this.el).removeClass("inactive").addClass("active");
                    else $(this.el).removeClass("active").addClass("inactive");
                },

                /*
                 *  Get information about the quiddity and show on the interface.
                 *  the information is present in vumeter quiddity created with each quiddity soruce
                 */

                infoShmdata: function(element) {
                    var shmdata = this.model.get("path");
                    var that = this;
                    collections.quidds.getPropertyValue("vumeter_" + shmdata, "caps", function(val) {
                        val = val.replace(/,/g, "<br>");
                        var template = _.template(infoTemplate, {
                            info: val,
                            shmdata: shmdata
                        });
                        $("#info").remove();
                        $("body").prepend(template);
                        $("#info").css({
                            top: element.pageY,
                            left: element.pageX
                        }).show();
                        $(".panelInfo").draggable({
                            cursor: "move",
                            handle: "#title"
                        });
                    });
                },
                removeView: function() {
                    this.remove();
                }
            });

        return ShmdataView;
    })