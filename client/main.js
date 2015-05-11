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
        underscore:   '../bower_components/underscore/underscore-min',
        backbone:     '../bower_components/backbone/backbone',
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
    'views/launch',
    'jqueryCookie',
    collections = [],
    views = {},
    config = {}
], function ( app, util, punch, CollectionUsers, socket, LaunchView ) {

    //recovery config information from the server
    socket.emit( "getConfig", function ( configServer ) {
        config = configServer;
    } );

    collections.users = new CollectionUsers();


    if ( localStorage["oldId"] ) {
        socket.emit( "returnRefresh", localStorage["oldId"], socket.id );
    }


    /* stock information of sessionid in localStorage when user refresh or quit interface. 
     Use for know how close the interface */
    $( window ).bind( 'beforeunload', function () {
        localStorage["oldId"] = socket.id;
    } );


    /* When the server is closed or crash a message global is send for all user */
    socket.on( "shutdown", function () {
        console.log( "SHUTDOWN" );
        $( "body" ).html( "<div id='shutdown'>the server has turned off</div>" );
    } );

    //check state of scenic for show page authentification or scenic2
    socket.emit( "scenicStart", function ( stateScenic ) {
        if ( !stateScenic ) {
            views.launch = new LaunchView();
        } else {
            app.initialize();
        }
    } );
} );
