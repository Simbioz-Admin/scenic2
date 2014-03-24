define(

    /** 
     *	Collections for manage the users
     *	@exports collections/Users
     */

    [
        'underscore',
        'backbone',
        'models/user'
    ],

    function(_, Backbone, ModelLogger) {

        /** 
         *	@constructor
         *  @requires Underscore
         *  @requires Backbone
         *	@requires ModelLogger
         *  @augments module:Backbone.Collection
         */

        var CollectionUsers = Backbone.Collection.extend(

            /**
             *	@lends module:collections/Users~CollectionUsers.prototype
             */

            {
                model: ModelLogger,
                url: '/users/',
                orderBy: "status",
                parse: function(results, xhr) {
                    return results;
                },

                /* define the attribute for order model of this collection */
                comparator: function(a) {
                    return a.get(this.orderBy);
                },
                /** Initialization of the Logger Collection */

                initialize: function() {

                    // this.bind("add", function(note) {
                    // 	console.log(note);
                    // });
                }
            });

        return CollectionUsers;
    })