define(

  /** 
   *  Collections for manage the users
   *  @exports collections/Users
   */

  [
    'underscore',
    'backbone',
    'socket',
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
        listStatus: {},
        initialize: function() {
          var that = this;

          // receive update info user from server side
          socket.on("infoUser", function(infoUser) {
            if (infoUser != {}) {
              var user = that.get(infoUser.uri);
              if (user) {
                user.set(infoUser);
              } else {
                if (infoUser.uri) {
                  that.add(infoUser);
                }
              }

            }

          });

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

          socket.on("removeUser", function(uri) {
            var model = that.get(uri);
            model.trigger('destroy', model, that);
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
        },
        loginSip: function(address, name, password, port, cb) {

            var secretString = 'Les patates sont douces!';
            var encrypted = CryptoJS.AES.encrypt(password, secretString);

            var sipInformation = {
              address: address,
              uri: name + '@' + address,
              name: name,
              password: password,
              port: port
            };

            if (localStorage["userSip"]) localStorage["userSip"] = null;
            localStorage["userSip"] = JSON.stringify(sipInformation);

            socket.emit("sip_login", sipInformation, function(err, configSip) {
              if (err) return views.global.notification("error", err);
              views.global.notification("valid", "success login server sip");
              $("#login_sip", this.el).remove();
              cb(null);
            });
          }

      });

    return CollectionUsers;
  })
