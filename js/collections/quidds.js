define(

	/** 
     *	A module for creating collection of quiddities
     *	@exports collections/quidds
 	 */

	[
		'underscore',
		'backbone',
		'models/quidd',
	],

	function(_, Backbone, QuiddModel) {

		/** 
		 *	@constructor
		 *  @requires Underscore
		 *  @requires Backbone
		 *	@requires QuiddModel
		 *  @augments module:Backbone.Collection
		 */

		var QuiddsCollection = Backbone.Collection.extend(

			/**
			 *	@lends module:collections/quidds~QuiddsCollection.prototype
			 */

			{
				model: QuiddModel,
				url: '/quidds/',
				listEncoder: [],
				parse: function(results, xhr) {
					return results;
				},


				/** Initialization of the quidds Collection 
				 *	We declare all events for receive information about quiddities
				 */

				initialize: function() {
					var that = this;

					/** Event called when the server has created a quiddity */
					socket.on("create", function(quiddInfo) {
						that.create(quiddInfo);
					});

					/** Event called when the server has removed a quiddity */
					socket.on("remove", function(quidd) {
						that.delete(quidd);
					});

					/** Event called when a signal is emitted by switcher add/remove a method or property 
					 *	This event is called only if the user has the edit panel that quiddity is open
					 */
					socket.on("signals_properties_info", function(prop, quiddName, value) {
						that.signalsPropertiesInfo(prop, quiddName, value);
					});


					/** Event called when the value of a property changes */
					socket.on("signals_properties_value", function(quiddName, prop, value) {
						that.signalsPropertiesUpdate(quiddName, prop, value);
					});

					/** Event called when the shmdatas of specific quidd is created */
					socket.on("updateShmdatas", function(qname, shmdatas) {
						that.updateShmdatas(qname, shmdatas);
					});
				},


				/**
				 *	Delete a model quiddity
				 *	This function is executed on event remove emitted by the server when switcher remove a quiddity
				 *	@param {string} quiddName The name of the quiddity (id) to remove
				 */

				delete: function(quiddName) {
					var model = this.get(quiddName);
					if (model) {
						model.trigger('destroy', model, that);
						views.global.notification("info", quiddName + "  has deleted");
					}
				},


				/**
				 *	create a model quiddity and add to the collection Quidds in client side
				 *	This function is executed on event create emitted by the server when switcher create a quiddity
				 *	@param {object} quiddInfo object json with information about the quiddity (name, class, etc...)
				 */

				create: function(quiddInfo) {
					var model = new QuiddModel(quiddInfo);
					this.add(model);
					views.global.notification("info", model.get("name") + " (" + model.get("class") + ") is created");
					return model;
				},

				/**
				 *	add/remove property or method of a specific quiddity
				 *	This function is executed on event signals properties info emitted by the server when switcher add/remove method or property
				 *	@param {string} prop The type of event on property or method 
				 *	@param {string} quiddName The name of the quiddity
				 *	@param {string}	name The name of the property or method
				 */

				signalsPropertiesInfo : function(prop, quiddName, name) {
					var model = collections.quidds.get(quiddName);
					if (prop == "on-property-removed") {
						model.removeProperty(name[0]);
					}
					if (prop == "on-property-added") {
						model.addProperty(name[0]);
					}
					if (prop == "on-method-added") {
						model.addMethod(name[0]);
					}
					if (prop == "on-method-removed") {
						model.removeMethod(name[0]);
					}
				},


				/**
				 *	Update the property value of a specific quiddity
				 *	This function is executed on socket event signals properties update emitted by the server when switcher update a property value.
				 *	@param {string} prop The type of event on property or method 
				 *	@param {string} quiddName The name of the quiddity
				 *	@param {string}	name The name of the property or method
				 */

				signalsPropertiesUpdate : function(quiddName, prop, name) {
					/** if it's byte-rate we update directly the status of viewmeter */
					if (prop == "byte-rate") {
						views.quidds.updateVuMeter(quiddName, name);

					} else {
						var model = collections.quidds.get(quiddName);
						if (model) {
							model.get("properties")[prop]["default value"] = name;
							model.trigger("update:value", prop);
						}
					}
				},

				updateShmdatas : function(quiddName, shmdatas) {
					var quidd = this.get(quiddName);
					//sometimes the server ask to update shmdatas but is not yet insert in frontend, also we check that!
					if (quidd) {
						quidd.set("shmdatas", shmdatas);
					}
				},

				/**
				 *	Ask to the server switcher the property value of a specific quiddity
				 *	@param {string} Name of the quiddity
				 *	@param {string} property The name of the property
				 *	@param {function} callback callback to send the value
				 */

				getPropertyValue: function(quiddName, property, callback) {
					socket.emit("get_property_value", quiddName, property, function(propertyValue) {
						callback(propertyValue);
					});
				},

			});

		return QuiddsCollection;
	})