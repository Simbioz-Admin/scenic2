define(

  /** 
   *  View Destination
   *  Manage interaction with the Destination Model (quiddity)
   *  @exports Views/Destination
   */

  [
    'underscore',
    'backbone',
    'lib/socket',
    'text!../templates/destination.html',
  ],

  function(_, Backbone, socket, TemplateDestination) {

    /** 
     *  @constructor
     *  @requires Underscore
     *  @requires Backbone
     *  @requires TemplateDestination
     *  @augments module:Backbone.View
     */

    var ViewDestination = Backbone.View.extend(

      /**
       *  @lends module: Views/Destination~ViewDestination.prototype
       */

      {
        tagName: 'div',
        className: 'destination',
        table: null,
        events: {
          "click .edit": "edit",
          "change input.send": "sendToUserSip",
          "click .remove": "removeClick"
        },


        /* Called when the view is initialized */

        initialize: function(options) {

          var that = this;

          this.model.on('change', this.render, this);
          this.model.on('destroy', this.removeView, this);
          this.model.on('destroyDestinationMatrix', this.removeView, this);
          this.model.on("toggleShow", this.toggleShow, this);

          this.table = options.table;

          /* we check if the category of this quidd exist in filter table */
          if (this.model.get("category")) this.table.trigger("addCategoryFilter", this.model.get("category"));

          if (this.model.get("category")) {
            $(this.el).attr("data-type", this.model.get("category"));
          }

          //add the template to the destination table transfer
          // if (this.model.get("category")) this.table.trigger("newCategoryTable", this.table.get("type"), this.model.get("category").replace(" sink", ""));

          var category = this.model.get("category") ? " [data-type='" + this.model.get("category").replace(" sink", "") + "']" : "";
          $("#" + this.table.get("id") + " .destinations").append($(this.el));
          this.render();
          //Render connection shmdata for this destination
          var sources = this.table.get("collectionSources");
          sources.each(function(source) {
            if (source) {
              var shmdatas = source.get("shmdatasCollection");
              shmdatas.each(function(shm) {
                shm.trigger("renderConnection", that.model, that.table.get("type"));
              });
            }
          });

        },

        render: function() {
          var that = this,
          template = _.template(TemplateDestination)( this.model.toJSON());
          $(this.el).html(template);
          $(this.el).i18n();
        },

        toggleShow: function(state, tableName) {

          /* trigger is called for all destination, we need to check if its for the good table */
          if (this.table.get("name") == tableName) {
            if (state == "show") {
              $(this.el).show();
              $("[data-destination='" + this.model.get("name") + "']").show();
            } else {
              $(this.el).hide();
              $("[data-destination='" + this.model.get("name") + "']").hide();
            }
          }
        },
        /* Called when the click event is on the button edit destination */
        edit: function() {
          this.model.edit();
        },

        sendToUserSip: function() {
          var that = this;
          var call = this.model.get('send_status') == "disconnected" ? "send" : "hang-up";
          socket.emit('invoke', config.sip.quiddName, call, [this.model.get('uri')], function(err) {
            if (err) return views.global.notification('error', err);
            views.global.notification("valid", $.t("successfully called ") + that.model.get('name'));
          });
        },
        /* Called when the click event is on the button remove destination */
        removeClick: function() {
          this.model.askDelete();
        },


        /* Called when the model is removed */
        removeView: function() {
          /* remove category in filter (check if its the last quidd of this category) */
          if (this.model.get("category")) this.table.trigger('removeCategoryFilter', this.model.get("category"), "destination");
          this.remove();

          /* remove old box */
          $("[data-destination='" + this.model.get('name') + "']").remove();

          //reset button add table list user
          $('[data-idUser="' + this.model.get('uri') + '"] .add_destinationSip').removeClass('call hangUp').addClass('add_table');
        }
      });

    return ViewDestination;
  })
