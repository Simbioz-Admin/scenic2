define([
	'underscore',
	'backbone',
	'models/quidd',
	'text!/templates/source.html',
	'text!/templates/quidd.html',
	],function(_, Backbone, ModelQuidd, SourceTemplate, quiddTemplate){

		var QuiddView = Backbone.View.extend({
			tagName : 'table',
			className : "source",
			template : SourceTemplate,
			events : {
				'click .edit' : 'openPanelEdit',
			},
			initialize : function()
			{
				this.render();
				this.model.on('remove', this.remove, this);
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

			},
			remove : function(){
				console.log(this.model.get("name"));
				console.log("REMOVE");
				$(this.el).remove();
			},
			openPanelEdit : function()
			{

					var quiddName = this.model.get("name");
					console.log(quiddName);
					collections.quidds.getProperties(quiddName, function(properties)
					{
						console.log(properties);
						var template = _.template(quiddTemplate, {title : "Edit "+quiddName, quiddName : quiddName,  properties : properties, action : "save"});
						$("#panelRight .content").html(template);
						views.global.openPanel();
					});
					this.statePanel = "open";

				//var template = _.template(quiddTemplate, {title : "Edit "+className, className : className,  properties : properties, action : "save"});
			},
			
		});

		return QuiddView;
	})