define([
	'underscore',
	'backbone',
	'models	/quidd',
	'text!/templates/createQuidd.html',
	'text!/templates/quidd.html',
], function(_, Backbone, QuiddModel, quiddCreateTemplate, quiddTemplate) {

	var QuiddView = Backbone.View.extend({
		el: 'body',
		events: {
			"click .createDevice[data-name], .deviceDetected li": "defineName",
			"click #create": "create",	
			"mouseenter .autoDetect": "autoDetect",
			// "click #create-midi" : "createMidi"
		},
		initialize: function() {
			console.log("init QuiddsView");
		},
		//open the lightbox and show the properties to define for create the quidd Source
		defineName: function(element) {
			var className = $(element.target).data("name"),
				deviceDetected = $(element.target).data("devicedetected"),
				template = _.template(quiddCreateTemplate, {
					title: "Define name for " + className,
					className: className,
					deviceDetected: deviceDetected
				});
			$("#panelRight .content").html(template);
			views.global.openPanel();
		},
		create: function(element) {
			
			var that = this,
				className = $("#className").val(),
				quiddName = $("#quiddName").val(),
				deviceDetected = $("#device").val();


				socket.emit("create", className, quiddName, function(quiddInfo) {

					var model = collections.quidds.create(quiddInfo);
					//check if autoDetect it's true if yes we set the value device with device selected
					if (deviceDetected) {
						model.setPropertyValue("device", deviceDetected, function(ok) {
							model.edit();
						});
					} else model.edit();
				});

		},
		autoDetect: function(element) {
			//create temporary v4l2 quiddity for listing device available
			var className = $(element.target).data("name");
			collections.classesDoc.getPropertyByClass(className, "device", function(property) {
				if(property) {
					var deviceDetected = property["values"];

					$("#deviceDetected").remove();
					$("[data-name='" + className + "']").append("<ul id='deviceDetected'></ul>");

					_.each(deviceDetected, function(device) {
						var li = $("<li></li>", {
							text: device["name"] + " " + device["nick"],
							class: 'source',
							data: {
								name: className,
								devicedetected: device["value"]
							},
						});
						$("#deviceDetected").append(li);
					});
				} else {
					views.global.notification("error", "no device video detected.");
				}
			});
		},
		updateVuMeter: function(quiddName, value) {
			var shmdata = quiddName.replace("vumeter_", "");
			if (value > 0) $("[data-path='" + shmdata + "']").removeClass("inactive").addClass("active");
			else $("[data-path='" + shmdata + "']").removeClass("active").addClass("inactive");
		},
		removePreviewIcon : function(shmdata) {
			console.log($("[data-quiddname='"+shmdata[0].split('_')[3]+"'] .preview").removeClass("active"));
		}

	});

	return QuiddView;
})