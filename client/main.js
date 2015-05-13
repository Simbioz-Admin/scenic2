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
        socketio:     '/socket.io/socket.io',
        underscore:   '../bower_components/underscore/underscore',
        backbone:     '../bower_components/backbone/backbone',
        mutators:     '../bower_components/backbone.mutators/backbone.mutators.min',
        jquery:       '../bower_components/jquery/dist/jquery.min',
        jqueryCookie: '../bower_components/jquery.cookie/jquery.cookie',
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
        jqueryCookie: {
            deps:    ['jquery'],
            exports: 'jquerycookie'
        },
        i18n:         {
            deps:    ['jquery'],
            exports: 'i18n'
        }
    }
}, [
    // Load our app module and pass it to our definition function
    'app',
    'lib/util',
    'punch',
    'collections/users',
    'lib/socket',
    'jqueryCookie',
    collections = [],
    views = {},
    config = {}
], function ( app, util, punch, CollectionUsers, socket ) {

    //Announce ourself and ecover config information from the server
    socket.emit( "getConfig", localStorage["socketId"], socket.id, function ( configServer ) {
        config = configServer;
        localStorage['socketId'] = socket.id;
    } );

    collections.users = new CollectionUsers();

    // When the server is closed or crashes shutdown the app
    //TODO: Actually close the app
    socket.on( "shutdown", function () {
        console.log( "SHUTDOWN" );
        $( "body" ).html( "<div id='shutdown'>the server has turned off</div>" );
    } );

    app.initialize();
} );
