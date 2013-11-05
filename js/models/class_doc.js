define(

	/** 
	 *	Model ClassDoc
	 *	A Model of client contain information about a specific quiddity
	 *	@exports Models/ClassDoc
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
		 *	@requires ViewControlProperty
		 *  @augments module:Backbone.Model
		 */

		var ClassDocModel = Backbone.Model.extend(

		/**
		 *	@lends module: Models/ClassDoc~ClassDocModel.prototype
		 */

		{
			idAttribute: "class name",
			defaults: {
				"class name": null,
				"category": null,
				"short_description": null,
				"properties": null
			}
		});

		return ClassDocModel;
	})