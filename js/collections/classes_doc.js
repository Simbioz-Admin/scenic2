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

				getByCategory: function(category) {

					filtered = this.filter(function(classDoc) {
						if (classDoc.get("category").indexOf(category) >= 0) return classDoc;
					});

					return new ClassesDocCollection(filtered);
				}
			});

		return ClassesDocCollection;
	})