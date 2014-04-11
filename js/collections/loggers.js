define(

	/** 
	 *	Collections for manage the logs
	 *	@exports collections/loggers
	 */

	[
		'underscore',
		'backbone',
		'models/logger'
	],

	function(_, Backbone, ModelLogger) {

		/** 
		 *	@constructor
		 *  @requires Underscore
		 *  @requires Backbone
		 *	@requires ModelLogger
		 *  @augments module:Backbone.Collection
		 */

		var CollectionLoggers = Backbone.Collection.extend(

			/**
			 *	@lends module:collections/loggers~CollectionLoggers.prototype
			 */

			{
				model: ModelLogger,
				url: '/log/',
				parse: function(results, xhr) {
					return results;
				},


				/** Initialization of the Logger Collection */

				initialize: function() {
					console.log("init CollectionTable");

					// this.bind("add", function(note) {
					// 	console.log(note);
					// });
				}
			});

		return CollectionLoggers;
	})