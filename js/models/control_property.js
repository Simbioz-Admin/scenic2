define([
	'underscore',
	'backbone',
	'views/destination'
	],function(_, Backbone, ViewDestination){

		var ModelControlProperty = Backbone.Model.extend({
			idAttribute: "name",
			defaults : {
				"name" : null,
				"property" : null,
				"quiddName" : null
			},
			initialize : function(){
				console.log("the control property", this.get("name"), "is created");
				var that = this;
				//when the model quidd is created and we are recovered all value necessary, we created automaticlly one or multiple views 
	    		_.each(collections.tables.toJSON(), function(table)
	    		{
	    			if(table.type == "control")
				    {
						var viewDestination = new ViewDestination({ model : that, table : "control" });
					}
	    		});

			},
			delete : function()
			{
				console.log("DELETE PROP");
				socket.emit("removeValuePropertyOfDico", "controlProperties", this.get("name"));
			}
		});

		return ModelControlProperty;
	})