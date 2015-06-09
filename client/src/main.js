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
    'underscore',
    'app',
    'lib/util',
    'lib/socket'
], function ( _, application, util, socket ) {

    // For debug purposes put app in window
    window.app = application;

    // Global message bus
    var scenicChannel = Backbone.Wreqr.radio.channel( 'scenic' );

    // Announce ourselves and recover config information from the server
    var lang = localStorage.getItem( 'lang' ) ? localStorage.getItem( 'lang' ) : 'en';
    socket.emit( 'connect', lang, localStorage.getItem( 'socketId' ), function ( config ) {
        localStorage.setItem( 'socketId', socket.id );
        application.initialize( lang, config );
    } );

    // When the server is closed or crashes shutdown the app
    socket.on( 'shutdown', _.bind( application.shutdown, application ) );
    socket.on( 'disconnect', _.bind( application.shutdown, application ) );
} );
