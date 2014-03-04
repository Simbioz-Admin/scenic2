// Filename: main.js

// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
  paths: {
    underscore: 'libs/underscore-min',
    backbone: 'libs/backbone-min',
    util: 'libs/util',
    jqueryui: 'libs/jqueryui/js/jquery-ui-1.10.2.custom.min',
    punch : 'libs/punch',
    jqueryCookie:'libs/jquery.cookie',
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
      deps : ['jquery'],
      exports: 'jquerycookie'
    }
  }
});

require([
  // Load our app module and pass it to our definition function
  'app',
  'launch',
  'util',
  'punch',
  'jqueryCookie',
  collections = [],
  views = [],
  socket = io.connect(),
  config = {}
], function(app, launch, util, socket) {

  var socket = io.connect();
  
  //recovery config information from the server
  socket.emit("getConfig", function(configServer) {
    config = configServer;
  });


  if(localStorage["oldId"]){
    socket.emit("returnRefresh", localStorage["oldId"], socket.socket.sessionid);
  }

  $(window).bind('beforeunload',function(){
      localStorage["oldId"] = socket.socket.sessionid;
  });


  socket.on("shutdown", function() {
    $("body").html("<div id='shutdown'>the server has been shutdown...</div>");
  });

  //check state of scenic for show page authentification or scenic2
  socket.emit("scenicStart", function(stateScenic) {
    if (!stateScenic) launch.initialize();
    else app.initialize();
  });



  //if(page == "app") App.initialize();

});