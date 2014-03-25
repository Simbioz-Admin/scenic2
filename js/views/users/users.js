define(

    /** 
     *  View Users
     *  Manage interaction with the repertories of users
     *  @exports Views/Users
     */

    [
        'underscore',
        'backbone',
        'views/users/user',
        'text!../../../templates/users/users.html'
    ],

    function(_, Backbone, ViewUser, TemplateUsers) {

        /** 
         *  @constructor
         *  @requires Underscore
         *  @requires Backbone
         *  @requires TemplateUsers
         *  @augments module:Backbone.View
         */

        var UsersView = Backbone.View.extend(

            /**
             *  @lends module: Views/users/users~UsersView.prototype
             */

            {
                tagName: 'div',
                className: 'users',
                template: TemplateUsers,
                listOpen: true,
                events: {
                    'click h2': 'toggleList'
                },


                /*
                 * @function initialize
                 * @description Called when the interface is loaded
                 */

                initialize: function(options) {
                    var that = this;
                    console.log("init View Users");
                    that.render();
                },

                /* Called for render the view */
                render: function() {


                    /* add information about user connected */
                    console.log(config);
                    var tpl = _.template(this.template, {
                        name: config.nameComputer
                    });

                    $(this.el).append(tpl);

                    /* generate a btn for the table */
                    this.listOpen = (typeof localStorage["usersPanelClose"] === "undefined") ? false : (localStorage["usersPanelClose"] === 'true');
                    //this.toggleList(0);
                    console.log("close", this.listOpen)
                    $("body").append($(this.el));
                    this.toggleList(0);
                    /* generate the view for each user */
                    this.collection.each(function(user) {
                        new ViewUser({
                            model: user
                        });
                    });


                },
                toggleList: function(speed) {
                    var that = this;
                    var speed = (typeof speed == "number") ? speed : 300;
                    if (this.listOpen) {
                        localStorage["usersPanelClose"] = true;
                        /* action of close users list */
                        $(".actions_global").animate({
                            "right": 90
                        }, speed);
                        $(this.el).animate({
                            "right": -300
                        }, speed, function() {

                            that.listOpen = false;
                        });
                        $("h2", this.el).animate({
                            "left": -100
                        }, speed);
                    } else {
                        localStorage["usersPanelClose"] = false;

                        /* action of open users list */
                        $(".actions_global").animate({
                            "right": 290
                        }, speed);
                        $(this.el).animate({
                            "right": 0
                        }, function() {
                            that.listOpen = true;
                        });
                        $("h2", this.el).animate({
                            "left": 0
                        }, speed);
                    }
                }

            });

        return UsersView;
    })