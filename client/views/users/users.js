define(

  /** 
   *  View Users
   *  Manage interaction with the repertories of users
   *  @exports Views/Users
   */

  [
    'underscore',
    'backbone',
    'lib/socket',
    'views/users/user',
    'text!../../templates/users/users.html',
    'text!../../templates/users/form_login.html'
  ],

  function(_, Backbone, socket, ViewUser, TemplateUsers, TemplateLoginForm) {

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
          'click .logout': 'logoutSip',
          'submit #login_sip': 'loginSip',
          'change #add-user': 'addUser',
          'click #statusText' : 'selectAllText'
        },

        /*
         * @function initialize
         * @description Called when the interface is loaded
         */

        initialize: function(options) {
          var that = this;

          this.collection.on('reOrder', this.reOrder);
          $("#transferSip").append($(this.el));

          //Check if quiddity sipQuid is created
          console.log(config);
          socket.emit('get_info', config.sip.quiddName,'.buddy', function(infoQuidd){
            if(!infoQuidd.error){
              that.render();
            }else{
              that.renderLogin();
              localStorage["usersPanelClose"] = true;
            }
          });
        },


        /*
         * @function Render
         * @description Add the global list users sip and information about current user connected
         */

        render: function() {
          var that = this;
          //Get List status for users
          socket.emit("getListStatus", function(err, listStatus) {
            collections.users.listStatus = listStatus;

            $(that.el).html("");
            /* add information about user connected */
            var tpl = _.template(that.template)( {
              loginForm: false,
              listStatus: collections.users.listStatus
            });
            $(that.el).append(tpl);

            that.collection.reset();
            that.collection.fetch();

          });

        },

        /*
         * @function renderLogin
         * @description Render in list user login form for connection sip server
         */
        renderLogin: function() {
          var tpl = _.template(this.template)( {
            loginForm: true
          });
          $(this.el).append(tpl);
          var loginTpl = _.template(TemplateLoginForm)( config);
          $(this.el).append(loginTpl);
          
          //translation
          $(this.el).i18n();
        },


        /*
         * @function loginSip
         * @description Ask to the server login to the server SIP
         */

        loginSip: function(e) {
          var that = this;
          e.preventDefault();

          that.sipInformation = $('#login_sip', this.el).serializeObject();
          that.sipInformation["uri"] = that.sipInformation.name + '@' + that.sipInformation.address;

          //Check information
          if(!that.sipInformation.address || !that.sipInformation.name || !that.sipInformation.password || !that.sipInformation.port ){
            return views.global.notification("error", $.t("Missing information to connect to the SIP server"));
          }

          that.collection.loginSip(that.sipInformation.address, that.sipInformation.name, that.sipInformation.password, that.sipInformation.port, function(err){
            if(err) return views.global.notification('error', err);
            that.render();
            views.global.notification("valid", $.t("Successful connection to the SIP server"));
            $("#login_sip", this.el).remove();
          });

        },

        /*
         * @function logoutSip
         * @description Ask to the server logout to the server SIP
         */

        logoutSip: function(e) {
          var that = this;
          //e.preventDefault();

          socket.emit('invoke', config.sip.quiddName, 'unregister',  [], function(err) {
            if(err) return views.global.notification("error", err);
            socket.emit('remove', config.sip.quiddName);
            /* if successfully logout we remove all information about users for showing form login */
            $(that.el).html("");
            collections.users.reset();
            that.renderLogin();

            views.global.notification("valid", $.t("Successful logout to the SIP server"));
          });
          return;
        },

        /*
         * @function AddUser
         * @description Insert a new User in the list
         */

        addUser: function(e) {
          var uri = $(e.currentTarget).val();
          socket.emit("addUser", uri, function(err, info) {
            if (err) return views.global.notification("error", err);
            $(e.currentTarget).val("");
            return views.global.notification("valid", info);
          })
        },

        selectAllText : function(e){
           $(e.currentTarget).select();
        }
      });

    return UsersView;
  })