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
                    "click .add_destinationSip": "add_destinationSip"
                },


                /*
                 * @function initialize
                 * @description Called when a user is added to the collection
                 */

                initialize: function(options) {
                    this.listenTo(this.model, 'change:status', this.refreshStatus);
                    this.listenTo(this.model, 'change:status_text', this.changeText);
                    this.render();
                },

                /* Called for render the view */
                render: function() {

                    $(".users .content_users .status-" + this.model.get("status")).append(this.el);
                    var tpl = _.template(TemplateUser, this.model.toJSON());
                    $(this.el).html(tpl);
                    var status = this.model.get("status");
                    $(this.el).attr("data-status", status);
                    // $(".users").append(this.el);
                    // this.refreshStatus();

                },
                refreshStatus: function() {
                    /* 0 : online   1 : absent   2 : offline */
                    var currentStatus = this.model.get("status");
                    console.log(currentStatus);
                    var user = $(this.el).detach();
                    $(".users .content_users .status-" + currentStatus).append(user);
                    $(this.el).attr("data-status", currentStatus);
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
                add_destinationSip: function() {
                    console.log("test", this.model.get("uri"));

                    console.log(collections.destinationsSip.get(this.model.get('uri')));
                    if(!collections.destinationsSip.get(this.model.get('uri'))){
                        socket.emit("addDestinationSip", this.model.get("uri"), function(err, msg){
                            if(err) return views.global.notification("error",err);
                            console.log(msg);
                        });
                    } else {
                        views.global.notification("error","this user is already in destinations SIP");
                    }
                }

            });

        return UserView;
    })