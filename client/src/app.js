define( [
    // Lib
    'underscore',
    'backbone',
    'mutators',
    'async',
    'jquery',
    'i18n',
    // Internal Lib
    'model/SIPConnection',
    // Model
    'model/SaveFiles',
    'model/ClassDescriptions',
    'model/Quiddities',
    // View
    'view/Scenic'
], function ( _, Backbone, Mutators, async, $, i18n,
              // Internal Libs
              SIPConnection,
              // Models
              SaveFiles, ClassDescriptions, Quiddities,
              // Views
              ScenicView ) {

    var saveFiles         = null;
    var classDescriptions = null;
    var quiddities        = null;
    var sip               = null;
    var tables            = null;

    var config = null;

    var initialize = function ( config, callback ) {

        if ( this.initialized ) {
            return;
        }

        this.config = config;

        var self = this;

        async.series( [

            // Translations
            function ( callback ) {
                i18n.init( {
                    lngWhitelist: ['en', 'en-US', 'en-CA', 'fr', 'fr-FR', 'fr-CA'],
                    cookieName:   'lang',
                    ns:           'translation'
                } ).done( function () {
                    $( 'body' ).i18n();
                    callback();
                } );
            },

            // Get class descriptions
            function ( callback ) {
                self.saveFiles = new SaveFiles();
                self.saveFiles.fetch( {success: _.partial( callback, null ), error: callback} );
            },

            // Get class descriptions
            function ( callback ) {
                self.classDescriptions = new ClassDescriptions();
                self.classDescriptions.fetch( {success: _.partial( callback, null ), error: callback} );
            },

            // Get Quiddities
            function ( callback ) {
                self.quiddities = new Quiddities();
                self.quiddities.fetch( {success: _.partial( callback, null ), error: callback} );
            },

            // SIP
            function ( callback ) {
                self.sip = new SIPConnection();
                //self.sip.autoconnect( {success: _.partial( callback, null ), error: callback} );
                callback();
            }

        ], function ( error ) {
            if ( error ) {
                alert( error.toString() );
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
        config:            config,
        initialize:        initialize,
        saveFiles:         saveFiles,
        classDescriptions: classDescriptions,
        quiddities:        quiddities,
        sip:               sip,
        tables:            tables
    };
} )
;