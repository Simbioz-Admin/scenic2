define( [
    'underscore',
    'backbone',
    'mutators',
    'async',
    'jquery',
    'i18n',
    'collections/destinationsProperties',
    'collections/loggers',
    'collections/channels-irc',
    'views/global',
    'views/loggers',
    'views/users/users',
    'views/ircs',
    'view/scenic/SystemUsage',
    // New Models
    'model/Tables',
    'model/ClassDescriptions',
    'model/Quiddities',
    'model/SIPDestinations',
    'model/RTPDestinations',
    'model/ControlDestinations',
    'model/Contacts',
    // New Views
    'view/Scenic',
    'view/scenic/Tabs'
], function ( _, Backbone, Mutators, async, $, i18n,
              CollectionLoggers, CollectionIrcs,
              ViewGlobal, ViewDestinationProperties, ViewLoggers, ViewUsers, ViewIrcs,
              SystemUsageView,
              // New Models
              Tables, ClassDescriptions, Quiddities, SIPDestinations, RTPDestinations, ControlDestinations, Contacts,
              // New Views
              ScenicView, TabsView ) {

    var classDescriptions = null;
    var quiddities = null;
    var sipDestinations = null;
    var rtpDestinations = null;
    var controlDestinations = null;
    var contacts = null;
    var tables = null;

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
                // Get class descriptions
                self.classDescriptions = collections.classDescriptions = new ClassDescriptions();
                self.classDescriptions.fetch( {success: _.partial( callback, null ), error: callback} );
            },

            function ( callback ) {
                // Get Quiddities
                self.quiddities = collections.quiddities = new Quiddities();
                self.quiddities.fetch( {success: _.partial( callback, null ), error: callback} );
            },

            function ( callback ) {
                // Get RTP Destinations
                self.sipDestinations = collections.sipDestinations = new SIPDestinations();
                //self.sipDestinations.fetch( {success: _.partial( callback, null ), error: callback} );
                callback();
            },

            function ( callback ) {
                // Get RTP Destinations
                self.rtpDestinations = collections.rtpDestinations = new RTPDestinations();
                self.rtpDestinations.fetch( {success: _.partial( callback, null ), error: callback} );
            },

            function ( callback ) {
                // Get Control Destinations
                self.controlDestinations = collections.controlDestinations = new ControlDestinations();
                self.controlDestinations.fetch( {success: _.partial( callback, null ), error: callback} );
            },

            function ( callback ) {
                self.contacts = collections.contacts = new Contacts();
                self.contacts.fetch( {success: _.partial( callback, null ), error: callback} );
            },

            function ( callback ) {
                // Table Collection
                self.tables = collections.tables = new Tables();

                // Scenic Main View
                var scenicView = new ScenicView( self );
                scenicView.render();


                //
                //
                //
                //

                // Views
                views.global              = new ViewGlobal();
                views.controlDestinations = new ViewDestinationProperties( {collection: collections.controlDestinations} );
                views.users               = new ViewUsers( {collection: collections.contacts} );

                // Finish with new views
                /*var tabsView = window.tabs = new TabsView( {collection: collections.tables} );
                 // Temporary tab click handler
                 tabsView.on( 'childview:show:table', function ( childView, args ) {
                 collections.tables.setCurrentTable( childView.model );
                 // TODO: Legacy
                 $( ".table" ).removeClass( "active" );
                 $( "#" + childView.model.get( 'id' ) ).addClass( "active" );
                 } );
                 tabsView.render();*/


                callback();
            }

        ], function ( error ) {
            if ( error ) {
                console.error( error );
            }
        } );
    };

    return {
        initialize:          initialize,
        classDescriptions:   classDescriptions,
        quiddities:          quiddities,
        sipDestinations:     sipDestinations,
        rtpDestinations:     rtpDestinations,
        controlDestinations: controlDestinations,
        contacts:            contacts,
        tables:              tables
    };
} )
;