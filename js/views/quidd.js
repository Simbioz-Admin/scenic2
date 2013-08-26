define([
	'underscore',
	'backbone',
	'models/quidd',
	'text!/templates/source.html',
	'text!/templates/quidd.html',
	'text!/templates/panelInfoSource.html'
	],function(_, Backbone, ModelQuidd, SourceTemplate, quiddTemplate, infoTemplate){

		var QuiddView = Backbone.View.extend({
			tagName : 'table',
			className : "source",
			template : SourceTemplate,
			events : {
				'click .edit' : 'openPanel',
				'click .preview' : 'preview',
				'click .info' : 'info'
			},
			initialize : function()
			{
				console.log("init view quidd");
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

					// $(template).find(".status").before('<div class="preview"></div> ');

					$(that.el).append($(template));
					$("#sources").prepend($(that.el));

					setTimeout(function()
					{
						//add btn preview only for video and audio
						collections.quidds.getPropertyValue("vumeter_"+shmdata.path, "caps", function(info)
						{
							console.log(info);
							info = info.split(",");
							if(info[0] == "audio/x-raw-float" || info[0] == "video/x-raw-yuv") 
								$("[data-path='"+shmdata.path+"'] .nameInOut .short").append("<div class='preview'></div>");
						});
					},500);

				});
			},
			remove : function(){
				$(this.el).remove();
			},
			openPanel : function()
			{
					var quiddName = this.model.get("name")
					,	encoders = collections.classesDoc.getByCategory(this.model.get("encoder_category")).toJSON();
					views.quidds.openPanel(this.model.get("name"), this.model.get("properties"), this.model.get("methods"), encoders);
			},
			preview : function(event){

				var quidd = this.model.get("name")
				,	path = $(event.target).closest('tr').data("path")
				,	type = null;
				
				collections.quidds.getPropertyValue("vumeter_"+path, "caps", function(info)
				{

					info = info.split(",");

					if(info[0].indexOf("video") >= 0) type = "gtkvideosink";
					if(info[0].indexOf("audio") >= 0) type = "jacksink";

					if(type != null)
					{
						collections.quidds.create(type, "sink-"+quidd, function(quidd){
							console.log(quidd, "connect", [path]);
							views.methods.setMethod(quidd, "connect", [path]);
						});
					}
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