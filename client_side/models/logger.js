define(

	/** 
	 *	Model Logger
	 *	Represent one message log provide by the server
	 *	@exports Models/Logger
	 */

	[
		'underscore',
		'backbone',
	],

	function(_, Backbone) {

		/** 
		 *	@constructor
		 *  @requires Underscore
		 *  @requires Backbone
		 *  @augments module:Backbone.Model
		 */

		var LoggerModel = Backbone.Model.extend(

			/**
			 *	@lends module: Models/Logger~LoggerModel.prototype
			 */

			{
				defaults: {
					"date": null,
					"type": null,
					"from": null,
					"message": null
				}
			});

		return LoggerModel;
	})