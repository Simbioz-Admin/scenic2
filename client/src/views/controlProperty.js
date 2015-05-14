define(

  /** 
   *	View ControlProperty
   *	Manage interaction for the properties controlable on the table control (destination)
   *	@exports Models/ControlProperty
   */

  [
    'underscore',
    'backbone',
    'text!../../templates/table/destination.html'
  ],

  function(_, Backbone, TemplateDestination) {
    /** 
     *	@constructor
     *  @requires Underscore
     *  @requires Backbone
     *	@requires TemplateDestination
     *  @augments module:Backbone.View
     */

    var ControlPorpertyView = Backbone.View.extend(
      /**
       *	@lends module: Views/ControlPorpertyView~TableModel.prototype
       */


      {
        tagName: 'td',
        className: 'destination',
        table: null,
        events: {
          "click .edit": "edit",
          "click .remove": "removeClick"
        },

        /* Called when the view is initialized */
        initialize: function(options) {
          /* subscribe to suppression of the model */
          this.model.on('remove', this.removeView, this);
          this.table = options.table;
          console.log(this.model.toJSON());
          var name = this.model.get("name").replace("_", "<br>");
          var that = this,
          template = _.template(TemplateDestination)( this.model.toJSON());

          $(this.el).append(template);

          //add the template to the destination table control
          $("#" + this.table + " .destinations").append($(this.el));

          /* add for each property of source control a new box for the connection */
          $("#control .shmdata").each(function(index, source) {
            $(this).append("<td class='box connect-properties' data-nameandproperty='" + that.model.get("name") + "'></td>");
          });

        },

        /* Called when the click event is on the button edit of property */
        edit: function() {
          this.model.edit();
        },

        /* Called when the click event is on the button remove of property */
        removeClick: function() {
          var that = this;
          console.log("model", this.model.get("name"));
          this.model.askDelete();
        },

        /* Called when the model is removed */

        removeView: function() {
          this.remove();
        }
      });

    return ControlPorpertyView;
  })
