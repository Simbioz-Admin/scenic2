require( {
    packages: [
        {
            name:     'crypto-js',
            location: '../bower_components/crypto-js/',
            main:     'index'
        }
    ],
    paths:    {
        text:         '../bower_components/requirejs-text/text',
        socketio:     '/socket.io/socket.io', // Served by the socket.io server, needs a build path to be set to 'empty:' in the build configuration
        underscore:   '../bower_components/underscore/underscore',
        backbone:     '../bower_components/backbone/backbone',
        mutators:     '../bower_components/backbone.mutators/backbone.mutators.min',
        async:     '../bower_components/async/lib/async',
        jquery:       '../bower_components/jquery/dist/jquery.min',
        jqueryui:     '../bower_components/jquery-ui/jquery-ui.min',
        punch:        '../bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.min',
        spin:         '../bower_components/spin.js/spin',
        i18n:         '../bower_components/i18next/i18next.min'
    },
    shim:     {
        underscore:   {
            exports: '_'
        },
        backbone:     {
            deps:    ["underscore", "jquery"],
            exports: "Backbone"
        },
        jqueryui:     {
            deps:    ["jquery"],
            exports: "jqueryui"
        },
        punch:        {
            deps: ['jquery', 'jqueryui']
        },
        i18n:         {
            deps:    ['jquery'],
            exports: 'i18n'
        }
    },
    deps: [
        'punch'
    ]
}, [
    // Load our app module and pass it to our definition function
    'app',
    'lib/util',
    'lib/socket',
    collections = [],
    views = {},
    config = {}
], function ( app, util, socket ) {

    //Announce ourselves and recover config information from the server
    socket.emit( "getConfig", localStorage.getItem("socketId"), socket.id, function ( configServer ) {
        config = configServer;
        localStorage.setItem('socketId', socket.id);
        app.initialize( config );
    } );

    // When the server is closed or crashes shutdown the app
    //TODO: Actually close the app
    socket.on( "shutdown", function () {
        console.log( "SHUTDOWN" );
        $( "body" ).html( "<div id='shutdown'>the server has turned off</div>" );
    } );
} );
