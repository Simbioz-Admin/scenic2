define(

    /** 
     *	Model User
     *	@exports Models/User
     */

    [
        'underscore',
        'backbone',
        'views/users/user'
    ],

    function(_, Backbone, ViewUser) {

        /** 
         *	@constructor
         *  @requires Underscore
         *  @requires Backbone
         *	@requires ViewUser
         *  @augments module:Backbone.Model
         */

        var UserModel = Backbone.Model.extend(

            /**
             *	@lends module: Models/User~UserModel.prototype
             */

            {
                defaults: {
                    id: null,
                    name: null,
                    status: null,
                    lastMessage: "Aucun message"
                },
                initialize: function() {


                }
            });

        return UserModel;
    })