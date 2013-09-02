define([
	'underscore',
	'backbone',
	'views/irc'
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
			initialize : function()
			{
				var view = new ViewIrc({model : this});
			},
			
		});

		return Channel;
	})