// Filename: app.js
define(

    /** 
     *	View Source
     *	The source view is for each source type quiddity create whatsoever to control or transfer table
     *	@exports Views/Launch
     */

    [
        'underscore',
        'backbone',
        'jquery',
        'collections/tables', 'collections/classes_doc', 'collections/receivers', 'collections/quidds', 'collections/control_properties', 'collections/loggers', 'collections/users', 'collections/channels-irc',
        'views/destinations', 'views/global', 'views/quidds', 'views/destinationProperties', 'views/loggers', 'views/users/users', 'views/ircs', 'views/systemusage/Systemusage'

    ],

    function(
        _,
        Backbone,
        $,
        CollectionTables, CollectionClassesDoc, CollectionReceivers, CollectionQuidds, CollectionDestinationProperties, CollectionLoggers, CollectionUsers, CollectionIrcs,
        ViewDestinations, ViewGlobal, ViewQuidds, ViewDestinationProperties, ViewLoggers, ViewUsers, ViewIrcs, ViewSystemUsage
    ) {

        /** 
         *	@constructor
         *  @requires Underscore
         *  @requires Jquery
         *	@requires CollectionTables
         *	@requires CollectionClassesDoc
         *	@requires CollectionReceivers
         *	@requires CollectionQuidds
         *	@requires CollectionDestinationProperties
         *	@requires CollectionLoggers
         *	@requires CollectionIrcs
         *	@requires ViewDestinations
         *	@requires ViewGlobal
         *	@requires ViewQuidds
         *	@requires ViewDestinationProperties
         *	@requires ViewLoggers
         *	@requires ViewIrcs
         *  @augments module:Backbone.View
         */

        var initialize = function() {
            "use strict";

            $("#currentUser").html(config.nameComputer);

            //loading the different collections
            collections.classesDoc = new CollectionClassesDoc();
            collections.classesDoc.fetch({
                success: function(response) {

                    //loading views
                    views.quidds = new ViewQuidds({
                        collection: collections.quidds
                    });

                    collections.quidds = new CollectionQuidds();
                    collections.quidds.fetch({
                        error: function(err) {
                            console.log("error", err);
                        },
                        success: function() {
                            console.log("quidds Loaded");

                            collections.receivers = new CollectionReceivers();
                            collections.receivers.fetch();

                            collections.tables = new CollectionTables();

                            collections.destinationProperties = new CollectionDestinationProperties();
                            collections.destinationProperties.fetch();

                            collections.loggers = new CollectionLoggers();
                            views.logger = new ViewLoggers({
                                collection: collections.loggers
                            });

                            views.global = new ViewGlobal();
                            views.systemusage = new ViewSystemUsage();

                            views.destinationProperties = new ViewDestinationProperties({
                                collection: collections.destinationProperties
                            });


                            /* generate view for manage users */

                            collections.users = new CollectionUsers();

                            collections.users.fetch({
                                success: function() {
                                    views.users = new ViewUsers({
                                        collection: collections.users
                                    });
                                }
                            });
                        }
                    });



                }
            });

            collections.irc = new CollectionIrcs();
            views.ircs = new ViewIrcs();
        }


        return {
            initialize: initialize
        };

    });