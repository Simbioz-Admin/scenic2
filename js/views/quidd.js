define([
	'underscore',
	'backbone',
	'models/quidd',
	'text!/templates/source.html'
	],function(_, Backbone, ModelQuidd, SourceTemplate){

		var QuiddView = Backbone.View.extend({
			tagName : 'table',
			className : "source",
			template : SourceTemplate,
			events : {
				"click .vertical" : "test",
			},
			initialize : function()
			{
				this.render();
			},
			render : function()
			{

				var model = this.model
				, 	that = this;
				//control if the quidd have property shmdata-writers and if have paths	
				var propertiesShmdata = model.get("properties").filter(function(property)
				{

					if(property.name == "shmdata-writers" && property.value.shmdata_writers.length > 0)
					{
						_.each(property.value.shmdata_writers, function(shmdata, index)
						{
							var template = _.template(SourceTemplate, 
								{
									shmdata : shmdata, 
									index : index, nbShmdata : 
									property.value.shmdata_writers.length, 
									sourceName : model.get("name"),
									destinations : collections.destinations.toJSON()
								});

							$(that.el).append(template);
							$("#sources").prepend($(that.el));

						});

						

						//var template = _.template(this.template, {shmdatas : property.value.shmdata_writers})
						return property;
					} 
				});

				// if(propertiesShmdata.length > 0)
				// {
				// 	//console.log(propertiesShmdata[0].value.shmdata_writers);
				// 	//render quidd and shmatas in table
				// 	var template = _.template(this.template, {name : this.model.get("name"), shmdatas : propertiesShmdata[0].value.shmdata_writers});
				// 	var html = this.$el.html(template);
				// 	console.log(this.$el.html(template));
				// 	$("#sources").append(html);
				// }
			},
			test : function(e){
				e.preventDefault();
				console.log(this);
			}
			//open the lightbox and show the properties to define for create the quidd Source
			
		});

		return QuiddView;
	})