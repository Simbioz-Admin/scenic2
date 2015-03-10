define(
  /** 
   *  View EditQuidd
   *  Manage interaction between a specifc node and the interface for editing
   *  all modification are detected when we press enter or switch input
   *  @exports Views/EditQuidd
   */
  [
    'underscore',
    'backbone',
    'text!../../../templates/users/editUserSip.html',
  ],

  function(_, Backbone, TemplateEditDestinationRtp) {
    /** 
     *  @constructor
     *  @requires Underscore
     *  @requires Backbone
     *  @requires TemplateEditDestinationRtp
     *  @augments module:Backbone.View
     */

    var ViewEditDestination = Backbone.View.extend(
      /**
       *  @lends module: Views/EditQuidd~ViewEditDestination.prototype
       */
      {
        className: 'editUser',
        events: {
          "submit #form-user": 'update',
          "click .remove": 'removeUser',
        },

        /* Called when the view is initialized */
        initialize: function() {
          var that = this;
          //generate template for receive information about destination
          var template = _.template(TemplateEditDestinationRtp, {
            destination: that.model,
            listStatus: collections.users.listStatus
          });

          $(this.el).append(template);

          $("#panelRight .content").html($(this.el));
          views.global.openPanel();

        },
        update: function(e) {
          var that = this;
          var name = $('#name', this.el).val();
          var uri = this.model.get('uri');

          if(name){
            socket.emit('invoke', 'sipquid', 'name_buddy', [name, uri], function(err, msg){
              if (err) return views.global.notification('error', err);
              views.global.closePanel();
            });
          }

        },
        removeUser: function(e) {
          e.preventDefault();
          var that = this;
          var result = views.global.confirmation($.t("Are you sure?"), function(ok) {
            if (ok) {
              socket.emit("removeUser", that.model.get("uri"), function(err, msg) {
                if (err) return views.global.notification("error", err);
                views.global.notification("valid", msg);
                views.global.closePanel();
              });
              //socket.emit("invoke", "defaultrtp", "remove_destination", [that.get("name")], function(ok) {});
            }
          });
        }

      });

    return ViewEditDestination;
  })