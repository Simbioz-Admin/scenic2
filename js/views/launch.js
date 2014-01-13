define(

	/** 
	 *	View Launch
	 *	The Launch View to manage the interface scenic pre-configuration  when launched
	 *	@exports Views/Launch
	 */

	[
		'app',
		'underscore',
		'backbone',
		'text!/templates/launch.html'
	],

	function(App, _, Backbone, templateLaunch) {

		/** 
		 *	@constructor
		 *	@requires app
		 *  @requires Underscore
		 *  @requires Backbone
		 *	@requires TemplateLaunch
		 *  @augments module:Backbone.View
		 */

		var LaunchView = Backbone.View.extend(

			/**
			 *	@lends module: Views/launch~LaunchView.prototype
			 */

			{
				tagName: 'div',
				el: 'body',
				events: {
					"click #submitParam": "verification"
				},
				initialize: function() {
					this.render();
				},
				render: function() {
					var template = _.template(templateLaunch, {
						username: config.nameComputer,
						soap: config.port.soap
					});
					this.el = template;
					$("body").append(template);
					$("#bgLightBox, #lightBox").fadeIn(200);
				},

				/* On click #submitParam we check parameters */

				verification: function() {
					var dataFormConfig = $('#form-config').serializeObject()
					,	verificationOk = true
					,	that = this;

					//check if port soap is available
					socket.emit("checkPort", dataFormConfig.portSoap, function(ok) {
						if (!ok) {
							alert("The port " + dataFormConfig.portSoap + " is already used");
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