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
				, 	that = this
				, propertiesShmdata = this.model.get("shmdatas");
	
				_.each(propertiesShmdata, function(shmdata, index){

					var template = _.template(SourceTemplate, 
									{
										shmdata : shmdata, 
										index : index, 
										nbShmdata :  propertiesShmdata.length, 
										sourceName : model.get("name"),
										destinations : collections.destinations.toJSON()
									});

					$(that.el).append(template);
					$("#sources").prepend($(that.el));
				})

			},
			remove : function(){
				console.log(this.model.get("name"));
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
			},
			
		});

		return QuiddView;
	})