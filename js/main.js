// Filename: main.js

// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
	paths: {
    	underscore: 'libs/underscore-min', 
    	backbone: 'libs/backbone-min',
    	tempi: 'libs/fn.tempi-snake'
  	},
	shim: {
		underscore:{
			exports : '_'
		},
		backbone: {
			deps : ["underscore", "jquery"],
			exports : "Backbone"
		}
	}
});

require([
  // Load our app module and pass it to our definition function
  'app'
], function(App){
  	App.initialize();
});

