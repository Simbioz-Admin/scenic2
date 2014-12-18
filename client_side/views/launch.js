define(

  /** 
   *  View Launch
   *  The Launch View to manage the interface scenic pre-configuration  when launched
   *  @exports Views/Launch
   */

  [
    'app',
    'underscore',
    'backbone',
    'jqueryui',
    'text!../../templates/launch.html',
    'text!../../templates/users/form_login.html'
  ],

  function(App, _, Backbone, ui, templateLaunch, TemplateLoginForm) {

    /** 
     *  @constructor
     *  @requires app
     *  @requires Underscore
     *  @requires Backbone
     *  @requires TemplateLaunch
     *  @augments module:Backbone.View
     */

    var LaunchView = Backbone.View.extend(

      /**
       *  @lends module: Views/launch~LaunchView.prototype
       */

      {
        tagName: 'div',
        el: 'body',
        events: {
          "submit  #form-config": "verification",
          "submit  #login_sip": "verification"
        },
        initialize: function() {
          this.render();
        },
        render: function() {
          var template = _.template(templateLaunch, {
            username: config.nameComputer,
            soap: config.port.soap,
            sip: config.sip
          });
          $(this.el).append(template);
          $("body").append(this.el);
          var tplLoginSip = _.template(TemplateLoginForm, config);
          $('#loginSip', this.el).append(tplLoginSip);
          //Same form use for window user in scenic2 we remove submit and title
          $('#loginSip h1, #loginSip #submitSip', this.el).remove();
          $('#accordion', this.el).accordion({
            heightStyle: "content"
          });
          $("#bgLightBox, #lightBox").fadeIn(200);
        },

        /* On click #submitParam we check parameters */

        verification: function(e) {
          var dataFormConfig = $('#form-config').serializeObject(),
            dataFormSip = $('#login_sip').serializeObject(),
            verificationOk = true,
            that = this;

          if (dataFormSip.name && dataFormSip.password) {
            console.log("ask connect server SIP", dataFormSip);
            collections.users.loginSip(dataFormSip.address, dataFormSip.name, dataFormSip.password, dataFormSip.port, function(err) {
              if(err) return console.error(err);
            });
          }

          //check if port soap is available
          socket.emit("checkPort", dataFormConfig.portSoap,
            function(SoapOk) {
              if (!SoapOk) {
                alert("The port " + dataFormConfig.portSoap + " is already used. Please change value of port Soap");
                verificationOk = false;
              }

              /* Check the password */
              if (dataFormConfig.pass != dataFormConfig.confirmPass) {
                alert("the password are not the same");
                verificationOk = false;
              }

              if (verificationOk) that.launchScenic(dataFormConfig);


            });

          return false;
        },

        /* Called when the parameters are ok */

        launchScenic: function(dataFormConfig) {
          socket.emit("startScenic", dataFormConfig, function(configUpdated) {
            config = configUpdated;
            $("#bgLightBox, #lightBox").fadeOut(200, function() {
              $("#bgLightBox, #lightBox").remove();

            });
            App.initialize();
          });
        }

      });

    return LaunchView;
  })