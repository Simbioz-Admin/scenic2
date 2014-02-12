define(

	/** 
	 *	Module for get information about the documentation of quiddities
	 *	@exports collections/classesDoc
	 */

	[
		'underscore',
		'backbone',
		'models/class_doc'
	],

	function(_, Backbone, ClassDocModel) {

		/** 
		 *	@constructor
		 *  @requires Underscore
		 *  @requires Backbone
		 *	@requires ClassDocModel
		 *  @augments module:Backbone.Collection
		 */

		var ClassesDocCollection = Backbone.Collection.extend(

			/**
			 *	@lends module:collections/classesDoc~ClassesDocCollection.prototype
			 */

			{
				model: ClassDocModel,
				url: '/classes_doc/',
				parse: function(results, xhr) {
					return results.classes;
				},


				/** 
				 *	Return information about the properties of specific quiddity
				 *	@param {string} ClassName Name of the class
				 *	@param {string} Name of the property
				 *	@param {object} Callback for return the information	
				 */

				getPropertyByClass: function(className, propertyName, callback) {
					socket.emit("getPropertyByClass", className, propertyName, function(propertyByClass) {
						callback(propertyByClass);
					});
				},


				/** 
				 *	Returns the type of classes available for a defined category
				 *	@param {string} Name of the category
				 */

				getByCategory: function(categories) {

					filtered = _.filter(this.toJSON(), function(classDoc) {
						var sameCat = false;
						_.each(categories, function(cat) {
							if(classDoc.category.indexOf(cat) >= 0) sameCat = true;
						});
						if(sameCat) return classDoc;
						// if(_.contains(categories, classDoc.category)) return classDoc 
					});

					return filtered;
				}
			});

		return ClassesDocCollection;
	})