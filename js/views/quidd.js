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
				'click .preview' : 'preview'
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

				this.model.setShmdatas(function(shmdatas)
				{
					_.each(shmdatas, function(shmdata, index){

						var template = _.template(SourceTemplate, 
										{
											shmdata : shmdata, 
											index : index, 
											nbShmdata :  shmdatas.length, 
											sourceName : model.get("name"),
											destinations : collections.destinations.toJSON()
										});

						$(that.el).append(template);
						$("#sources").prepend($(that.el));
					})
				})
	

			},
			remove : function(){
				$(this.el).remove();
			},
			openPanelEdit : function()
			{
					var quiddName = this.model.get("name");
					
					collections.quidds.getProperties(quiddName, function(properties)
					{
						//console.log(properties);
						var template = _.template(quiddTemplate, {title : "Edit "+quiddName, quiddName : quiddName,  properties : properties, action : "save"});
						$("#panelRight .content").html(template);
						views.global.openPanel();
					});
			},
			preview : function(){
				var quidd = this.model.get("name")
				,	path = $(event.target).parent().parent().data("path");
				var type = null;
				console.log(this.model.get("class"));

				if(this.model.get("class") == "videotestsrc" || this.model.get("class") == "gstvideosrc"  || this.model.get("class") ==  "x264enc") type = "videosink";
				if(this.model.get("class") == "audiotestsrc")  type = "pulsesink";

				collections.quidds.create(type, "sink-"+quidd, function(quidd){
					console.log(quidd);
					console.log(quidd.name, "connect", [path]);
					views.methods.setMethod(quidd.name, "connect", [path]);
				});
			}
			
		});

		return QuiddView;
	})