define([
	'underscore',
	'backbone',
	'models/quidd',
	'text!/templates/source.html',
	'text!/templates/quidd.html',
	'text!/templates/panelInfo.html'
	],function(_, Backbone, ModelQuidd, SourceTemplate, quiddTemplate, infoTemplate){

		var QuiddView = Backbone.View.extend({
			tagName : 'table',
			className : "source",
			template : SourceTemplate,
			events : {
				'click .edit' : 'openPanelEdit',
				'click .preview' : 'preview',
				'click .info' : 'info'
			},
			initialize : function()
			{
				this.render();
				this.model.on('remove', this.remove, this);
				this.model.on('change', this.render, this);

			},
			render : function()
			{

				views.quidds.displayTitle();

				var model = this.model
				, 	that = this
				,	shmdatas = this.model.get("shmdatas");

				$(that.el).html("");

				_.each(shmdatas, function(shmdata, index)
				{
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
				,	path = $(event.target).closest('tr').data("path")
				,	type = null;
				
				collections.quidds.getPropertyValue("vumeter_"+path, "caps", function(info)
				{
					info = info.split(",");
					if(info[0].indexOf("video") >= 0) type = "videosink";
					if(info[0].indexOf("audio") >= 0) type = "pulsesink";

					collections.quidds.create(type, "sink-"+quidd, function(quidd){
						views.methods.setMethod(quidd.name, "connect", [path]);
					});
				});
			},
			info : function(event)
			{
				var shmdata = $(event.target).closest('tr').data("path");
				var that = this;
				collections.quidds.getPropertyValue("vumeter_"+shmdata, "caps", function(val)
				{
					val = val.replace(/,/g,"<br>");
					var template = _.template(infoTemplate, { info : val, shmdata : shmdata });
					$("#info").remove();
					$("body").prepend(template);
					$("#info").css({top : event.pageY, left : event.pageX}).show();
					$(".panelInfo").draggable({ cursor: "move", handle: "#title"});
				});
			}
			
		});

		return QuiddView;
	})