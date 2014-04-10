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

                initialize: function() {
                    var that = this;
                    console.log("initialize collection users");

                    /* receive update info user from server side */
                    socket.on("updateInfoUser", function(infoUser) {
                        var model = that.get(infoUser.sip_url);
                        if (infoUser.status == "online") infoUser.status = 0;
                        if (infoUser.status == "offline") infoUser.status = 2;
                        if (model) model.set(infoUser);
                        // that.trigger("reOrder");
                    });


                    // this.bind("add", function(note) {
                    // 	console.log(note);
                    // });
                },

                parse: function(results, xhr) {
                    console.log(results);
                    _.each(results, function(user) {
                        if (user.status == "online") user.status = 0;
                        if (user.status == "offline") user.status = 2;
                    })
                    return results;
                },

                /* define the attribute for order model of this collection */
                comparator: function(a) {
                    return a.get(this.orderBy);
                },
                /** Initialization of the Logger Collection */
            });

        return CollectionUsers;
    })