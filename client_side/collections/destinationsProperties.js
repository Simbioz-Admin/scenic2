define(

	/** 
	 *	Module to create a collection storing the list of properties controlled from the control panel interface
	 *	@exports collections/controlPorperties
	 */

	[
		'underscore',
		'jquery',
		'backbone',
		'lib/socket',
		'models/control_property'
	],

	function(_, $, Backbone, socket, ModelControlProperty) {


		/** 
		 *	@constructor
		 *  @requires Underscore
		 *  @requires Backbone
		 *	@requires ModelControlProperty
		 *  @augments module:Backbone.Collection
		 */

		var CollectionControlProperties = Backbone.Collection.extend(

			/**
			 *	@lends module:collections/controlPorperties~CollectionControlProperties.prototype
			 */

			{
				url: '/destinationsProperties',
				model: ModelControlProperty,
				parse: function(results, xhr) {
					return results;
				},


				/**
				 *	Initialize the collection and we declare all events for receive information from the server switcher about the propeties controlled 
				 */

				initialize: function() {
					var that = this;

					/** 
					 *	@event setDicoValue
					 *	Event called when a new property controled is added 
					 */
					socket.on("setDicoValue", function(property, value) {
						that.add(value);
						views.global.notification("info", "The property " + value.property + " of " + value.quiddName + " is added.");
					});

					/** Event called when a property controled is removed */
					socket.on("removeValueOfPropertyDico", function(property, name) {
						that.remove(name);
						views.global.notification("info", "The property control " + name + " is deleted.");
						//remove here box of property
						$("[data-nameandproperty='" + name + "']").remove();


					});
				},


				/**
				 *	Add a new control property to the dico
				 *	@param {string} quiddName Name quiddity having the property that interests us
				 *	@param {string} property Name of the property to add to the dico
				 *	@param {object} callback Callback to the calling function
				 */

				create : function(quiddName, property, callback) {
					var newControlProperty = {
						name: quiddName + "_" + property,
						quiddName: quiddName,
						property: property
					}
					socket.emit("setPropertyValueOfDico", "controlProperties", newControlProperty, function(ok) {
						callback(newControlProperty.name);
					});
				}
			});

		return CollectionControlProperties;
	});
