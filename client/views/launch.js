/*
define(

  /!**
   *  View Launch
   *  The Launch View to manage the interface scenic pre-configuration  when launched
   *  @exports Views/Launch
   *!/

  [
    'app',
    'underscore',
    'backbone',
    'lib/socket',
    'jqueryui',
    'spin',
    'text!../templates/launch.html',
    'text!../templates/users/form_login.html'
  ],

  function(App, _, Backbone, socket, ui, Spinner, templateLaunch, TemplateLoginForm) {

    /!**
     *  @constructor
     *  @requires app
     *  @requires Underscore
     *  @requires Backbone
     *  @requires TemplateLaunch
     *  @augments module:Backbone.View
     *!/

    var LaunchView = Backbone.View.extend(

      /!**
       *  @lends module: Views/launch~LaunchView.prototype
       *!/

      {
        tagName: 'div',
        el: 'body',
        events: {
          "submit  #form-config": "verification",
          "keyup .inputSip": "verification",
        },
        initialize: function() {
          this.render();
        },
        render: function() {
          
          //init translation
          i18n.init({
            lng: "fr",
            ns: 'translation'
          }).done(function() {
            $('body').i18n();
          });


          var template = _.template(templateLaunch)( {
            username: config.nameComputer,
            soap: config.soap.port,
            sip: config.sip
          });
          $(this.el).append(template);
          $("body").append(this.el);
          $(this.el).i18n();
          var tplLoginSip = _.template(TemplateLoginForm)( config);
          $('#loginSip', this.el).append(tplLoginSip);
          //Same form use for window user in scenic we remove submit and title
          $('#loginSip h1, #loginSip #submitSip', this.el).remove();
          $('#accordion', this.el).accordion({
            heightStyle: "content"
          });
          $("#bgLightBox, #lightBox").fadeIn(200);
        },

        /!* On click #submitParam we check parameters *!/

        verification: function(e) {

          //impossible to trig the form sip with submit. Instead we listen keyup on 
          //field SIP and verification is used only if its the enter key
          if (e.which && e.which !== 13 ) return;

          var dataFormConfig = $('#form-config').serializeObject();
          var dataFormSip = $('#login_sip').serializeObject();
          var verificationOk = true;
          var that = this;

          //check if port soap is available
          socket.emit("checkPort", dataFormConfig.portSoap, function(SoapOk) {
              if (!SoapOk) {
                alert("The port " + dataFormConfig.portSoap +" "+ $.t("is already used. Please change value of port Soap"));
                verificationOk = false;
              }

              /!* Check the password *!/
              if (dataFormConfig.pass != dataFormConfig.confirmPass) {
                alert("Passwords do not match.");
                verificationOk = false;
              }

              if (verificationOk) that.launchScenic(dataFormConfig, dataFormSip);
            });

          return false;
        },

        /!* Called when the parameters are ok *!/

        launchScenic: function(dataFormConfig, dataFormSip) {
          var self = this;

          this.spinner = new Spinner( { length: 8, width: 2, radius: 6, color: '#ff0000' } ).spin( $('#form-config .status' ).get(0) );

          socket.emit("startScenic", dataFormConfig, function(configUpdated) {
            config = configUpdated;

            // Check if we need to connect to SIP server before continuing
            if (dataFormSip.name && dataFormSip.password) {
              console.info("Logging in to SIP server");
              collections.users.loginSip(dataFormSip.address, dataFormSip.name, dataFormSip.password, dataFormSip.port, function(err) {
                if (err) {
                  //TODO: Actually make something useful for the EU out of this error
                  return console.error(err);
                } else {
                  self.scenicLaunched();
                }
              });
            } else {
              self.scenicLaunched();
            }
          });
        },

        scenicLaunched: function() {
          this.spinner.stop();
          $("#bgLightBox, #lightBox").fadeOut(200, function() {
            $("#bgLightBox, #lightBox").remove();
          });
          App.initialize();
        }

      });

    return LaunchView;
  });*/
