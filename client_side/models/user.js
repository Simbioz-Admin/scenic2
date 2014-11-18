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
        idAttribute: "sip_url",
        defaults: {
          name: null,
          sip_url: null,
          status: null,
          status_text: "Aucun message",
          subscription_state: "Aucun message"
        },
        initialize: function() {

        }
      });

    return UserModel;
  })