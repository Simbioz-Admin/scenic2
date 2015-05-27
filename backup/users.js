define(

  /** 
   *  Collections for manage the users
   *  @exports collections/Users
   */

  [
    '../bower_components/underscore/underscore',
    'backbone',
    'lib/socket',
    'models/user',
    'crypto-js'
  ],

  function(_, Backbone, socket, ModelUser, CryptoJS) {

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
        listStatus: {},
        initialize: function() {
          var that = this;

          // Message receive from the server //

          socket.on("addDestinationSip", function(uri) {
            var user = that.get(uri);
            user.set('in_tab', true);
            user.add_tab();
          });

          socket.on("removeDestinationSip", function(destinationSip) {
            var user = that.get(destinationSip);
            user.set('in_tab', false);
            user.trigger('destroyDestinationMatrix', user, that);
          });

        },

        parse: function(results, xhr) {
          var that = this;
          var users = [];

          _.each(results, function(user, id) {
            user["id"] = id;
            users.push(user);
          });
          return users;
        },
        priorityStatus: function(status) {
          if (status == "online") return 0;
          if (status == "busy") return 1;
          if (status == "away") return 2;
          if (status == "offline") return 6;
          if (status == "unknown") return 4;
        },
        /* define the attribute for order model of this collection */
        comparator: function(a) {
          return a.get(this.orderBy);
        },
        getListStatus: function(cb) {
          var that = this;
          // Get list status for users          
          socket.emit("getListStatus", function(err, listStatus) {
            if (err) return cb(err);
            that.listStatus = listStatus;
            cb(null);
          });
        }
      });

    return CollectionUsers;
  })