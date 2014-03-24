define(

    /** 
     *  View User
     *  Manage interaction with the repertories of users
     *  @exports Views/Users
     */

    [
        'underscore',
        'backbone',
        'text!/templates/users/user.html'
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
                    "mouseleave": "hideActions"
                },


                /*
                 * @function initialize
                 * @description Called when a user is added to the collection
                 */

                initialize: function(options) {
                    this.render();
                },

                /* Called for render the view */
                render: function() {
                    var tpl = _.template(TemplateUser, this.model.toJSON());
                    $(this.el).append(tpl);
                    $(".users").append(this.el);
                    this.refreshStatus();

                },
                refreshStatus: function() {
                    /* 0 : online   1 : absent   2 : offline */
                    var status = this.model.get("status");
                    $(".information", this.el).addClass("status-" + status);

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
                }

            });

        return UserView;
    })