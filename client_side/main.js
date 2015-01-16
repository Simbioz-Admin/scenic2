// Filename: main.js

// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
    paths: {
        underscore: 'libs/underscore-min',
        backbone: 'libs/backbone-min',
        util: 'libs/util',
        jquery: 'libs/jquery-min',
        jqueryui: 'libs/jqueryui/js/jquery-ui-1.10.2.custom.min',
        punch: 'libs/punch',
        jqueryCookie: 'libs/jquery.cookie',
        smartMenu: 'libs/smartmenus/jquery.smartmenus.min',
        d3: 'libs/d3.min',
        i18n : '/i18next.min'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        jqueryui: {
            deps: ["jquery"],
            exports: "jqueryui"
        },
        punch: {
            deps: ['jquery', 'jqueryui']
        },
        jqueryCookie: {
            deps: ['jquery'],
            exports: 'jquerycookie'
        },
        smartMenu: {
            deps: ['jquery'],
            exports: 'smartMenu'
        },
        i18n : {
            deps: ['jquery'],
            exports : 'i18n'
        }
    }
});

require([
    // Load our app module and pass it to our definition function
    'app',
    'launch',
    'util',
    'punch',
    'collections/users',
    'jqueryCookie',
    collections = [],
    views = [],
    socket = io.connect(),
    config = {},
], function(app, launch, util, socket, CollectionUsers  ) {

    var socket = io.connect();
    
    //recovery config information from the server
    socket.emit("getConfig", function(configServer) {
        config = configServer;
    });

    collections.users = new CollectionUsers();


    if (localStorage["oldId"]) {
        socket.emit("returnRefresh", localStorage["oldId"], socket.socket.sessionid);
    }


    /* stock information of sessionid in localStorage when user refresh or quit interface. 
       Use for know how close the interface */
    $(window).bind('beforeunload', function() {
        localStorage["oldId"] = socket.socket.sessionid;
    });


    /* When the server is closed or crash a message global is send for all user */
    socket.on("shutdown", function() {
        console.log("SHUTDOWN");
        $("body").html("<div id='shutdown'>the server has turned off</div>");
    });

    //check state of scenic for show page authentification or scenic2
    socket.emit("scenicStart", function(stateScenic) {
        if (!stateScenic) launch.initialize();
        else app.initialize();
    });
});
