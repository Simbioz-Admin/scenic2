define([
	'underscore',
	'backbone',
	'views/quidd',
	'models	/quidd',
	'text!/templates/createQuidd.html',
	'text!/templates/quidd.html',
	'text!/templates/setMethod2.html'
	],function(_, Backbone, ViewQuidd, QuiddModel, quiddCreateTemplate, quiddTemplate, setMethodTemplate){

		var QuiddView = Backbone.View.extend({
			el : 'body',
			events : {
				"click .source[data-name], .deviceDetected li" : "defineName",
				"click #defineName" : "create",
				'click #methodStart' : 'start',
				'click .delete-quidd' : 'delete',
				"mouseenter .autoDetect" : "autoDetect",
				"change input.property, select.property" : "setProperty",
				//'click .edit' : 'openPanelEdit'
			},
			initialize : function()
			{
				console.log("init QuiddsView");
				//this.displayTitle();

				var that = this;
				this.collection.bind("add", function(model)
				{
					var view = new ViewQuidd({model : model});
				});
				
				this.collection.bind("remove", function(model)
				{
					that.displayTitle();
				})

			},
			setProperty : function(event)
			{
				var model = collections.quidds.get($("#quiddName").val())
				,	property = event.target.name
				,	value = event.target.value;
				model.setPropertyValue(property, value, function()
				{
					//make confirmation message set attributes ok
				});

			},
			//open the lightbox and show the properties to define for create the quidd Source
			
			defineName : function(event)
			{
				var className = $(event.target).data("name");
				var template = _.template(quiddCreateTemplate, {title : "Define name for "+className, className : className });
				$("#panelRight .content").html(template);
				views.global.openPanel();
			},
			create : function(event)
			{
				var className = $("#className").val()
				,	name = $("#quiddName").val()
				,	categoryQuidd = collections.classesDoc.get(className).get("category")
				,	that = this
				,	category = "encoder"
				,	deviceDetected = $(event.target).data("deviceDetected");

				//check category of the quidd and get specific encoder
				if(categoryQuidd.indexOf("video") >= 0) category = "video encoder";
				if(categoryQuidd.indexOf("audio") >= 0) category = "audio encoder";
				
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
					var model = new QuiddModel({name : quiddName, class : className, encoder_category : category});
					collections.quidds.add(model);
					//check if autoDetect it's true if yes we set the value device with device selected
					if(deviceDetected)
					{
						model.setPropertyValue("device", deviceDetected, function(ok){
							that.getPropertiesAndMethods(model);
						});
					}
					else that.getPropertiesAndMethods(model);
					
				});

				// //get methods for set in panelRight
				// views.methods.getMethodsByClassForConfiguration(className, function(methods)
				// {
				// 	//data-info is added with autodetection v4l2src
				// 	var infoJsonDevices = $(event.target).data("info");
				// 	var template = _.template(setMethodTemplate, {className : className, methods : methods, jsonDevices : infoJsonDevices});
				// 	$("#panelRight .content ul").after(template);
				// });


			},
			getPropertiesAndMethods : function(model)
			{
				var that = this;
				console.log("getProperties")
				model.getProperties(function(properties)
				{
					console.log("properties", properties)
					model.getMethodsDescription(function(methods)
					{
						console.log("methods", methods);
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
			start : function()
			{
				var that = this; 
				var model = collections.quidds.get($("#quiddName").val());
				model.setMethod("start", [true], function(){
					//the method has set correctly now we refresh properties in panel
					that.getPropertiesAndMethods(model);
				});
			},
			save : function()
			{

				var quiddName = $("#quiddName").val();
				var model = collections.quidds.get(quiddName);
				model.setProperty();
				/*
				* 1 - recovery value of properties and methods
				* 2 - Set properties and methods
				* 3 - check if methods start exist (si false go point 5)
				* 5 - set 
				*/

			},
			create2 : function()
			{
				var that = this
				,	quiddName = $("#quiddName").val()
				,	className = $("#form-quidd").data("classname")
				,	encoder = $("#form-quidd [name='encoder']").val();

				//creation of Quidd and set properties
				console.log(className, quiddName);
				collections.quidds.create(className, quiddName, function(quidd)
				{
					// that.updateProperties(quidd.name);
					// that.setMethods(className, quidd.name);
					console.log(quidd);
					// if(encoder != "none")
					// {
					// 	//add to the list the encoder ask to create with shmdata
					// 	collections.quidds.listEncoder.push({quiddName : quidd.name, encoder : encoder});
					// }
				});

				//views.global.closePanel();
				return false;
			},
			delete : function(event)
			{
				// var quiddName = $("#quiddName").val();
				var quiddName = $(event.currentTarget).closest("tr").data("quiddname");
				var result = confirm("Are you sure?");
				if (result==true)
				{
					this.collection.delete(quiddName);
					views.global.closePanel();
					
				}
			},
			setMethods : function(className, quiddName)
			{

				//recover on format json the value of field for methods
				var dataFormMeth =  $('#form-methods').serializeObject();
				//result voulu  var test = switcher.invoke(v4l2src, "capture_full", ["/dev/video0", 640, 480, 30, 1, "default"]);
				views.methods.getMethodsByClassForConfiguration(className, function(methods)
				{

					_.each(methods, function(method)
					{
						var params = '';
						//this part is just us for video v4l2src
						if(method["name"] == "capture_full" && className == "v4l2src")
						{
							var resolution = dataFormMeth["resolution"].split("_");
							var interval = dataFormMeth["interval"].split("_");

							params = [ 	dataFormMeth["file_path"] , 
											parseInt(resolution["0"]), 
											parseInt(resolution["1"]), 
											parseInt(interval["1"]), 
											parseInt(interval["0"]), 
											dataFormMeth["tv_standard"]];

							console.log(method["name"], params);
						}
						else
						{
							//check if a value is define for the method
							if(dataFormMeth[method["name"]] != "")
								params = [dataFormMeth[method["name"]]];
							
						}

						if(params) views.methods.setMethod(quiddName, method["name"], params);
					});
				});

				// $(" input").each(function(index, value)
				// {
				// 	if($(this).attr("name"))
				// 	{
				// 		dataFormMeth[$(this).attr("name")] = $(this).val();
				// 	}
				// });

				// _.each(dataFormMeth, function(value, index)
				// {
				// 	if(value != "")
				// 	{
				// 		views.methods.setMethod(quiddName, index, [va lue]);
				// 	}
				// });
			},
			stateShmdata : function(name, value)
			{	
				var shmdata = name.replace("vumeter_", "");
				if(value > 0) $("[data-path='"+shmdata+"']").removeClass("inactive").addClass("active");
				else $("[data-path='"+shmdata+"']").removeClass("active").addClass("inactive");
				
			},
			displayTitle : function()
			{
				//console.log("check title In", this.collection.size());
				//check number of quidd for titleIn
				var shmdata = false;
				this.collection.find(function(quidd)
				{
					var shms = quidd.get("shmdatas");
					if(shms && shms.length > 0) shmdata = true;
				});

				if(shmdata) $("#titleIn").show();
				else $("#titleIn").hide();
			},
			autoDetect : function(event)
			{
				console.log("get the device available on this computer");
				//create temporary v4l2 quiddity for listing device available
				var className = $(event.target).data("name");
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