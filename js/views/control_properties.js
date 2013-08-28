define([
	'underscore',
	'backbone'
	],function(_, Backbone){

		var ViewsControlProperties = Backbone.View.extend({
			el : 'body',
			events : {
				//"click #create-quiddsProperties" : "listQuiddsAndProperties"
			},
			initialize : function()
			{
				console.log("init Views ViewsControlProperties");
			},
			listQuiddsAndProperties : function()
			{
				var quidds = collections.quidds.toJSON();
				console.log(quidds);
			}
		});

		return ViewsControlProperties;
	})