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
        'text!../../templates/panelInfoSource.html',
        'libs/StringTricks'
    ],

    function(_, Backbone, TemplateShmdata, infoTemplate, ST) {

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
                table: null,
                className: "shmdata",
                events: {
                    "click th": "infoShmdata",
                    'click .edit': "editQuidd",
                    'click .remove': "removeQuidd"
                },

                /* called for each new mapper */
                initialize: function(options) {
                    /* Subscribe to the remove of a specific mapper */
                    this.model.on('remove', this.removeView, this);
                    this.model.on("change:byteRate", this.updateByteRate, this);
                    this.model.on("renderConnection", this.renderConnections, this);
                    this.table = options.table;
                    // this.render();

                },

                /* Called for render the view */
                render: function() {
                    var nameShm = this.model.get("path").split('_')[3];
                    var pathShm = this.model.get("path").split("/");
                    // var fullNameShm = pathShm[pathShm.length - 1];
                    //nameShm = ST.mask(fullNameShm);
                    templateShmdata = _.template(TemplateShmdata, {
                        name: nameShm,
                        nameQuidd: this.model.get("quidd"),
                        tableType: this.table.get("type")
                    });

                    $(this.el).append(templateShmdata);
                    $(this.el).attr("data-path", this.model.get("path"));

                    /* insert view in the quidd associate to */
                    if (this.table.get("type") == "transfer") {
                        $("#" + this.table.get("type") + " #quidd_" + this.model.get("quidd") + " .shmdatas").append(this.el);
                    }

                    if (this.table.get("type") == "sink") {
                        $("#" + this.table.get("type") + " [data-type='" + this.model.get('category') + "']" + " .shmdatas").append(this.el);
                    }


                    this.renderConnections();
                },

                renderConnections: function() {
                    var that = this;
                    $("td", that.el).remove();
                    _.defer(function(){
                        that.table.get("collectionDestinations").each(function(destination) {
                            console.log(destination);
                            that.connectionForDestination(destination, that.table.get("type"));
                        });
                    });
                },

                connectionForDestination: function(destination, tableType){
                    /* check if the connexion existing between source and destination */
                    var that = this;
                    var active = '';
                    var port = '';
                    /* Render for Tab transfer */
                    if (tableType == "transfer" && that.table.get("type") == tableType && $('[data-destination="' + destination.get("name") + '"]', that.el).length == 0) {
                        _.each(destination.get("data_streams"), function(stream) {
                            if (stream.path == that.model.get("path")) {
                                active = "active";
                                port = stream.port;
                            }
                        });
                        $(that.el).append('<td class="box ' + active + " " + that.table.get("name") + '" data-destination="' + destination.get("name") + '" data-id="' + destination.get("name") + '">' + port + '</td>');
                    }
 
                    /* Render for Tab Sink */
                    if (tableType == "sink" && that.table.get("type") == tableType) {

                        /* Check if we can create a connexion between shmdata and sink */
                        socket.emit("invoke", destination.get("name"), "can-sink-caps", [that.model.get("caps")], function(canSink){
                          if($('[data-destination="' + destination.get("name") + '"]', that.el).length == 0){
                              if(canSink == "true"){

                                /* Check if already connected */
                                var shmdata_readers = null;
                                var shmdatasReaders = destination.get("shmdatasCollection").where({type : 'reader'});

                                if(shmdatasReaders){
                                    _.each(shmdatasReaders,function(shm) {
                                        if (shm.get('path') == that.model.get("path")) active = "active";
                                    });
                                }

                                  $(that.el).append('<td class="box ' + active + " " + that.table.get("name") + '" data-destination="' + destination.get("name") + '" data-id="' + destination.get("name") + '">' + port + '</td>');
                              } else {
                                  $(that.el).append('<td class="box_disabled ' + that.table.get("name") + '" data-destination="' + destination.get("name") + '" data-id="' + destination.get("name") + '"></td>');
                              }
                          }
                        });

                    }
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
                },
                editQuidd: function() {
                    collections.quidds.get(this.model.get("quidd")).edit();
                },
                removeQuidd: function() {
                    collections.quidds.get(this.model.get("quidd")).askDelete();
                },
            });

        return ShmdataView;
    })