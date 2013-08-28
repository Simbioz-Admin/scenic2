define([
	'underscore',
	'backbone',
	'models/table'
	],function(_, Backbone, ModelTable){

		var CollectionTables = Backbone.Collection.extend({
			model : ModelTable,
			parse : function(results, xhr){
		        return results;
		    },
		    initialize : function()
		    {
		    	console.log("init CollectionTable");
		    	//create default tables 
		    	//create the first table for manage transfert

		    	this.add({
		    		name : "transfer", 
		    		type : "transfer", 
		    		description : "it's the default table for transfert.",
		    		menus : { sources : {type : "quidds" ,name : "source" } , destinations : {type : "client", name : "destination"} }
		    	});
   				this.add({
   					name : "controler", 
   					type : "control", 
   					description : "it's the default table for controler.",
   					menus : { sources : {type : "midi", name : "control"}, destinations : {type : "quiddsProperties", name : "property"}}
   				});
		    }
		});

		return CollectionTables;
	})