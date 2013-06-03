// Filename: main.js

// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
	paths: {
    	underscore: 'libs/underscore-min', 
    	backbone: 'libs/backbone-min',
    	tempi: 'libs/fn.tempi-snake',
    	util: 'libs/util',
      jqueryui: 'libs/jqueryui/js/jquery-ui-1.10.2.custom.min'
  	},
	shim: {
		underscore:{
			exports : '_'
		},
		backbone: {
			deps : ["underscore", "jquery"],
			exports : "Backbone"
		},
    jqueryui: {
      deps : ["jquery"],
      exports : "jqueryui"
    }
	}
});

require([
  // Load our app module and pass it to our definition function
  'app',
  'util',
  'panel',
  collections = [],
  views = [],
  socket = io.connect(),
  config = {}
], function(App, util, panel, socket)
{

  if(page == "app") App.initialize();
  if(page == "panel") panel.initialize();
});

