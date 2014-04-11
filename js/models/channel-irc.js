define(

	/** 
	 *	Model ChannelIrc
	 *	Represent simpley a channel on irc by default we have two different #scenic & #[name_choose]_sat
	 *	@exports Models/ChannelIrc
	 */

	[
		'underscore',
		'backbone',
		'views/irc'
	],

	function(_, Backbone, ViewIrc) {

		/** 
		 *	@constructor
		 *  @requires Underscore
		 *  @requires Backbone
		 *	@requires ViewIrc
		 *  @augments module:Backbone.Model
		 */

		var ChannelModel = Backbone.Model.extend(

			/**
			 *	@lends module: Models/table~TableModel.prototype
			 */


			{
				idAttribute: "channel",

				defaults: {
					"channel": null,
					"username": "default",
					"users": [],
					"msgNotView": 0,
					"active": false,
				},

				/* Called when the table is initialized and create a view */
				initialize: function() {
					var view = new ViewIrc({
						model: this
					});
				},

			});

		return ChannelModel;
	})