define([
	'underscore',
	'backbone',
	'text!/templates/source.html',
	],function(_, Backbone, TemplateSource){

		var ViewSource = Backbone.View.extend({
			tagName : 'table',
			className : 'source',
			table : null,
			events : {
				"click .edit" : "edit",
				"click .remove" : "removeClick",
				"click .preview" : "preview"
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


					//get info about vumeter for know if we can create a preview
					setTimeout(function(){
						collections.quidds.getPropertyValue("vumeter_"+shmdata.path, "caps", function(info)
						{
							info = info.split(",");
							if(info[0] == "audio/x-raw-float" || info[0] == "video/x-raw-yuv") 
								$("[data-path='"+shmdata.path+"'] .nameInOut .short").append("<div class='preview'></div>");
						});
					}, 500);


				});

				$("#"+that.table+" .sources").prepend($(that.el));
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
			}
		});

		return ViewSource;
	})