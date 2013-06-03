define([
	'underscore',
	'backbone',
	'views/irc2'
	],function(_, Backbone, ViewIrc){

		var Channel = Backbone.Model.extend({
			idAttribute: "channel",

			defaults : {
				"channel" : null,
				"username" : "default",
				"users" : [],
				"msgNotView" : 0,
				"active" : false,
			},
			initialize : function(){
				
				console.log("new channel ", this.get("channel"));
				var view = new ViewIrc({model : this});

			},
			
		});

		return Channel;
	})