define(

    /** 
     *	Manage all interaction between the server/views with a specific quiddity
     *	@exports Models/Shmdata
     */

    [
        'underscore',
        'backbone',
        'views/shmdata'
    ],

    function(_, Backbone, ViewShmdata) {

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
                    quidd: null,
                    byteRate: 0,
                    type: null
                },


                /**
                 *	Function executed when the model quiddity is created
                 *	It's used for created a view associate to the model
                 *	This view need to know if it's in table controler or transfer and if it's a source or destination
                 */

                initialize: function() {

                    // this.on('destroy', this.remove);
                    this.set("type", this.get("path").split("_")[3].split("-")[0]);
                },
                createViewForTable: function(table) {
                    new ViewShmdata({
                        model: this,
                        table: table
                    })
                }
            }
        );
        return ShmdataModel;
    });