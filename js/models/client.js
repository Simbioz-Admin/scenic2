define([
	'underscore',
	'backbone',
	'views/destination'
	],function(_, Backbone, ViewDestination){

		var Client = Backbone.Model.extend({
			idAttribute: "name",
			defaults : {
				"name" : null,
				"host_name" : null,
				"data_streams" : []
			},
			initialize : function(){
				
				//we create automaticlly the view for client based on ViewDestination
				var view = new ViewDestination({model : this, table : "transfer"});
			},
			delete : function()
			{
				var result = confirm("Are you sure?");
				if (result==true)
				{
					socket.emit("invoke","defaultrtp", "remove_destination", [this.get("name")], function(ok){});
				}
			}
		});

		return Client;
	})