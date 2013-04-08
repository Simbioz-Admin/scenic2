define([
	'underscore',
	'backbone',
	'models/quidd',
	'text!/templates/quidd.html',
	'text!/templates/setMethod2.html'
	],function(_, Backbone, ModelQuidd, quiddTemplate, setMethodTemplate){

		var QuiddView = Backbone.View.extend({
			el : 'body',
			events : {
				"click .dropdown-menu li" : "openPanelCreate",
				'click .submit-quidd.create' : 'create',
				'click .submit-quidd.save' : 'edit',
				'click .edit' : 'openPanelEdit'
			},
			initialize : function()
			{
				console.log("init QuiddsView");
				collections.quidds.each(function(model)
				{
					var view = new ModelQuidd({model : model});
					console.log(model);
				});
			},
			//open the lightbox and show the properties to define for create the quidd Source
			openPanelCreate : function()
			{

				var className = $(event.target).data("name")
				,	that = this;


				this.collection.getPropertiesWithout(className, ["shmdata-readers", "shmdata-writers"], function(properties)
				{
					var template = _.template(quiddTemplate, {title : "Create "+className, quiddName : className,  properties : properties, action : "create"});
					$("#lightBox").html(template);
					views.global.openLightBox();
				});
				
				views.methods.getMethodsByClassWithFilter(className, ["add_shmdata_path", "to_shmdata"], function(methods)
				{
					var template = _.template(setMethodTemplate, {methods : methods});
					$("#lightBox ul").after(template);
				});

			},
			create : function()
			{
				var that = this
				,	quiddName = $("#quiddName").val()
				,	className = $("#form-lightbox").data("classname");

				//creation of Quidd and set properties
				collections.quidds.create(className, quiddName, function(quiddName)
				{
					
					that.updateProperties(quiddName);
					that.setMethods(quiddName);

				});

				views.global.closeLightBox();
				return false;
			},
			edit : function()
			{
				var	quiddName = $("#quiddName").val();
				this.updateProperties(quiddName);
				views.global.closeLightBox();
				return false;
			},
			updateProperties: function(quiddName)
			{

				// recover on format json the value of field for properties
				var dataFormProp = {};

				$("#form-quidd .property").each(function(index, value)
				{

					if($(this).attr("name"))
					{
						dataFormProp[$(this).attr("name")] = $(this).val();
					}
				});

				//parse properties for set value of this
				_.each(dataFormProp, function(value, index)
				{
					var defaultValue = 	$('[name="'+index+'"]').data("default")
					,	minValue = $('[name="'+index+'"]').data("min")
					,	maxValue = $('[name="'+index+'"]').data("max");
					if(value != defaultValue)
					{
						console.log(value, defaultValue);
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
						console.log($(this).attr("name"));
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
			openPanelEdit : function()
			{
				var quiddName = $(event.target).parent().parent().data("quidd");
				collections.quidds.getProperties(quiddName, function(properties)
				{
					console.log(properties);
					var template = _.template(quiddTemplate, {title : "Edit "+quiddName, quiddName : quiddName,  properties : properties, action : "save"});
					$("#lightBox").html(template);
					views.global.openLightBox();
				});
				//var template = _.template(quiddTemplate, {title : "Edit "+className, className : className,  properties : properties, action : "save"});
			},
		});

		return QuiddView;
	})