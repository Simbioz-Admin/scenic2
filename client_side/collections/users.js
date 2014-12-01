define(

  /** 
   *  Collections for manage the users
   *  @exports collections/Users
   */

  [
    'underscore',
    'backbone',
    'models/user'
  ],

  function(_, Backbone, ModelUser) {

    /** 
     *  @constructor
     *  @requires Underscore
     *  @requires Backbone
     *  @requires ModelUser
     *  @augments module:Backbone.Collection
     */

    var CollectionUsers = Backbone.Collection.extend(

      /**
       *  @lends module:collections/Users~CollectionUsers.prototype
       */

      {
        model: ModelUser,
        url: '/users/',
        orderBy: "status",

        initialize: function() {
          var that = this;
          console.log("initialize collection users");

          /* receive update info user from server side */
          socket.on("infoUser", function(infoUser) {
            console.log("infoUser", infoUser);
            var user = that.get(infoUser.uri);
            if(user){
              user.set(infoUser);
            }else{
              that.add(infoUser);
            }
            that.fetch({
              success: function() {
                views.users.render(true);
              }
            });
            // var model = that.get(infoUser.sip_url);
            // user.status = that.priorityStatus(user.status);
            // if (model) model.set(infoUser);
            // that.trigger("reOrder");
          });

          socket.on("addDestinationSip", function(uri){
            var user = that.get(uri);
            user.set('in_tab',true);
            user.add_tab();
          });

          socket.on("removeDestinationSip", function(destinationSip){
            var model = that.get(destinationSip);
            model.trigger('destroy', model, that);
          });
        },

        parse: function(results, xhr) {
          var that = this;
          var users = [];

          _.each(results, function(user, id) {
            user.status = that.priorityStatus(user.status);
            user["id"] = id;
            users.push(user);
          });
          return users;
        },
        priorityStatus: function(status) {
          if (status == "online") return 0;
          if (status == "busy") return 1;
          if (status == "away") return 2;
          if (status == "offline") return 3;
          if (status == "unknown") return 4;
        },
        /* define the attribute for order model of this collection */
        comparator: function(a) {
          return a.get(this.orderBy);
        },
        /** Initialization of the Logger Collection */
      });

    return CollectionUsers;
  })