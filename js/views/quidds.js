define([
	'underscore',
	'backbone',
	'models	/quidd',
	'text!/templates/createQuidd.html',
	'text!/templates/quidd.html'
], function(_, Backbone, QuiddModel, quiddCreateTemplate, quiddTemplate) {

	var QuiddView = Backbone.View.extend({
		el: 'body',
		events: {
			"click .createDevice[data-name], .deviceDetected li": "defineName",
			"click #create": "create",
			"change input.property, select.property": "setProperty",
			"click .setMethod": "setMethod",
			'click #methodStart': 'methodStart',
			'click #methodStop': 'methodStop',
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
			var className = $("#className").val(),
				name = $("#quiddName").val(),
				categoryQuidd = collections.classesDoc.get(className).get("category"),
				that = this,
				deviceDetected = $("#device").val(),
				category = "encoder";

			//check category of the quidd and get specific encoder
			if (categoryQuidd.indexOf("video") >= 0) category = "video encoder";
			if (categoryQuidd.indexOf("audio") >= 0) category = "audio encoder";

			/**
			 *
			 * 1 - create the quiddity without name
			 * 2 - check if the user select autoDetect (contains value) (if false go point 4)
			 * 3 - define the properties device
			 * 4 - get properties / methods of the device
			 * 5 - show the panelEdit with form
			 */

			//create first quiddity for get the good properties
			collections.quidds.create(className, name, function(quiddInfo) {
				var model = collections.quidds.createClientSide(quiddInfo);
				//check if autoDetect it's true if yes we set the value device with device selected
				if (deviceDetected) {
					model.setPropertyValue("device", deviceDetected, function(ok) {
						that.getPropertiesAndMethods(model);
					});
				} else that.getPropertiesAndMethods(model);
			});
		},
		getPropertiesAndMethods: function(model, callback) {
			var that = this;
			model.getProperties(function(properties) {
				model.getMethodsDescription(function(methods) {
					//retrive list encoder 
					var encoders = collections.classesDoc.getByCategory(model.get("encoder_category")).toJSON();
					that.openPanel(model.get("name"), properties, methods, encoders);
					if (callback) callback("ok");
				});
			});
		},
		openPanel: function(quiddName, properties, methods, encoders) {
			var template = _.template(quiddTemplate, {
				title: "Set " + quiddName,
				quiddName: quiddName,
				properties: properties,
				methods: methods,
				encoders: encoders
			});
			$("#panelRight .content").html(template);
			views.global.openPanel();
		},
		setProperty: function(element) {

			var model = collections.quidds.get($("#quiddName").val()),
				property = element.target.name,
				value = element.target.value,
				that = this;

			if (property == "encoder") {
				//add to the list the encoder ask to create with shmdata
				collections.quidds.listEncoder.push({
					quiddName: quidd.name,
					encoder: encoder
				});
			}
			console.log(property, value);
			model.setPropertyValue(property, value, function() {
				// 	//make confirmation message set attributes ok
				// 	//console.log("the property  :", property, "with value : ", value, "has set!");
				if (property == "started") {
					console.log("started!");
					that.getPropertiesAndMethods(model);
				}
			});

		},
		autoDetect: function(element) {
			//create temporary v4l2 quiddity for listing device available
			var className = $(element.target).data("name");
			collections.classesDoc.getPropertyByClass(className, "device", function(property) {

				var deviceDetected = property["type description"]["values"];
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
			});
		},
		updateVuMeter: function(quiddName, value) {
			var shmdata = quiddName.replace("vumeter_", "");
			if (value > 0) $("[data-path='" + shmdata + "']").removeClass("inactive").addClass("active");
			else $("[data-path='" + shmdata + "']").removeClass("active").addClass("inactive");
		},
		setMethod: function(element) {
			var that = this,
				model = collections.quidds.get($("#quiddName").val()),
				method = $(element.target).attr("id"),
				valueMethod = $("[data-name='" + method + "']").val();

			if (method && valueMethod) {
				console.log("setMethod", method, "to", valueMethod);
				model.setMethod(method, [valueMethod], function(ok) {
					console.log("ok!", ok);
					that.getPropertiesAndMethods(model);
				});
			}
		},
		methodStart: function() {
			var that = this,
				model = collections.quidds.get($("#quiddName").val());

			model.setMethod("start", [], function() {
				console.log("set Start");
				//the method has set correctly now we refresh properties in panel
				that.getPropertiesAndMethods(model);
			});
		},
		methodStop: function() {
			var that = this,
				model = collections.quidds.get($("#quiddName").val());

			model.setMethod("stop", [], function() {
				that.getPropertiesAndMethods(model);
			});
		}

	});

	return QuiddView;
})