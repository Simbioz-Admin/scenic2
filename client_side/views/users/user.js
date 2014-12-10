define(

  /** 
   *  View User
   *  Manage interaction with the repertories of users
   *  @exports Views/Users
   */

  [
    'underscore',
    'backbone',
    'text!../../../templates/users/user.html'
  ],

  function(_, Backbone, TemplateUser) {

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
          "click .call": "callContact"
        },


        /*
         * @function initialize
         * @description Called when a user is added to the collection
         */

        initialize: function(options) {
          //this.listenTo(this.model, 'change', this.refreshStatus);
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
          var tpl = _.template(TemplateUser, this.model.toJSON());
          $(this.el).html(tpl);
          var status = this.model.get("status");
          $(this.el).attr("data-statusUser", status);
          // $(".users").append(this.el);
          // this.refreshStatus();

        },
        refreshStatus: function() {
          /* 0 : online   1 : absent   2 : offline */
          var currentStatus = this.model.get("status");
          if (!this.model.get('itsMe')) {
            var user = $(this.el).detach();
            $(".users .content_users .status-" + currentStatus).append(user);
          }
          $(this.el).attr("data-statusUser", currentStatus);
        },
        changeText: function() {
          console.log('change text', this.model.get("status_text"));
          $(".last_message", this.el).html(this.model.get("status_text"));
        },
        showActions: function() {
          //if(!this.model.get('itsMe')){
          $(".information", this.el).stop(true, true).animate({
            "marginLeft": 140
          }, 100);
          //}
        },
        hideActions: function() {
          $(".information", this.el).stop(true, true).animate({
            "marginLeft": 0
          }, 100);
        },
        addUserToDestinationMatrix: function() {
          var that = this;
          console.log(collections.users.get(this.model.get('uri')));
          var user = collections.users.get(this.model.get('uri'));
          if (!user.in_tab) {
            socket.emit("addUserToDestinationMatrix", this.model.get("uri"), function(err, msg) {
              if (err) return views.global.notification("error", err);
              $('.add_destinationSip', that.el).toggleClass('add_table call');
            });
          } else {
            views.global.notification("error", "this user is already in destinations SIP");
          }
        },
        connections: function() {
          var that = this;
          console.log("modification on connexion!");
          $('[data-destination="' + this.model.get('uri') + '"]').removeClass('active');
          _.each(this.model.get('connection'), function(connection) {
            $('[data-path="' + connection + '"] [data-destination="' + that.model.get('uri') + '"]').addClass('active');
          });
        },
        editUser: function() {
          this.model.edit();
        },
        callContact: function() {
          var that = this;
          socket.emit("callUser", this.model.get('uri'), function(err, msg) {
            if (err) return views.global.notification('error', err);
            views.global.notification("valid", msg + " " + that.model.get('name'));
          });
        },
        hangUpContact: function() {
          console.log('hangUP!');
          var that = this;
          socket.emit("hangUpUser", this.model.get('uri'), function(err, msg) {
            if (err) return views.global.notification('error', err);
            views.global.notification("valid", msg + " " + that.model.get('name'));
          });
        },
        removeView: function() {
          this.remove();
        }

      });

    return UserView;
  })