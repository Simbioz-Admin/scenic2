define(

	/** 
	 *	View ControlProperties
	 *	Manage the event global (not associate to a model) for the properties in table control
	 *	@exports Models/ControlProperties
	 */

	[
		'underscore',
		'backbone'
	],

	function(_, Backbone) {

		/** 
		 *	@constructor
		 *  @requires Underscore
		 *  @requires Backbone
		 *  @augments module:Backbone.Model
		 */

		var ControlPropertiesView = Backbone.View.extend(

			/**
			 *	@lends module: Views/ControlProperties~ControlPropertiesView.prototype
			 */


			{
				el: 'body',
				events: {
					"click .create-ControlProperty": "createControlProperty",
					"click .connect-properties": "connectProperties",
				},


				/* Called when the view ControlProperties is initialized */

				initialize: function() {},


				/*  Called when a property is selected on the dropdown menu in table controler (add destination) */

				createControlProperty: function(element) {
					var property = $(element.target).data("property"),
						that = this,
						quiddName = $(element.target).closest("ul").data("quiddname");

					this.collection.create(quiddName, property, function(quiddName) {
						$(element.target).remove();
					});
				},


				/* Called when choose to create a connection between a quiddity control (midi) and a destination */

				connectProperties: function(element) {

					if ($(element.target).attr("class").indexOf("connect-properties") == -1) return false;

					var quiddSource = $(element.target).parent().data("quiddname"),
						propertySource = $(element.target).parent().data("propertyname"),
						destination = $(element.target).data("nameandproperty").split("_"),
						sinkSource = destination[0],
						sinkProperty = destination[1],
						nameQuidd = "mapper_" + quiddSource + "_" + propertySource + "_" + $(element.target).data("nameandproperty");

					socket.emit("create", "property-mapper", nameQuidd, function(infoQuidd) {
						var model = collections.quidds.create(infoQuidd);
						socket.emit("invoke", infoQuidd.name, "set-source-property", [quiddSource, propertySource], function(ok) {});
						socket.emit("invoke", infoQuidd.name, "set-sink-property", [sinkSource, sinkProperty], function(ok) {});
					});
				}
			});

		return ControlPropertiesView;
	});