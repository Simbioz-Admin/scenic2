define([
	'underscore',
	'backbone',
	'views/table'
	],function(_, Backbone, ViewTable){

		/**
		*
		* Table is for organise in different table the source and destination
		* You can create differente type : 
		* Transfert : it's for send device to user or server
		* Control : it's for control locally properties of devices with midi, osc etc...
		*
		*/

		var Table = Backbone.Model.extend({
			idAttribute: "name",
			defaults : {
				"name" : null,
				"type" : null,
				"description" : null,
				"menus" : { sources : {type : "", name : null, value : null }, destinations :  {type : "", name : null, value : null }}
			},
			initialize : function(){
				console.log("the table", this.get("name"), "are created");
				var viewTable = new ViewTable({model : this});
			}
		});

		return Table;
	})