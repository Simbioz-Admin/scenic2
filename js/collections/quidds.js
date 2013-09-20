define([
	'underscore',
	'backbone',
	'models/quidd',
], function(_, Backbone, QuiddModel) {

	var QuiddsCollection = Backbone.Collection.extend({
		model: QuiddModel,
		url: '/quidds/',
		listEncoder: [],
		parse: function(results, xhr) {
			return results;
		},
		initialize: function() {
			console.log("init collection quidds");
			var that = this;

			//receive notification for add quidd to the collection Quidds
			socket.on("create", function(quiddInfo) {
				that.createClientSide(quiddInfo);
			});

			socket.on("remove", function(quidd) {
				var model = that.get(quidd);
				if(model) {
					model.trigger('destroy', model, that);
					views.global.notification("info", quidd + "  has deleted");
				}

			});

			socket.on("signals_properties_info", function(prop, quiddName, value) {
				console.log("signals_properties_info ", quiddName, prop, value);
				var model = collections.quidds.get(quiddName);
				if(prop == "on-property-removed") {
					model.removeProperty(value[0]);
				}
				if(prop == "on-new-property") {
					model.addProperty(value[0]);
				}
				if(prop == "on-new-method") {
					model.addMethod(value[0]);
				}
				if(prop == "on-method-removed") {
					model.removeMethod(value[0]);
				}
			});

			socket.on("signals_properties_value", function(quiddName, prop, value) {
				if (prop == "byte-rate") {
					views.quidds.updateVuMeter(quiddName, value);
					
				} else {
					var model = collections.quidds.get(quiddName);
					if (model) {
						console.log(quiddName, prop, value);
						model.get("properties")[prop]["default value"] = value;
						model.trigger("update:value", prop);
						// model.setLocalpropertyValue(prop, value);
						// if (prop == "started") {
						// 		model.getProperties(function(properties) {
						// 			model.getMethodsDescription(function(methods) {
						// 			});
						// 		});
						// } 
						//TODO:Find better place because this interact whit view (find type prop : string, enum etc.. for focus )
						//var input = $("[name$='"+prop+"']");
						//if(input) input.val(value);
					}
				}
			});

			socket.on("updateShmdatas", function(qname, shmdatas) {
				var quidd = that.get(qname);
				//sometimes the server ask to update shmdatas but is not yet insert in frontend, also we check that!
				if (quidd) {
					quidd.set("shmdatas", shmdatas);
				}
			});

			socket.on("remove", function(quiddName) {
				that.remove(quiddName);
			});


			//receive notification for set property of quidd
			socket.on("setPropertyValue", function(nameQuidd, property, value) {
				var quidd = that.get(nameQuidd);
				_.each(quidd.get("properties"), function(prop, index) {
					if (prop.name == property) quidd.get("properties")[index]["value"] = value;
				});
			});
		},
		create: function(className, quiddName, callback) {
			//ask for create a Quidd
			socket.emit("create", className, quiddName, function(quidd) {
				callback(quidd);
			});
		},
		delete: function(quiddName) {
			socket.emit("remove", quiddName);
		},
		createClientSide: function(quiddInfo) {
			//create a model and add to the collection
			var model = new QuiddModel(quiddInfo);
			this.add(model);
			views.global.notification("info", model.get("name") + " (" + model.get("class") + ") is created");
			return model;
		},
		getPropertyValue: function(infoQuidd, property, callback) {
			socket.emit("get_property_value", infoQuidd.name, property, function(propertyValue) {
				callback(propertyValue);
			});
		},
		setPropertyValue: function(infoQuidd, property, value, callback) {
			socket.emit("setPropertyValue", infoQuidd.name, property, value, function(ok) {
				if (callback) callback(ok);
			});
		}
		// delete : function(quiddName)
		// {
		// 	socket.emit("remove", quiddName);
		// },
		// getProperties : function(nameQuidd, callback)
		// {
		// 	socket.emit("getPropertiesOfQuidd", nameQuidd, function(propertiesOfQuidd)
		// 	{
		// 		callback(propertiesOfQuidd);
		// 	});
		// },
		// getMethodsDescription : function(nameQuidd, callback)
		// {	
		// 	socket.emit("getMethodsDescription", nameQuidd, function(methodsDescription)
		// 	{
		// 		callback(methodsDescription);
		// 	});
		// },
		// getPropertiesWithValues : function(nameQuidd, callback)
		// {
		// 	console.log("ask for get properties and value :", nameQuidd);
		// 	socket.emit("getPropertiesOfQuiddWithValues", nameQuidd, function(propertiesOfQuidd)
		// 	{
		// 		callback(propertiesOfQuidd);
		// 	});
		// },
	});

	return QuiddsCollection;
})