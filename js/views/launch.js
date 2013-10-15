define([
	'app',
	'underscore',
	'backbone',
	'text!/templates/launch.html'
], function(App, _, Backbone, templateLaunch) {

	var DestinationsView = Backbone.View.extend({
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
		verification: function() {
			var dataFormConfig = $('#form-config').serializeObject(),
				verificationOk = true,
				that = this;

			//check if port soap is available
			socket.emit("checkPort", dataFormConfig.portSoap, function(ok) {
				if (!ok) {
					alert("The port " + dataFormConfig.portSoap + " is already used");
					verificationOk = false;
				}

				if (dataFormConfig.pass != dataFormConfig.confirmPass) {
					alert("the password are not the same");
					verificationOk = false;
				}

				if (verificationOk) that.launchScenic(dataFormConfig);


			});

			return false;
		},
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

	return DestinationsView;
})