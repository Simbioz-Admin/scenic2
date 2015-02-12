define(

  /** 
   *  Model User
   *  @exports Models/User
   */

  [
    'underscore',
    'backbone',
    'views/users/user',
    'views/users/editUser',
    'views/destination'
  ],

  function(_, Backbone, ViewUser, ViewEditUser, ViewDestination) {

    /** 
     *  @constructor
     *  @requires Underscore
     *  @requires Backbone
     *  @requires ViewUser
     *  @requires ViewDestination
     *  @augments module:Backbone.Model
     */

    var UserModel = Backbone.Model.extend(

      /**
       *  @lends module: Models/User~UserModel.prototype
       */

      {
        idAttribute: "uri",
        defaults: {
          name: null,
          sip_url: null,
          status: null,
          status_text: "Aucun message",
          subscription_state: "Aucun message",
          itsMe: false,
          in_tab: false,
          call: false,
          connection: {}
        },
        initialize: function() {
          if (this.get('in_tab')) this.add_tab();
          new ViewUser({
            model: this
          });
        },
        add_tab: function() {
          //we create automatically the view for destination based on ViewDestination
          var view = new ViewDestination({
            model: this,
            table: collections.tables.findWhere({
              id: "transferSip"
            })
          });
        },
        askDelete: function() {
          var that = this;

          var result = views.global.confirmation("Are you sure?", function(ok) {
            if (ok) {
              //Just ask to remove the user of the matrix not remove from user SIP
              socket.emit("removeUserToDestinationMatrix", that.get("name"), function(err, msg) {
                if (err) return views.global.notification("error", err);
                views.global.notification("valid", msg);
                views.global.closePanel();

              });
              //remove from the user SIP

              //socket.emit("invoke", "defaultrtp", "remove_destination", [that.get("name")], function(ok) {});
            }
          });
        },
        edit: function() {
          var that = this;
          new ViewEditUser({
            model: that
          });
        },

      });

    return UserModel;
  })