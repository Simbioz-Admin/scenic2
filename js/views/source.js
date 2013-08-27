define([
	'underscore',
	'backbone',
	'text!/templates/source.html',
	],function(_, Backbone, TemplateSource){

		var ViewSource = Backbone.View.extend({
			tagName : 'table',
			className : 'source',
			table : null,
			events : {},
			initialize : function()
			{
				this.table = this.options.table;
				var that = this
				, 	shmdatas = this.model.get("shmdatas")
				,	destinations = (this.table == "transfer" ? collections.clients.toJSON() : null);

				_.each(shmdatas, function(shmdata, index)
				{
					var template = _.template(TemplateSource, 
									{
										shmdata : shmdata, 
										index : index, 
										nbShmdata :  shmdatas.length, 
										sourceName : that.model.get("name"),
										destinations : destinations
									});
					$(that.el).append($(template));	
				});

				$("#"+that.table+" .sources").prepend($(that.el));
			}
		});

		return ViewSource;
	})