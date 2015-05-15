define( [
    'underscore',
    'backbone',
    'mutators',
    'async',
    'jquery',
    'i18n',
    'collections/classes_doc',
    'collections/destinationsRtp',
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
    'views/SystemUsage',
    // New Models
    'model/Tables',
    'model/Quiddities',
    // New Views
    'views/Tabs'
], function ( _, Backbone, Mutators, async, $, i18n, CollectionClassesDoc, CollectionDestinationsRtp,
              CollectionDestinationsProperties, CollectionLoggers, CollectionUsers, CollectionIrcs,
              ViewGlobal, ViewQuidds, ViewDestinationProperties, ViewLoggers, ViewUsers, ViewIrcs,
              SystemUsageView,
              // New Models
              Tables, Quiddities,
              // New Views
              TabsView ) {

    var initialize = function ( config ) {

        //FIXME: There is nowhere to put this $("#currentUser").html(config.nameComputer);

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
                views.quiddities = new ViewQuidds( {collection: collections.quiddities} );

                collections.destinationsRtp = new CollectionDestinationsRtp();
                collections.destinationsRtp.fetch();

                collections.quiddities = new Quiddities();
                collections.quiddities.fetch( { success: _.partial(callback, null ), error: callback } );
            },

            function( callback ) {
                collections.tables = new Tables();

                collections.destinationProperties = new CollectionDestinationsProperties();
                collections.destinationProperties.fetch();

                views.global = new ViewGlobal();
                views.systemUsage   = new SystemUsageView();

                collections.irc = new CollectionIrcs();
                views.ircs      = new ViewIrcs();

                views.destinationProperties = new ViewDestinationProperties( { collection: collections.destinationProperties } );

                views.users = new ViewUsers( { collection: collections.users } );


                //
                //
                //
                //
                //
                //
                //
                //




                // Finish with new views
                var tabsView = window.tabs = new TabsView({ collection: collections.tables });
                // Temporary tab click handler
                tabsView.on('childview:show:table', function(childView, args) {
                    collections.tables.setCurrentTable( childView.model );
                    // Legacy
                    $(".table").removeClass("active");
                    $("#" + childView.model.get('id')).addClass("active");
                });
                tabsView.render();


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