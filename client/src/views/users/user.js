define(

  /** 
   *  View User
   *  Manage interaction with the repertories of users
   *  @exports Views/Users
   */

  [
    'underscore',
    'backbone',
    'lib/socket',
    'text!../../../templates/users/user.html'
  ],

  function(_, Backbone, socket, TemplateUser) {

    /** 
     *  @constructor
     *  @requires Underscore
     *  @requires Backbone
     *  @requires TemplateUsers
     *  @augments module:Backbone.View
     */

    var UserView = Backbone.View.extend(

      /**
       *  @lends module:Views/users/user~UserView.prototype
       */

      {
        tagName: 'div',
        className: 'user',
        template: TemplateUser,
        events: {
          "mouseenter": "showActions",
          "mouseleave": "hideActions",
          "click .add_table": "addUserToDestinationMatrix",
          "click .edit_user": "editUser",
          "change input.send": "callContact",
          // "click .hangUp" : 'hangUpContact',
          "change #statusText": "setStatusText",
          "click .listStatus" : "setStatus"
        },


        /*
         * @function initialize
         * @description Called when a user is added to the collection
         */

        initialize: function(options) {
          this.listenTo(this.model, 'change', this.render);
          this.listenTo(this.model, 'change:connection', this.connections);
          this.listenTo(this.model, 'destroy', this.removeView);

          var userSip = JSON.parse(localStorage['userSip']);

          if (userSip.uri == this.model.get('uri')) {
            this.model.set('itsMe', true);
            $('.itsMe').html(this.el);
          } else {
            $(".users .content_users [data-status='" + this.model.get("status") + "']").append(this.el);
          }

          this.render();

        },

        /* Called for render the view */
        render: function() {
          $(this.el).attr('data-idUser', this.model.get('uri'));
          var tpl = _.template(TemplateUser)( this.model.toJSON());

          $(this.el).html(tpl);
          var status = this.model.get("status");
          $(this.el).attr("data-statusUser", status);
          // $(".users").append(this.el);
          // this.refreshStatus();
        },

        setStatus : function(e){
          var status = $(e.target).data("status");
          socket.emit("set_property_value", config.sip.quiddName, 'status', String(status), function(err) {
            if (err) return views.global.notification("error", err);
          });
        },
        setStatusText: function(e) {
          var statusText = $(e.target).val();
          socket.emit("set_property_value", config.sip.quiddName, 'status-note', statusText, function(err) {
            if (err) return views.global.notification("error", err);
          });
        },

        showActions: function() {
          if (!this.model.get('itsMe')) {
            $(".information", this.el).stop(true, true).animate({
              "marginLeft": 140
            }, 100);
          }
        },
        hideActions: function() {
          $(".information", this.el).stop(true, true).animate({
            "marginLeft": 0
          }, 100);
        },
        addUserToDestinationMatrix: function() {
          var that = this;
          var user = collections.users.get(this.model.get('uri'));
          if (!user.in_tab) {
            socket.emit("addUserToDestinationMatrix", this.model.get("uri"), function(err, msg) {
              if (err) return views.global.notification("error", err);
              $('.add_destinationSip', that.el).removeClass('add_table').addClass('call');
            });
          } else {
            views.global.notification("error", $.t("this user is already in destinations SIP"));
          }
        },
        connections: function() {
          var that = this;
          $('[data-destination="' + this.model.get('uri') + '"]').removeClass('active' ).addClass('inactive');
          _.each(this.model.get('connection'), function(connection) {
            $('[data-path="' + connection + '"] [data-destination="' + that.model.get('uri') + '"]').removeClass('inactive' ).addClass('active');
          });
        },
        editUser: function() {
          this.model.edit();
        },
        callContact: function() {
          return console.log("CALLL");
          var that = this;
          socket.emit('invoke', config.sip.quiddName, 'call', [this.model.get('uri')] , function(err) {
            if (err) return views.global.notification('error', err);
            views.global.notification("valid", $.t("successfully called ") + that.model.get('name'));
          });
        },
        hangUpContact: function() {
          var that = this;
          socket.emit('invoke', config.sip.quiddName, 'hang-up', [this.model.get('uri')] , function(err) {
            if (err) return views.global.notification('error', err);
            views.global.notification("valid",$.t("successfully hang up ") + that.model.get('name'));
          });
        },
        removeView: function() {
          this.remove();
        }

      });

    return UserView;
  });