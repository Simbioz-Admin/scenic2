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
        'text!../../../templates/users/users.html',
        'text!../../../templates/users/form_login.html'
    ],

    function(_, Backbone, ViewUser, TemplateUsers, TemplateLoginForm) {

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
                    'click h2': 'toggleList',
                    'click .logout': 'logoutSip',
                    'submit #login_sip': 'loginSip',
                    'change #add-user' : 'addUser'
                },


                /*
                 * @function initialize
                 * @description Called when the interface is loaded
                 */

                initialize: function(options) {
                    var that = this;
                    /* generate a btn for the table */
                    this.listOpen = (typeof localStorage["usersPanelClose"] === "undefined") ? false : (localStorage["usersPanelClose"] === 'true');

                    this.collection.on('reOrder', this.reOrder);
                    $("body").append($(this.el));

                    if (this.collection.length == 0) {
                        that.renderLogin();
                        that.toggleList(0);
                    } else {
                        that.render();
                    }
                },


                /*
                 * @function Render
                 * @description Add the global list users sip and information about current user connected
                 */

                render: function(connect) {
                    $(this.el).html("");
                    /* add information about user connected */
                    var tpl = _.template(this.template, {
                        loginForm: false
                    });
                    $(this.el).append(tpl);


                    //this.toggleList(0);
                    if(!connect)this.toggleList(0);
                    /* generate the view for each user */
                    this.collection.each(function(user) {
                        /* check if user model is of current user scenic */
                        if ("sip:" + config.sip.name + "@" + config.sip.address !== user.get("name")) {
                            new ViewUser({
                                model: user
                            });
                        } else {
                            $(".itsMe h3", this.el).html(user.get("sip_url"));
                            $(".itsMe .last_message", this.el).html(user.get("status_text"));
                        }
                    });


                },

                /*
                 * @function renderLogin
                 * @description Render in list user login form for connection sip server
                 */
                renderLogin: function() {
                    var tpl = _.template(this.template, {
                        loginForm: true
                    });
                    $(this.el).append(tpl);
                    var loginTpl = _.template(TemplateLoginForm, config);
                    $(this.el).append(loginTpl);
                },

                /*
                 * @function toggleList
                 * @description Show or Hide list of contact. Information state is saved in localStorage
                 */

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
                },


                /*
                 * @function loginSip
                 * @description Ask to the server logout to the server SIP
                 */

                loginSip: function(e) {
                    var that = this;
                    e.preventDefault();
                    that.sipInformation = $('#login_sip', this.el).serializeObject();

                    socket.emit("sip_login",  that.sipInformation, function(err, configSip) {
                        if (err) return views.global.notification("error", err);
                        /* update info contact sip */
                        //console.log("Logged", configSip);
                        //config.sip = configSip;
                        collections.users.fetch({
                            success: function() {
                                that.render(true);
                            }
                        });
                        views.global.notification("valid", "success login server sip");
                        $("#login_sip", this.el).remove();
                    });
                },

                /*
                 * @function logoutSip
                 * @description Ask to the server logout to the server SIP
                 */

                logoutSip: function(e) {
                    var that = this;
                    e.preventDefault();

                    socket.emit("sip_logout", function(err, confirm) {
                        if (err) return views.global.notification("error", err);

                        /* if successfully logout we remove all information about users for showing form login */
                        $(that.el).html("");
                        collections.users.reset();
                        that.renderLogin();

                        views.global.notification("valid", "success logout server sip");

                    });
                },

                /*
                 * @function AddUser
                 * @description Insert a new User in the list
                 */

                 addUser : function(e){
                    var uri = $(e.currentTarget).val();
                    console.log("ask to add ",uri);
                    socket.emit("addUser", uri, function(err, info){
                        if(err) return views.global.notification("error", err);
                        $(e.currentTarget).val("");
                        return views.global.notification("valid", info);
                    })
                 }
            });

        return UsersView;
    })