define([
	'underscore',
	'backbone',
	'views/quidd',
	'models	/quidd',
	'text!/templates/quidd.html',
	'text!/templates/setMethod2.html'
	],function(_, Backbone, ViewQuidd, QuiddModel, quiddTemplate, setMethodTemplate){

		var QuiddView = Backbone.View.extend({
			el : 'body',
			events : {
				"click .createSource li" : "openPanelCreate",
				'click .submit-quidd.create' : 'create',
				'click .submit-quidd.save' : 'edit',
				'click .delete-quidd' : 'delete'
				//'click .edit' : 'openPanelEdit'
			},
			initialize : function()
			{
				console.log("init QuiddsView");
				this.displayTitle();

				var that = this;
				this.collection.bind("add", function(model){
					var view = new ViewQuidd({model : model});
					that.displayTitle();

				});
				this.collection.bind("remove", function(model)
				{
					that.displayTitle();
				})

			},
			//open the lightbox and show the properties to define for create the quidd Source
			openPanelCreate : function()
			{

				var className = $(event.target).data("name")
				,	categoryQuidd = collections.classesDoc.get(className).get("category")
				,	that = this
				,	category = "encoder";

				//check category of the quidd and get specific encoder
				if(categoryQuidd.indexOf("video") >= 0) category = "video encoder";
				if(categoryQuidd.indexOf("audio") >= 0) category = "audio encoder";
				var encoders = collections.classesDoc.getByCategory(category).toJSON();

				
				collections.classesDoc.getPropertiesWithout(className, ["shmdata-readers", "shmdata-writers"], function(properties)
				{
					
					var template = _.template(quiddTemplate, {title : "Create "+className, quiddName : className,  properties : properties, action : "create", encoders : encoders});
					$("#panelRight .content").html(template);
					views.global.openPanel();
				});
				
				views.methods.getMethodsByClassWithFilter(className, ["add_shmdata_path", "to_shmdata"], function(methods)
				{
					var template = _.template(setMethodTemplate, {methods : methods});
					$("#panelRight .content ul").after(template);
				});

			},
			create : function()
			{
				var that = this
				,	quiddName = $("#quiddName").val()
				,	className = $("#form-quidd").data("classname")
				,	encoder = $("#form-quidd [name='encoder']").val();


				//creation of Quidd and set properties
				collections.quidds.create(className, quiddName, function(quidd)
				{
					that.updateProperties(quidd.name);
					that.setMethods(quidd.name);
					var shmdata = quidd.shmdatas["shmdata_writers"][0]["path"];

					if(encoder != "none")
					{
		    			collections.quidds.create(encoder,quidd.name+"_enc", function(quidd)
		    			{
		    				views.methods.setMethod(quidd.name, "connect", [shmdata]);
		    			});
					}
				});

				views.global.closePanel();
				return false;
			},
			//TODO : FIND WAY TO PUT EDIT IN QUIDD.JS
			edit : function()
			{
				var	quiddName = $("#quiddName").val();
				this.updateProperties(quiddName);
				//views.global.closePanel();
				return false;
			},
			delete : function()
			{
				var quiddName = $("#quiddName").val();
				this.collection.delete(quiddName);
				views.global.closePanel();
			},
			updateProperties: function(quiddName)
			{
				var dataFormProp =  $('#form-quidd ').serializeObject();
				//parse properties for set value of this
				_.each(dataFormProp, function(value, index)
				{
					var defaultValue = 	$('[name="'+index+'"]').data("default")
					,	minValue = $('[name="'+index+'"]').data("min")
					,	maxValue = $('[name="'+index+'"]').data("max");

					if(value != defaultValue)
					{
						collections.quidds.setPropertyValue(quiddName, index, value);
					}
				});
			},
			setMethods : function(quiddName)
			{

				//recover on format json the value of field for methods
				var dataFormMeth = {};
				$("#form-methods input").each(function(index, value)
				{
					if($(this).attr("name"))
					{
						dataFormMeth[$(this).attr("name")] = $(this).val();
					}
				});

				_.each(dataFormMeth, function(value, index)
				{
					if(value != "")
					{
						views.methods.setMethod(quiddName, index, [value]);
					}
				});
			},
			displayTitle : function()
			{
				console.log("check title In", this.collection.size());
				//check number of quidd for titleIn
				if(this.collection.size() != 0) $("#titleIn").show();
				else $("#titleIn").hide();
			}
			
		});

		return QuiddView;
	})