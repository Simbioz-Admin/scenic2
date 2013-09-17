define([
	'underscore',
	'backbone',
	'models/table'
	],function(_, Backbone, TableModel){

		var TablesCollection = Backbone.Collection.extend({
			model : TableModel,
			parse : function(results, xhr){
		        return results;
		    },
		    initialize : function()
		    {
		    	//create default tables 
		    	this.add({name : "transfer", type : "transfert", description : "it's the default table for transfert."});
   				this.add({name : "controler", type : "control", description : "it's the default table for controler."});
		    }
		});

		return TablesCollection;
	})