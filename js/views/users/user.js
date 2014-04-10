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
                    "click .add_table": "test"
                },


                /*
                 * @function initialize
                 * @description Called when a user is added to the collection
                 */

                initialize: function(options) {
                    this.listenTo(this.model, 'change:status', this.refreshStatus);
                    this.listenTo(this.model, 'change:status_text', this.changeText);
                    $(".users .content_users").append(this.el);
                    this.render();
                },

                /* Called for render the view */
                render: function() {
                    var tpl = _.template(TemplateUser, this.model.toJSON());
                    $(this.el).html(tpl);
                    var status = this.model.get("status");
                    $(this.el).attr("data-status", status);
                    // $(".users").append(this.el);
                    // this.refreshStatus();

                },
                refreshStatus: function() {
                    /* 0 : online   1 : absent   2 : offline */
                    console.log("refresh status");
                    console.log($(".users .user[data-status='0']:last")[0]);
                    var lastConnected = $(".users .user[data-status='0']:last");
                    var user = $(this.el).detach();
                    lastConnected.after(user);
                    var status = this.model.get("status");
                    $(this.el).attr("data-status", status);
                },
                changeText: function() {
                    console.log(this.model.get("status_text"));
                    $(".last_message", this.el).html(this.model.get("status_text"));
                },
                showActions: function() {
                    $(".information", this.el).stop(true, true).animate({
                        "marginLeft": 140
                    }, 100);
                },
                hideActions: function() {
                    $(".information", this.el).stop(true, true).animate({
                        "marginLeft": 0
                    }, 100);
                },
                test: function() {
                    console.log("test", $(this.el).data('status'));
                }

            });

        return UserView;
    })