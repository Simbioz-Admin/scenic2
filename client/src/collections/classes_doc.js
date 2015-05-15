define(

    /** 
     *	Module for get information about the documentation of quiddities
     *	@exports collections/classDescriptions
     */

    [
        'underscore',
        'backbone',
        'lib/socket',
        'models/class_doc'
    ],

    function(_, Backbone, socket, ClassDocModel) {

        /** 
         *	@constructor
         *  @requires Underscore
         *  @requires Backbone
         *	@requires ClassDocModel
         *  @augments module:Backbone.Collection
         */

        var ClassesDocCollection = Backbone.Collection.extend(

            /**
             *	@lends module:collections/classDescriptions~ClassesDocCollection.prototype
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
                    socket.emit("get_property_by_class", className, propertyName, function(propertyByClass) {
                        callback(propertyByClass);
                    });
                }
            });

        return ClassesDocCollection;
    })