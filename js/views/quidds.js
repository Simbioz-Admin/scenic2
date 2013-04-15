define([
	'underscore',
	'backbone',
	'views/quidd',
	'text!/templates/quidd.html',
	'text!/templates/setMethod2.html'
	],function(_, Backbone, ViewQuidd, quiddTemplate, setMethodTemplate){

		var QuiddView = Backbone.View.extend({
			el : 'body',
			events : {
				"click .createSource li" : "openPanelCreate",
				'click .submit-quidd.create' : 'create',
				//'click .submit-quidd.save' : 'edit',
				'click .delete-quidd' : 'delete'
				//'click .edit' : 'openPanelEdit'
			},
			initialize : function()
			{
				console.log("init QuiddsView");
				this.collection.each(function(model)
				{
					var view = new ViewQuidd({model : model});
				});

				this.collection.bind("add", function(model){
					var view = new ViewQuidd({model : model});
				});

			},
			//open the lightbox and show the properties to define for create the quidd Source
			openPanelCreate : function()
			{

				var className = $(event.target).data("name")
				,	that = this;
				console.log(className);

				collections.classesDoc.getPropertiesWithout(className, ["shmdata-readers", "shmdata-writers"], function(properties)
				{
					var template = _.template(quiddTemplate, {title : "Create "+className, quiddName : className,  properties : properties, action : "create"});
					$("#panelRight .content").html(template);
					views.global.openPanel();
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

				views.global.closePanel();
				return false;
			},
			//TODO : FIND WAY TO PUT EDIT IN QUIDD.JS
			edit : function()
			{
				var	quiddName = $("#quiddName").val();
				this.updateProperties(quiddName);
				views.global.closePanel();
				return false;
			},
			delete : function(){
				var quiddName = $("#quiddName").val();
				this.collection.delete(quiddName);
				views.global.closePanel();
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
			
		});

		return QuiddView;
	})