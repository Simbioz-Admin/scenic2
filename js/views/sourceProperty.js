define(

    /** 
     *	View SourceProperty
     *	The SourcePorperty manages the source view of the properties added to the control panel
     *	@exports Views/SourceProperty
     */

    [
        'underscore',
        'backbone',
        'text!../../templates/sourceProperty.html',
    ],

    function(_, Backbone, TemplateSourceProperty) {

        /** 
         *	@constructor
         *  @requires Underscore
         *  @requires Backbone
         *	@requires TemplateSourceProperty
         *  @augments module:Backbone.View
         */

        var SourcePropertyView = Backbone.View.extend(

            /**
             *	@lends module: Views/sourceProperty~SourcePropertyView.prototype
             */

            {
                tagName: 'table',
                className: 'source',
                table: null,
                events: {
                    "click .edit-source": "edit",
                    "click .remove-source": "removeClick",
                    "click .preview": "preview",
                    'click .info': 'info',
                },

                initialize: function(options) {

                    /* subscribe to the modification of model link to this view */
                    this.model.on('remove', this.removeView, this);
                    this.model.on('add:property', this.render, this);
                    this.model.on('remove:property', this.render, this);

                    this.table = options.table;
                    this.render();

                    //here we define were go the source (local or remote)
                    if (this.model.get("class") == "httpsdpdec") {
                        $("#" + this.table + " #remote-sources").prepend($(this.el));
                    } else {
                        $("#" + this.table + " #local-sources").prepend($(this.el));
                    }

                },

                /* called when a new source in table control is created or when existing is updated (add or remove property) */

                render: function() {

                    var that = this,
                        properties = this.model.get("properties"),
                        destinations = (this.table == "transfer" ? collections.destinations.toJSON() : collections.destinationProperties.toJSON()),
                        countProperty = 0;

                    $(this.el).html("");

                    //parse the properties of source for show on interface
                    _.each(properties, function(property, index) {
                        if (property.name != "device" && property.name != "devices-json" && property.name != "started") {
                            var template = _.template(TemplateSourceProperty, {
                                property: property,
                                index: countProperty,
                                nbProperties: Object.keys(properties).length,
                                sourceName: that.model.get("name"),
                                destinations: destinations
                            });

                            $(that.el).append($(template));
                            countProperty++;
                        }
                    });

                    //if no properties we show the source anyway
                    if ($(that.el).html() == "") {
                        var template = _.template(TemplateSourceProperty, {
                            sourceName: that.model.get("name"),
                            property: null
                        });

                        $(that.el).append($(template));
                    }


                    //check if mapper exist for the 
                    collections.quidds.each(function(quidd) {
                        if (quidd.get("category") == "mapper" && quidd.get("view") != null) {
                            quidd.get("view").render();
                        }
                    });


                },
                edit: function() {
                    this.model.edit();
                },
                removeClick: function() {
                    this.model.delete();
                },
                removeView: function() {
                    this.remove();
                },
                preview: function(element) {
                    this.model.preview(element);
                },
                info: function(element) {
                    this.model.info(element);
                }
            });

        return SourcePropertyView;
    })