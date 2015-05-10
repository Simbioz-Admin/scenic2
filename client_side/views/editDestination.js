define(
  /** 
   *	View EditQuidd
   *	Manage interaction between a specifc node and the interface for editing
   *	all modification are detected when we press enter or switch input
   *	@exports Views/EditQuidd
   */
  [
    'underscore',
    'backbone',
    'text!../../templates/editDestinationRtp.html',
  ],

  function(_, Backbone, TemplateEditDestinationRtp) {
    /** 
     *	@constructor
     *  @requires Underscore
     *  @requires Backbone
     *	@requires TemplateEditDestinationRtp
     *  @augments module:Backbone.View
     */

    var ViewEditDestination = Backbone.View.extend(
      /**
       *	@lends module: Views/EditQuidd~ViewEditDestination.prototype
       */
      {
        events: {
          "submit #form-destination": 'save'
        },

        /* Called when the view is initialized */
        initialize: function() {
          var that = this;
          //generate template for receive information about destination
          var template = _.template(TemplateEditDestinationRtp)( {
            destination: that.model
          });

          $(this.el).append(template);

          $("#panelRight .content").html($(this.el));
          views.global.openPanel();

        },
        save: function(e) {
          var that = this;
          var destination = {
            name: $("#name", this.el).val(),
            hostName: $("#hostName", this.el).val(),
            portSoap: $("#portSoap", this.el).val(),
            data_streams: this.model.get("data_streams")

          },
          oldId = this.model.get("id");

          socket.emit("update_destination", oldId, destination, function(data) {
            if (data.success) {
              views.global.closePanel();
            }
          });
        }

      });

    return ViewEditDestination;
  })
