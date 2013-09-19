define([
	'underscore',
	'backbone',
	'views/source', 'views/sourceProperty', 'views/destination', 'views/mapper', 'views/editQuidd',
	'text!/templates/panelInfoSource.html'
], function(_, Backbone, ViewSource, ViewSourceProperty, ViewDestination, ViewMapper, ViewEditQuidd,
	infoTemplate) {

	var QuiddModel = Backbone.Model.extend({
		url: "/quidd/",
		idAttribute: "name",
		defaults: {
			"name": null,
			"class": null,
			"category" : null,
			"long name" : null,
			"description" : null,
			"properties": [],
			"methods": [],
			"encoder_category": null,
			"shmdatas": null,
			"view" : null,
			"viewEdit" : null
		},
		initialize: function() {
			var that = this;

			//get properties, methods and shmdatas when quidd is created
			that.getShmdatas(function(shmdatas) {
				if(that.get("category").indexOf("source") != -1 && that.get("class") != "midisrc") {
					that.set("view", new ViewSource({
						model: that,
						table: "transfer"
					}));
					
				}
				if (that.get("class") == "midisrc") {
					that.set("view", new ViewSourceProperty({
						model: that,
						table: "control"
					}));
				} 

				if(that.get("category") == "mapper") {
					that.set("view", new ViewMapper({
						model : that,
						table: "control"
					}));
				}
			});
		},
		edit: function() {
			var that = this;
			that.getProperties(function() {
				that.getMethodsDescription(function() {
					that.set("viewEdit", new ViewEditQuidd({model : that})); 
					// views.quidds.openPanel(that.get("name"), that.get("properties"), that.get("methods"), that.get("encoder_category"));
				});
			});
		},
		delete: function() {
			var that = this;
			socket.emit("remove", this.get("name"));
			//check if propertiesControl is created with the quidd deleted
			collections.controlProperties.each(function(controlProperty) {
				if(controlProperty.get("quiddName") == that.get("name")) controlProperty.delete();
			});
		},
		preview: function(element) {
			var path = $(element.target).closest('tr').data("path"),
				type = null,
				that = this;

			collections.quidds.getPropertyValue({ name : "vumeter_" + path }, "caps", function(info) {
				info = info.split(",");

				if (info[0].indexOf("video") >= 0) type = "gtkvideosink";
				if (info[0].indexOf("audio") >= 0) type = "pulsesink";

				//check if the quiddity have already a preview active
				socket.emit("get_quiddity_description", type+"_"+path, function(quiddInfo) {
					if(quiddInfo.error && type != null) {
						collections.quidds.create(type, type+"_"+path , function(quiddInfo) {
						socket.emit("invoke", quiddInfo.name, "connect", [path]);
						});
					} else {
						collections.quidds.delete(type+"_"+path);
					}

				});

			});

		},
		info: function(element) {
			var shmdata = $(element.target).closest('tr').data("path");
			var that = this;
			collections.quidds.getPropertyValue( { name : "vumeter_" + shmdata} , "caps", function(val) {
				val = val.replace(/,/g, "<br>");
				var template = _.template(infoTemplate, {
					info: val,
					shmdata: shmdata
				});
				$("#info").remove();
				$("body").prepend(template);
				$("#info").css({
					top: element.pageY,
					left: element.pageX
				}).show();
				$(".panelInfo").draggable({
					cursor: "move",
					handle: "#title"
				});
			});
		},
		setPropertyValue: function(property, value, callback) {
			var that = this;
			socket.emit("setPropertyValue", this.get("name"), property, value, function(property, value) {
				//that.get("properties")[property] = value;
				callback("ok");
			});
		},
		setLocalpropertyValue: function(prop, value) {
			_.each(this.get("properties"), function(property) {
				if (property.name == prop) property.value = value;
			});

			if (prop == "last-midi-value" && $("#last_midi_event_to_property").length > 0) {
				//TODO:Find better place because this interact whit view (find type prop : string, enum etc.. for focus )
				$(".preview-value").html("<div class='content-value'>" + value + "</div>");
			}
		},
		getProperties: function(callback) {
			var that = this;
			socket.emit("get_properties_description", this.get("name"), function(properties_description) {
				that.set("properties", properties_description);
				callback(properties_description);
			});
		},

		removeProperty: function(property) {
			var viewEdit = this.get("viewEdit");
			viewEdit.addProperty(property);
			delete this.get("properties")[property];
			//console.log("removed prop", property, this.get("properties"));
		},

		addProperty: function(property) {
			var that = this;
			socket.emit("get_property_description", this.get("name"), property, function(description) {
				that.get("properties")[property] = description;
				//console.log("add prop", property, that.get("properties"));
			});
		},

		getPropertyValue: function(property, callback) {
			var that = this;
			socket.emit("get_property_value", this.get("name"), property, function(propertyValue) {
				callback(propertyValue);
			});
		},
		getMethodsDescription: function(callback) {
			var that = this;
			socket.emit("getMethodsDescription", this.get("name"), function(methodsDescription) {
				that.set("methods", methodsDescription);
				callback(methodsDescription);
			});
		},
		getShmdatas: function(callback) {
			var that = this;
			//ask for value of shmdatas and stock in model
			this.getPropertyValue("shmdata-writers", function(shmdatas) {
				if(shmdatas) {
					that.set({
						shmdatas: shmdatas.shmdata_writers
					});
					if (callback) callback(shmdatas.shmdata_writers);
				}
			});
		},
		setMethod: function(method, parameters, callback) {
			socket.emit("invoke", this.get("name"), method, parameters, function(ok) {
				callback(ok);
			});
		}
	});

	return QuiddModel;
})
