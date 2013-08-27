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
		    	var quidds = _.groupBy(collections.classesDoc.getByCategory("source").toJSON(), function(source)
								{ 
									return source.category; 
								});

		    	this.add({
		    		name : "transfer", 
		    		type : "transfer", 
		    		description : "it's the default table for transfert.",
		    		menus : { sources : {type : "quidds" , value : quidds } , destinations : {type : "client", value : null} }
		    	});
   				//this.add({name : "controler", type : "control", description : "it's the default table for controler."});
		    }
		});

		return CollectionTables;
	})