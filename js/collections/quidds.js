define([
	'underscore',
	'backbone',
	'models/quidd'
	],function(_, Backbone, QuiddModel){

		var QuiddsCollection = Backbone.Collection.extend({
			model : QuiddModel,
			url : '/quidds/',
			parse : function(results, xhr){
		        return results;
		    },
		    initialize : function(){
		    	console.log("init collection quidds");
		    	this.fetch();
		    },
		    create : function(className, name, callback){
		    	console.log("ask for create "+className+" name :"+name);
		    	socket.emit("create", className, name, function(name){
		    		console.log("the Quidd "+name+" is created.");
		    		callback(name);
		    	});
		    },
		    setPropertyValue : function(nameQuidd, property, value){
		    	console.log("ask for set "+property+" of "+nameQuidd+" to "+value);
		    	socket.emit("setPropertyValue", nameQuidd, property, value, function(ok){
		    		// console.log(ok);
		    		// if(!ok){
		    		// 	views.menu.alertMsg("error", "error with set property "+property+" to "+value);
		    		// }
		    	})
		    }
		});

		return QuiddsCollection;
	})