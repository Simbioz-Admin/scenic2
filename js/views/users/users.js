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
        'text!/templates/users/users.html'
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
                    $("body").append($(this.el));

                    /* generate the view for each user */
                    this.collection.each(function(user) {
                        new ViewUser({
                            model: user
                        });
                    });


                },
                toggleList: function() {
                    var that = this;

                    if (this.listOpen) {
                        $(this.el).animate({
                            "right": -300
                        }, 300, function() {
                            that.listOpen = false;
                        });
                        $("h2", this.el).animate({
                            "left": -120
                        }, 300);
                    } else {
                        $(this.el).animate({
                            "right": 0
                        }, function() {
                            that.listOpen = true;
                        });
                        $("h2", this.el).animate({
                            "left": 0
                        }, 300);
                    }
                }

            });

        return UsersView;
    })