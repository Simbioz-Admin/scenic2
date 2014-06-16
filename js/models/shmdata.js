define(

    /** 
     *	Manage all interaction between the server/views with a specific quiddity
     *	@exports Models/quidd
     */

    [
        'underscore',
        'backbone',
    ],

    function(_, Backbone) {

        /** 
         *	@constructor
         *  @requires Underscore
         *  @augments module:Backbone.Model
         */

        var ShmdataModel = Backbone.Model.extend(

            /**
             *	@lends module:Models/quidd~ShmdataModel.prototype
             */

            {
                idAttribute: "path",
                defaults: {
                    path: null,
                    quidd: null
                },


                /**
                 *	Function executed when the model quiddity is created
                 *	It's used for created a view associate to the model
                 *	This view need to know if it's in table controler or transfer and if it's a source or destination
                 */

                initialize: function() {}

            }
        );
        return ShmdataModel;
    });