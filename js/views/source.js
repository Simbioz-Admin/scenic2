define(

    /** 
     *	View Source
     *	The source view is for each source type quiddity create whatsoever to control or transfer table
     *	@exports Views/Launch
     */

    [
        'underscore',
        'backbone',
        'views/connexion',
        'views/shmdata',
        'text!../../templates/source.html'
    ],

    function(_, Backbone, ConnexionView, ViewShmdata, TemplateSource) {

        /** 
         *	@constructor
         *  @requires Underscore
         *  @requires Backbone
         *	@requires TemplateSource
         *  @augments module:Backbone.View
         */

        var SourceView = Backbone.View.extend(

            /**
             *	@lends module: Views/source~SourceView.prototype
             */

            {
                tagName: 'div',
                className: 'source',
                table: null,
                events: {
                    "click .edit": "edit",
                    "click .remove": "removeClick",
                    "click .preview": "preview",
                    'click .info': 'info'
                },

                /* Called when en new source quiddity is created */

                initialize: function(options) {
                    /* Subscribe for remove and change shmdatas on quiddity source */
                    this.model.on('remove', this.removeView, this);
                    this.model.on('updateShmdatas', this.render, this);
                    this.model.on('updateByteRate', this.updateByteRateAndPreview);
                    this.table = options.table;

                    if (this.table.get("type") == "transfer") this.renderTransfer();
                    if (this.table.get("type") == "sink") this.renderSink();
                },


                renderTransfer: function() {
                    var that = this;
                    if (this.model.get("class") == "httpsdpdec") {
                        $("#" + this.table.get("type") + " #remote-sources").append($(this.el));
                    } else {
                        $("#" + this.table.get("type") + " #local-sources").append($(this.el));
                    }
                    var quiddTpl = _.template(TemplateSource, {
                        name: this.model.get("name")
                    });
                    $(this.el).append(quiddTpl);

                    /* we create a view for each shmdata existing */
                    this.model.get("shmdatasCollection").each(function(shm) {
                        new ViewShmdata({
                            model: shm,
                            modelQuidd: that.model,
                            table: that.table
                        });
                    });
                },

                renderSink: function() {
                    var that = this;
                    console.log("a");
                    /* 1. parse all shmdata of the quidd for create view in table sink */
                    this.model.get("shmdatasCollection").each(function(shm) {
                        /* 2. in first time we need to check if the table of the type of shmdata exist */
                        that.table.trigger("newCategoryTable", shm.get("type"));
                        console.log("ASH FOR NEW TABLE", shm.get("type"));
                        /* 3. we create a view shmdata for each */
                        new ViewShmdata({
                            model: shm,
                            modelQuidd: that.model,
                            table: that.table
                        });


                    });
                },

                render: function() {
                    var that = this,
                        // shmdatas = this.model.get("shmdatas"),
                        table = collections.tables.findWhere({
                            type: this.table
                        });

                    //console.log("render Quiddity Source " + this.model.get("name") + " for the table " + this.table);
                    // console.log(this.model.get("shmdatasCollection").toJSON());

                    this.model.get("shmdatasCollection").each(function(shm) {
                        that.table.trigger("newCategoryTable", shm.get("type"));
                        shm.createViewForTable(that.table);
                    });


                    //render the shmdatas of the source
                    //if (typeof shmdatas == "object" && shmdatas.length != 0) {

                    /* for each shmdata model we create a view for the current table  */


                    /* for each shmdata wer create a source, this source can be connect with destination */
                    // _.each(shmdatas, function(shmdata, index) {

                    //     /* Parsing destination for generate connexion */
                    //     var connexions = "";

                    //     table.get("collectionDestinations").each(function(destination) {
                    //         /* check if the connexion existing between source and destination */
                    //         var active = '';
                    //         var port = '';
                    //         if (that.table == "transfer") {
                    //             _.each(destination.get("data_streams"), function(stream) {
                    //                 if (stream.path == shmdata.path) {
                    //                     active = "active";
                    //                     port = stream.port;
                    //                 }
                    //             });
                    //         }

                    //         if (that.table == "audio") {
                    //             var shmdata_readers;

                    //             _.each(destination.get("properties"), function(prop) {
                    //                 if (prop.name == "shmdata-readers" && prop.value) shmdata_readers = $.parseJSON(prop.value).shmdata_readers;
                    //             });

                    //             _.each(shmdata_readers, function(shm) {
                    //                 if (shm.path == shmdata.path) active = "active";
                    //             });

                    //         }
                    //         var connexion = '<td class="box ' + active + ' ' + that.table + ' " data-destination="' + destination.get("name") + '" data-id="' + destination.get("id") + '">' + port + '</td>';
                    //         connexions = connexions + connexion;
                    //     });

                    //     /* add template shmdata to the source view  */
                    //     var template = _.template(TemplateSource, {
                    //         shmdata: shmdata,
                    //         index: index,
                    //         nbShmdata: shmdatas.length,
                    //         sourceName: that.model.get("name"),
                    //         connexions: connexions
                    //     });

                    //     $(that.el).append(template);
                    //     // /* wait 1sec for show status shmdata (flux actif or not) */
                    //     // setTimeout(function() {
                    //     //     that.setPreview(shmdata);
                    //     // }, 1000);
                    // });

                    //if there is not a record is made shmdata anyway
                    // } else {
                    //     var template = _.template(TemplateSource, {
                    //         sourceName: that.model.get("name"),
                    //         shmdata: null
                    //     });

                    //     $(that.el).append($(template));
                    // }
                },


                /* called when we want to have a preview of the quiddity (audio or video) */

                setPreview: function(shmdata) {

                    var that = this;

                    //get info about vumeter for know if we can create a preview
                    collections.quidds.getPropertyValue("vumeter_" + shmdata.path, "caps", function(info) {
                        info = info.split(",");

                        if (info[0] == "audio/x-raw-int" || info[0] == "audio/x-raw-float" || info[0] == "video/x-raw-yuv" || info[0] == "video/x-raw-rgb") {

                            var type = (info[0].indexOf("video") >= 0 ? "gtkvideosink" : "pulsesink");
                            //check if the quiddity have already a preview active
                            socket.emit("get_quiddity_description", that.model.get("name") + type, function(quiddInfo) {
                                var active = (quiddInfo.name ? "active" : "");
                                $("[data-path='" + shmdata.path + "'] .nameInOut .short").append("<div class='preview " + active + "'></div>");
                            });
                        }
                    });

                },
                edit: function() {
                    this.model.edit();
                },
                removeClick: function() {
                    this.model.askDelete();
                },
                removeView: function() {
                    this.remove();
                },
                preview: function(element) {
                    this.model.preview(element);
                    $(element.target).toggleClass("active");
                },
                info: function(element) {
                    this.model.info(element);
                }
            });

        return SourceView;
    })