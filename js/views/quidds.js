define([
	'underscore',
	'backbone',
	'models	/quidd',
	'text!/templates/createQuidd.html',
	'text!/templates/quidd.html'
	],function(_, Backbone, QuiddModel, quiddCreateTemplate, quiddTemplate){

		var QuiddView = Backbone.View.extend({
			el : 'body',
			events : {
				"click .createDevice[data-name], .deviceDetected li" : "defineName",
				"click #create" : "create",
				"change input.property, select.property" : "setProperty",
				//'click #methodStart' : 'start',
				//'click .delete-quidd' : 'delete',
				"mouseenter .autoDetect" : "autoDetect",
				//'click .edit' : 'openPanelEdit'
			},
			initialize : function()
			{
				console.log("init QuiddsView");
				//this.displayTitle();

				var that = this;
				// this.collection.bind("add", function(model)
				// {
				// 	var view = new ViewQuidd({model : model, table : "transfert"});
				// 	var view2 = new ViewQuidd({model : model, table : "control"});
					
				// });
				
				// this.collection.bind("remove", function(model)
				// {
				// 	that.displayTitle();
				// });

			},
			//open the lightbox and show the properties to define for create the quidd Source
			defineName : function(element)
			{
				var className = $(element.target).data("name")
				,	deviceDetected = $(element.target).data("deviceDetected")
				,	template = _.template(quiddCreateTemplate, {title : "Define name for "+className, className : className, deviceDetected : deviceDetected });
				$("#panelRight .content").html(template);
				views.global.openPanel();
			},
			create : function(element)
			{
				var className = $("#className").val()
				,	name = $("#quiddName").val()
				,	categoryQuidd = collections.classesDoc.get(className).get("category")
				,	that = this	
				,	deviceDetected = $("#device").val()
				,	category = "encoder";

				//check category of the quidd and get specific encoder
				if(categoryQuidd.indexOf("video") >= 0) category = "video encoder";
				if(categoryQuidd.indexOf("audio") >= 0) category = "audio encoder";
				
				console.log(className, name);
				/**
				*
				* 1 - create the quiddity without name
				* 2 - check if the user select autoDetect (contains value) (if false go point 4)
				* 3 - define the properties device 
				* 4 - get properties / methods of the device
				* 5 - show the panelEdit with form
				*/

				//create first quiddity for get the good properties
				collections.quidds.create(className, name, function(quiddName)
				{
					views.global.notification("info", quiddName+" ("+className+") is created"); //notification
					var model = new QuiddModel({name : quiddName, class : className, encoder_category : category});
					collections.quidds.add(model);
					//check if autoDetect it's true if yes we set the value device with device selected
					
					console.log("device detected : ", deviceDetected);
					if(deviceDetected)
					{
						model.setPropertyValue("device", deviceDetected, function(ok){
							that.getPropertiesAndMethods(model);
						});
					}
					else that.getPropertiesAndMethods(model);
				});
			},
			getPropertiesAndMethods : function(model)
			{
				var that = this;
				model.getProperties(function(properties)
				{
					model.getMethodsDescription(function(methods)
					{
						//retrive list encoder 
						var encoders = collections.classesDoc.getByCategory(model.get("encoder_category")).toJSON();
						that.openPanel(model.get("name"), properties, methods, encoders);
					});
				});
			},
			openPanel : function(quiddName, properties, methods, encoders)
			{
				var template = _.template(quiddTemplate, {title : "Set "+quiddName, quiddName : quiddName,  properties : properties, methods: methods, encoders : encoders});
				$("#panelRight .content").html(template);
				views.global.openPanel();
			},
			setProperty : function(element)
			{
				var model = collections.quidds.get($("#quiddName").val())
				,	property = element.target.name
				,	value = element.target.value;
				
				console.log(property, value);
				if(property == "encoder")
				{
					//add to the list the encoder ask to create with shmdata
					collections.quidds.listEncoder.push({quiddName : quidd.name, encoder : encoder});
				}
				model.setPropertyValue(property, value, function()
				{
				// 	//make confirmation message set attributes ok
				// 	//console.log("the property  :", property, "with value : ", value, "has set!");
				});

			},
			autoDetect : function(element)
			{
				//create temporary v4l2 quiddity for listing device available
				var className = $(element.target).data("name");
				collections.classesDoc.getPropertyByClass(className, "device", function(property)
				{
					var deviceDetected = property["type description"]["values"];
					$("#deviceDetected").remove();
					$("[data-name='"+className+"']").append("<ul id='deviceDetected'></ul>");

					_.each(deviceDetected, function(device)
					{
						var li = $("<li></li>",{ 
							text : device["name"]+" "+device["nick"],
							class : 'source',
							data : { name : className, deviceDetected : device["value"]},
						});
						$("#deviceDetected").append(li);
					});
				});
			}
			
		});

		return QuiddView;
	})