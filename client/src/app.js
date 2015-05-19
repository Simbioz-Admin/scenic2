define( [
    'underscore',
    'backbone',
    'mutators',
    'async',
    'jquery',
    'i18n',
    // New Models
    'model/ClassDescriptions',
    'model/Quiddities',
    'model/SIPDestinations',
    'model/RTPDestinations',
    'model/ControlDestinations',
    'model/Contacts',
    // New Views
    'view/Scenic'
], function ( _, Backbone, Mutators, async, $, i18n,
              // New Models
              ClassDescriptions, Quiddities, SIPDestinations, RTPDestinations, ControlDestinations, Contacts,
              // New Views
              ScenicView ) {

    var classDescriptions = null;
    var quiddities = null;
    var sipDestinations = null;
    var rtpDestinations = null;
    var controlDestinations = null;
    var contacts = null;
    var tables = null;

    var config = null;

    var initialize = function ( config ) {

        if ( this.initialized ) {
            return;
        }

        this.config = config;

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
                self.classDescriptions = new ClassDescriptions();
                self.classDescriptions.fetch( {success: _.partial( callback, null ), error: callback} );
            },

            function ( callback ) {
                // Get Quiddities
                self.quiddities = new Quiddities();
                self.quiddities.fetch( {success: _.partial( callback, null ), error: callback} );
            },

            function ( callback ) {
                // Get RTP Destinations
                self.sipDestinations = new SIPDestinations();
                //self.sipDestinations.fetch( {success: _.partial( callback, null ), error: callback} );
                callback();
            },

            function ( callback ) {
                // Get RTP Destinations
                self.rtpDestinations = new RTPDestinations();
                self.rtpDestinations.fetch( {success: _.partial( callback, null ), error: callback} );
            },

            function ( callback ) {
                // Get Control Destinations
                self.controlDestinations = new ControlDestinations();
                self.controlDestinations.fetch( {success: _.partial( callback, null ), error: callback} );
            },

            function ( callback ) {
                self.contacts = new Contacts();
                self.contacts.fetch( {success: _.partial( callback, null ), error: callback} );
            }

        ], function ( error ) {
            if ( error ) {
                console.error( error );
            }

            // Scenic Main View
            var scenicView = new ScenicView( self );
            scenicView.render();
        } );

        this.initialized = true;
    };

    return {
        config:              config,
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