define([
	'underscore',
	'backbone',
	'models/quidd'
	],function(_, Backbone, QuiddModel){

		var QuiddsCollection = Backbone.Collection.extend({
			model : QuiddModel,
			url : '/quidds/',
			parse : function(results, xhr){
		        return results.quiddities;
		    },
		    initialize : function(){
		    	console.log("init collection quidds");
		    	this.fetch();
		    },
		    create : function(className, name){
		    	console.log("ask for create "+className+" name "+name);
		    	socket.emit("create", className, "audioTest", function(name){
		    		console.log("the Quidd "+name+" is created.");
		    	})
		    }
		});

		return QuiddsCollection;
	})