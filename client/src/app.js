define( [
    // Lib
    'underscore',
    'backbone',
    'mutators',
    'async',
    'jquery',
    'i18n',
    // Model
    'model/SaveFiles',
    'model/ClassDescriptions',
    'model/Quiddities',
    //'model/connections/SIPDestinations',
    //'model/connections/RTPDestinations',
    //'model/connections/ControlDestinations',
    'model/Contacts',
    // View
    'view/Scenic'
], function ( _, Backbone, Mutators, async, $, i18n,
              // Models
              SaveFiles, ClassDescriptions, Quiddities,
              Contacts,
              // Views
              ScenicView ) {

    var saveFiles           = null;
    var classDescriptions   = null;
    var quiddities          = null;
    var sipDestinations     = null;
    var rtpDestinations     = null;
    var controlDestinations = null;
    var contacts            = null;
    var tables              = null;

    var config = null;

    var initialize = function ( config, callback ) {

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
                self.saveFiles = new SaveFiles();
                self.saveFiles.fetch( {success: _.partial( callback, null ), error: callback} );
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

            /*function ( callback ) {
             // Get RTP Destinations
             self.sipDestinations = new SIPDestinations();
             //self.sipDestinations.fetch( {success: _.partial( callback, null ), error: callback} );
             callback();
             },*/

            /*function ( callback ) {
             // Get RTP Destinations
             self.rtpDestinations = new RTPDestinations();
             self.rtpDestinations.fetch( {success: _.partial( callback, null ), error: callback} );
             },*/

            /*function ( callback ) {
             // Get Control Destinations
             self.controlDestinations = new ControlDestinations();
             self.controlDestinations.fetch( {success: _.partial( callback, null ), error: callback} );
             },*/

            function ( callback ) {
                self.contacts = new Contacts();
                self.contacts.fetch( {success: _.partial( callback, null ), error: callback} );
            }

        ], function ( error ) {
            if ( error ) {
                alert( error );
                console.error( error );
                if ( callback ) {
                    callback( error );
                }
                return;
            }

            // Scenic Main View
            var scenicView = new ScenicView( self );
            scenicView.render();

            if ( callback ) {
                callback();
            }
        } );

        this.initialized = true;
    };

    return {
        config:              config,
        initialize:          initialize,
        saveFiles:           saveFiles,
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