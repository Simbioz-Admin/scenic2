define(

  /** 
   *  View SourceProperty
   *  The SourcePorperty manages the source view of the properties added to the control panel
   *  @exports Views/SourceProperty
   */

  [
    '../bower_components/underscore/underscore',
    'backbone',
    'text!../../templates/sourceProperty.html',
    'text!../../templates/table/source.html',
    'text!../../templates/table/source/shmdata/box.html',
  ],

  function(_, Backbone, SourcePropertyTemplate, SourceTemplate, BoxTemplate) {

    /** 
     *  @constructor
     *  @requires Underscore
     *  @requires Backbone
     *  @requires TemplateSourceProperty
     *  @augments module:Backbone.View
     */

    var SourcePropertyView = Backbone.View.extend(

      /**
       *  @lends module: Views/sourceProperty~SourcePropertyView.prototype
       */

      {
        tagName: 'table',
        className: 'source',
        table: null,
        events: {
          "click .edit-source": "edit",
          "click .remove-source": "removeClick",
          'click .info': 'info'
        },

        initialize: function(options) {

          /* subscribe to the modification of model link to this view */
          this.model.on('remove', this.removeView, this);
          this.model.on('add:property', this.render, this);
          this.model.on('remove:property', this.render, this);

          this.table = options.table;

          //here we define were go the source (local or remote)
          //if (this.model.get("class") == "httpsdpdec") {
            $("#" + this.table + " .sources").prepend($(this.el));
          /*} else {
            $("#" + this.table + " #local-sources").prepend($(this.el));
          }*/

          var quiddTpl = _.template(SourceTemplate)( {
            name: this.model.get("name")
          });
          $(this.el).append(quiddTpl);

          this.render();

        },

        /* called when a new source in table control is created or when existing is updated (add or remove property) */

        render: function() {
          /* remove all properties */
          $(".shmdatas", this.el).html("");

          var that = this,
            properties = this.model.get("properties"),
            destinations = (this.table == "transfer" ? collections.destinations.toJSON() : collections.controlDestinations.toJSON()),
            countProperty = 0;


          var boxTemplate = _.template( BoxTemplate );

          _.each(properties, function(property, index) {
            if (property.name != "device" && property.name != "devices-json" && property.name != "shmdata-writers" && property.name != "shmdata-readers" && property.name != "started") {
              var propertyTpl = _.template(SourcePropertyTemplate)( {
                property: property
              });
              var prop = $(".shmdatas", that.el).append(propertyTpl);
              _.each(destinations, function(destination) {
                var active = false;
                prop.append( boxTemplate( {
                  status:        active ? 'active' : '',
                  name:          'connect-properties',
                  destinationId: destination.name,
                  port:          null
                } ) );
              });

              $(that.el).i18n();
            }
          });

          //check if mapper exist for the 
          collections.quiddities.each(function(quidd) {
            if (quidd.get("category") == "mapper" && quidd.get("view") != null) {
              quidd.get("view").render();
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
        info: function(element) {
          this.model.info(element);
        }
      });

    return SourcePropertyView;
  })