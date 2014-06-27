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
                    "click .edit-source": "edit",
                    "click .remove-source": "removeClick",
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
                        that.table.trigger("newCategoryTable", that.table.get("type"), shm.get("type"));

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
                        that.table.trigger("newCategoryTable", that.table.get("type"), shm.get("type"));
                        shm.createViewForTable(that.table);
                    });


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