define( [
    'underscore',
    'backbone',
    'mutators',
    'async',
    'jquery',
    'i18n',
    'collections/tables',
    'collections/classes_doc',
    'collections/destinationsRtp',
    'collections/quidds',
    'collections/destinationsProperties',
    'collections/loggers',
    'collections/users',
    'collections/channels-irc',
    'views/global',
    'views/quidds',
    'views/control/destinationProperties',
    'views/loggers',
    'views/users/users',
    'views/ircs',
    'views/SystemUsage'
], function ( _, Backbone, Mutators, async, $, i18n, CollectionTables, CollectionClassesDoc, CollectionDestinationsRtp,
              CollectionQuidds, CollectionDestinationsProperties, CollectionLoggers, CollectionUsers, CollectionIrcs,
              ViewGlobal, ViewQuidds, ViewDestinationProperties, ViewLoggers, ViewUsers, ViewIrcs,
              SystemUsageView ) {

    var initialize = function ( config ) {

        //FIXME: There is nowhere to put this $("#currentUser").html(config.nameComputer);

        var self = this;

        async.series( [

            function ( callback ) {
                // Translations
                i18n.init( {
                    lngWhitelist: ['en', 'en-US', 'en-CA', 'fr', 'fr-FR', 'fr-CA'],
                    cookieName:   'lang',
                    ns:           'translation'
                } ).done( function () {
                    $( 'body' ).i18n();
                    callback();
                } );
            },

            function ( callback ) {
                collections.users      = new CollectionUsers();
                collections.classesDoc = new CollectionClassesDoc();
                collections.classesDoc.fetch( {success: _.partial(callback, null)} );
            },

            function ( callback ) {
                views.quidds = new ViewQuidds( {collection: collections.quidds} );

                collections.destinationsRtp = new CollectionDestinationsRtp();
                collections.destinationsRtp.fetch();

                collections.quidds = new CollectionQuidds();
                collections.quidds.fetch( {success: _.partial(callback, null ), error: callback} );
            },

            function( callback ) {
                collections.tables = new CollectionTables();

                collections.destinationProperties = new CollectionDestinationsProperties();
                collections.destinationProperties.fetch();

                /* FIXME: New logger
                 collections.loggers = new CollectionLoggers();
                 views.logger = new ViewLoggers({
                 collection: collections.loggers
                 });
                 */

                views.global = new ViewGlobal();
                views.systemUsage   = new SystemUsageView();

                collections.irc = new CollectionIrcs();
                views.ircs      = new ViewIrcs();

                views.destinationProperties = new ViewDestinationProperties( { collection: collections.destinationProperties } );

                views.users = new ViewUsers( { collection: collections.users } );

                callback();
            }

        ], function( error ) {
            if ( error ) {
                console.error( error );
            }
        } );
    };

    return {
        initialize: initialize
    };
} );