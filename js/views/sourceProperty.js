define([
	'underscore',
	'backbone',
	'text!/templates/sourceProperty.html',
	],function(_, Backbone, TemplateSourceProperty){

		var ViewSource = Backbone.View.extend({
			tagName : 'table',
			className : 'source',
			table : null,
			events : {
				"click .edit" : "edit",
				"click .remove" : "removeClick",
				"click .preview" : "preview",
				'click .info' : 'info'
			},
			initialize : function()
			{
				this.model.on('remove', this.removeView, this);
				this.model.on('change', this.render, this);
				this.table = this.options.table;
				this.render();

			},
			render : function()
			{
				$(this.el).html("");
				var that = this
				, 	properties = this.model.get("properties")
				,	destinations = (this.table == "transfer" ? collections.clients.toJSON() : collections.controlProperties.toJSON());

				_.each(properties, function(property, index) {

					var template = _.template(TemplateSourceProperty, { 
							property : property,
							index : index,
							nbProperties : properties.length,
							sourceName : that.model.get("name"),
							destinations : destinations
						});
					
					$(that.el).append($(template));
				});

				//here we define were go the source  vhttpsdpdec
				if(this.model.get("class") == "httpsdpdec")
				{
					$("#"+that.table+" #remote-sources").prepend($(that.el));
				}
				else
				{
					$("#"+that.table+" #local-sources").prepend($(that.el));
				}


			},
			edit : function()
			{
				this.model.edit();
			},
			removeClick : function()
			{
				this.model.delete();
			},
			removeView : function()
			{
				this.remove();
			},
			preview : function(element)
			{
				this.model.preview(element);
			},
			info : function(element)
			{
				this.model.info(element);
			}
		});

		return ViewSource;
	})