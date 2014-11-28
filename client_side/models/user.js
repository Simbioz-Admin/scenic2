define(

  /** 
   *  Model User
   *  @exports Models/User
   */

  [
    'underscore',
    'backbone',
    'views/users/user',
    'views/destination'
  ],

  function(_, Backbone, ViewUser, ViewDestination) {

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
          itsMe : false,
          in_tab : false,
          call : false,
          connection : {}
        },
        initialize: function() {

          if(this.get('in_tab')) this.add_tab();
        },
        add_tab:function(){
          console.log('add tab!');
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
               socket.emit("removeDestinationSip", that.get("name"), function(err, msg) {
                 if (err)  return views.global.notification("error", err);
                 views.global.notification("valid", msg);
                 
               });
               //socket.emit("invoke", "defaultrtp", "remove_destination", [that.get("name")], function(ok) {});
             }
           });
         },
         edit : function(){
          console.log('ask to edit user');
         }

      });

    return UserModel;
  })