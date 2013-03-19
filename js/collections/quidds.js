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
		    	that = this;

		    	//receive notification for add quidd to the collection Quidds
		    	socket.on("create", function(quidd){
		    		that.add(quidd);
		    		//request for recover the properties of quidd
		    	});

		    	//receive notification for set property of quidd
		    	socket.on("setPropertyValue", function(nameQuidd, property, value){
		    		var quidd = that.get(nameQuidd);
		    		//quidd.get("properties")

		    		_.each(quidd.get("properties"), function(prop, index){
		    			if(prop.name == property) quidd.get("properties")[index]["value"] = value;		
		    		})
		    	});

		    },
		    create : function(className, name, callback){

		    	//ask for create a Quidd
		    	console.log("ask for create "+className+" name :"+name);
		    	socket.emit("create", className, name, function(name){
		    		console.log("the Quidd "+name+" is created.");
		    		callback(name);
		    	});
		    	

		    },
		    setPropertyValue : function(nameQuidd, property, value){
		    	that = this;
		    	console.log("ask for set "+property+" of "+nameQuidd+" to "+value);
		    	socket.emit("setPropertyValue", nameQuidd, property, value, function(ok){
		    		// console.log(ok);
		    		// if(!ok){
		    		// 	views.menu.alertMsg("error", "error with set property "+property+" to "+value);
		    		// }
		    	});

		    }
		});

		return QuiddsCollection;
	})