require( {
    packages: [
        {
            name:     'crypto-js',
            location: '../../bower_components/crypto-js/',
            main:     'index'
        }
    ],
    paths:    {
        text:       '../../bower_components/requirejs-text/text',
        socketio:   '/socket.io/socket.io', // Served by the socket.io server, needs a build path to be set to 'empty:' in the build configuration
        underscore: '../../bower_components/underscore/underscore',
        backbone:   '../../bower_components/backbone/backbone',
        cocktail:   '../../bower_components/cocktail/Cocktail',
        marionette: '../../bower_components/marionette/lib/backbone.marionette',
        mutators:   '../../bower_components/backbone.mutators/backbone.mutators',
        async:      '../../bower_components/async/lib/async',
        jquery:     '../../bower_components/jquery/dist/jquery.min',
        jqueryui:   '../../bower_components/jquery-ui/jquery-ui.min',
        toastr:     '../../bower_components/toastr/toastr',
        punch:      '../../bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.min',
        spin:       '../../bower_components/spin.js/spin',
        i18n:       '../../bower_components/i18next/i18next.min',
        // In-house
        template:   '../template'
    },
    shim:     {
        underscore: {
            exports: '_'
        },
        backbone:   {
            deps:    ["underscore", "jquery"],
            exports: "Backbone"
        },
        jqueryui:   {
            deps:    ["jquery"],
            exports: "jqueryui"
        },
        punch:      {
            deps: ['jquery', 'jqueryui']
        },
        i18n:       {
            deps:    ['jquery'],
            exports: 'i18n'
        }
    },
    deps:     [
        'punch'
    ]
}, [
    'async',
    'marionette',
    'model/Sessions',
    'model/Session',
    'view/ApplicationView'
], function ( async, Marionette, Sessions, Session, ApplicationView ) {

    // TODO: Legacy
    $( document ).tooltip();
    /*$( document ).tooltip( {
     track:   true,
     content: function () {
     var element = $( this );
     return element.attr( "title" );

     }
     } );*/

    async.series( [

        function( callback ) {
            // I18N INITIALIZATION
            i18n.init( {
                lngWhitelist: ['en', 'en-US', 'en-CA', 'fr', 'fr-FR', 'fr-CA'],
                lng:          localStorage.getItem( 'lang' ) ? localStorage.getItem( 'lang' ) : 'en',
                ns:           'client',
                fallbackLng:  false
            } ).done( function () {
                // Replace Marionette's renderer with one that supports i18n
                var render                 = Marionette.Renderer.render;
                Marionette.Renderer.render = function ( template, data ) {
                    data = _.extend( data, {_t: i18n.t} );
                    return render( template, data );
                };
                // Replace ItemView's attachElContent to run i18n after attaching
                Marionette.ItemView.prototype.attachElContent = function ( html ) {
                    this.$el.html( html );
                    this.$el.i18n();
                    return this;
                };
                // Replace CollectionView's attachElContent to run i18n after attaching
                Marionette.CollectionView.prototype.attachElContent = function ( html ) {
                    this.$el.html( html );
                    this.$el.i18n();
                    return this;
                };

                // Run i18n on what's already there
                $( document ).i18n();
                callback();
            } );
        }

    ], function( error ) {
        if ( error ) {
            //TODO: Startup errors
            alert(error);
            console.error(error);
        } else {
            window.sessions = this.sessions = new Sessions();

            // Create the default session
            this.defaultSession = new Session();
            window.scenic = this.defaultSession.scenic;

            this.sessions.add( this.defaultSession ); // Default session

            this.applicationView = new ApplicationView({sessions: this.sessions});
            this.applicationView.render();
        }
    });





} );
