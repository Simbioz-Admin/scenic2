define(

	/** 
	 *	Manage all interaction between the server/views with a specific quiddity
	 *	@exports Models/quidd
	 */

	[
		'underscore',
		'backbone',
		'views/source', 'views/sourceProperty', 'views/destination', 'views/mapper', 'views/editQuidd',
		'text!/templates/panelInfoSource.html'
	],

	function(_, Backbone, ViewSource, ViewDestinationProperty, ViewDestination, ViewMapper, ViewEditQuidd, infoTemplate) {

		/** 
		 *	@constructor
		 *  @requires Underscore
		 *  @requires Backbone
		 *	@requires ViewSource
		 *	@requires ViewDestinationProperty
		 *	@requires ViewDestination
		 *	@requires ViewMapper
		 *	@requires ViewEditQuidd
		 *	@requires infoTemplate
		 *  @augments module:Backbone.Model
		 */

		var QuiddModel = Backbone.Model.extend(

			/**
			 *	@lends module:Models/quidd~QuiddModel.prototype
			 */

			{
				url: "/quidd/",
				idAttribute: "name",
				defaults: {
					"name": null,
					"class": null,
					"category": null,
					"long name": null,
					"description": null,
					"properties": [],
					"methods": [],
					"encoder_category": null,
					"shmdatas": null,
					"view": null,
				},


				/**
				 *	Function executed when the model quiddity is created
				 *	It's used for created a view associate to the model
				 *	This view need to know if it's in table controler or transfer and if it's a source or destination
				 */

				initialize: function() {
					var that = this;

					that.getShmdatas(function(shmdatas) {

						_.each(collections.tables.models, function(tableModel) {
							tableModel.add_to_table(that);
						});

						/* ViewSource it's a view for create a entry source to the table transfer */

						// if (that.get("category").indexOf("source") != -1 && that.get("class") != "midisrc") {
						// 	that.set("view", new ViewSource({
						// 		model: that,
						// 		table: "transfer"
						// 	}));

						// }


						/* ViewDestinationProperty it's a entry source for the table control */

						if (that.get("class") == "midisrc") {
							that.set("view", new ViewDestinationProperty({
								model: that,
								table: "control"
							}));
						}


						/* ViewMapper it's the connection between the source and destination in table control */

						if (that.get("category") == "mapper") {
							that.set("view", new ViewMapper({
								model: that,
								table: "control"
							}));
						}
					});
				},

				/**
				 *	Allows you to create a view that contains all the information to edit the quiddity
				 *	also allows to register the change in the quiddity
				 */

				edit: function() {
					var that = this;

					/* We collect the latest information on the properties and method of quiddity */
					that.getProperties(function() {
						that.getMethodsDescription(function() {
							new ViewEditQuidd({
								model: that
							});
							//subscribe for have information about modification on quidd
							socket.emit("subscribe_info_quidd", that.get("name"));
						});
					});
				},


				/**
				 *	Allows to remove a specific quiddity. We also check if there are quiddity of control associated with the quiddity to also remove
				 */

				delete: function() {
					var that = this;

					views.global.confirmation(function(ok) {
						if (ok) {
							socket.emit("remove", that.get("name"));
							
							/* sometimes quidd is destination and have connection need to be remove */
							$("[data-hostname='"+that.get("name")+"']").remove();

							//check if propertiesControl is created with the quidd deleted
							collections.controlProperties.each(function(controlProperty) {
								if (controlProperty.get("quiddName") == that.get("name")) controlProperty.delete();
							});
						}
					});
				},


				/**
				 *	Allows viewing of video quiddities type and audio
				 */

				preview: function(element) {
					var path = $(element.target).closest('tr').data("path"),
						type = null,
						that = this;

					/* The information needed to create a preview is present in the vumeter create with each quiddity  */
					collections.quidds.getPropertyValue("vumeter_" + path, "caps", function(info) {
						info = info.split(",");

						if (info[0].indexOf("video") >= 0) type = "gtkvideosink";
						if (info[0].indexOf("audio") >= 0) type = "pulsesink";

						//check if the quiddity have already a preview active
						socket.emit("get_quiddity_description", type + "_" + path, function(quiddInfo) {
							if (quiddInfo.error && type != null) {
								socket.emit("create", type, type + "_" + path, function(quiddInfo) {
									socket.emit("invoke", quiddInfo.name, "connect", [path]);
								});
							} else {
								socket.emit("remove", type + "_" + path);
							}

						});

					});

				},

				/*
				 *	Get information about the quiddity and show on the interface.
				 *	the information is present in vumeter quiddity created with each quiddity soruce
				 */

				info: function(element) {
					var shmdata = $(element.target).closest('tr').data("path");
					var that = this;
					collections.quidds.getPropertyValue("vumeter_" + shmdata, "caps", function(val) {
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

				/*
				 *	Set the property value of the quiddity
				 *	@param {string} property The name of the property
				 *	@param {string} value The value of the property
				 *	@param {function} callback Confirms that the property defined
				 */

				setPropertyValue: function(property, value, callback) {
					var that = this;
					socket.emit("setPropertyValue", this.get("name"), property, value, function(property, value) {
						//that.get("properties")[property] = value;
						callback("ok");
					});
				},


				/*
				 *	Set in client side the vaolue of a property
				 *	This function is called when the server send a new value of a property
				 *	@param {string} property The name of the property
				 *	@param {string} value The value of the property
				 *	@TODO Find better place for see value midi because this interact whit view (find type prop : string, enum etc.. for focus )
				 */

				setLocalpropertyValue: function(property, value) {
					_.each(this.get("properties"), function(property) {
						if (property.name == property) property.value = value;
					});

					if (property == "last-midi-value" && $("#last_midi_event_to_property").length > 0) {
						$(".preview-value").html("<div class='content-value'>" + value + "</div>");
					}
				},


				/*
				 *	Get and set the properties of a quiddity
				 */

				getProperties: function(callback) {
					var that = this;
					socket.emit("get_properties_description", this.get("name"), function(properties_description) {
						that.set("properties", properties_description);
						callback(properties_description);
					});
				},


				/*
				 *	Remove a specific property
				 *	This function is called by the server when a property is removed
				 *	@param {string} property The name of the property
				 */

				removeProperty: function(property) {
					delete this.get("properties")[property];
					/* trigger a model used to trigger a function of the view that is associated */
					this.trigger("remove:property", property);
				},



				/*
				 *	Add a specific property
				 *	This function is called by the server when a property is added
				 *	@param {string} property The name of the property
				 */

				addProperty: function(property) {
					var that = this;
					socket.emit("get_property_description", this.get("name"), property, function(description) {
						that.get("properties")[property] = description;
						/* trigger a model used to trigger a function of the view that is associated */
						that.trigger("add:property", property);
					});
				},


				/*
				 *	Get the property Value of the quiddity
				 *	@param {string} property The name of the property
				 *
				 */

				getPropertyValue: function(property, callback) {
					var that = this;
					socket.emit("get_property_value", this.get("name"), property, function(propertyValue) {
						callback(propertyValue);
					});
				},


				/*
				 *	Get description of all methods of the quiddity
				 *	@param {function} callback Return the informations about methods
				 */

				getMethodsDescription: function(callback) {
					var that = this;
					socket.emit("getMethodsDescription", this.get("name"), function(methodsDescription) {
						that.set("methods", methodsDescription);
						callback(methodsDescription);
					});
				},


				/*
				 *	Get and set the shmdatas of the quiddity
				 *	@param {function} callback Return the shmdatas of the quiddity
				 */

				getShmdatas: function(callback) {

					var that = this;
					//ask for value of shmdatas and stock in model
					this.getPropertyValue("shmdata-writers", function(shmdatas) {
						if (shmdatas) {
							that.set({
								shmdatas: shmdatas.shmdata_writers
							});
							if (callback) callback(shmdatas.shmdata_writers);
						}
					});
				},


				/*
				 *	Set a mothod of the quiddity
				 *	@param {string} method Name of the method
				 *	@param {array} parameters Parameters of the method
				 *	@param {function} callback Confirm the method is setted
				 */

				setMethod: function(method, parameters, callback) {
					socket.emit("invoke", this.get("name"), method, parameters, function(ok) {
						callback(ok);
					});
				},


				/*
				 *	Add a new method of quiddity
				 *	This function is called by the server when a method is added
				 *	@param {string} method Name of the method
				 */

				addMethod: function(method) {
					var that = this;
					socket.emit("get_method_description", this.get("name"), method, function(description) {
						that.get("methods")[method] = description;
						/* Warned the view that the method has been added */
						that.trigget("add:method", method);
					});
				},


				/*
				 *	Remove a method  of quiddity
				 *	This function is called by the server when a method is removed
				 */

				removeMethod: function(method) {
					delete this.get("methods")[method];
					/* Warned the view that the method has been removed */
					this.trigger("remove:method", method);
				}
			});

		return QuiddModel;
	})