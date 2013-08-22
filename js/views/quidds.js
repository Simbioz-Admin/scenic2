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
				"click .source[data-name]" : "openPanelCreate",
				'click .submit-quidd.create' : 'create',
				'click .submit-quidd.save' : 'edit',
				'click .delete-quidd' : 'delete',
				"mouseenter [data-name='v4l2src']" : "autoDetectionV4l2",
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
			//open the lightbox and show the properties to define for create the quidd Source
			openPanelCreate : function(event)
			{
					console.log("test");
				var className = $(event.target).data("name")
				,	categoryQuidd = collections.classesDoc.get(className).get("category")
				,	that = this
				,	category = "encoder";

				//check category of the quidd and get specific encoder
				if(categoryQuidd.indexOf("video") >= 0) category = "video encoder";
				if(categoryQuidd.indexOf("audio") >= 0) category = "audio encoder";
				var encoders = collections.classesDoc.getByCategory(category).toJSON();


				//get properties for set in panelRight

				collections.classesDoc.getPropertiesWithout(className, ["shmdata-readers", "shmdata-writers"], function(properties)
				{
					var template = _.template(quiddTemplate, {title : "Create "+className, quiddName : className,  properties : properties, action : "create", encoders : encoders});
					$("#panelRight .content").html(template);
					views.global.openPanel();
				});

				//get methods for set in panelRight

				views.methods.getMethodsByClassForConfiguration(className, function(methods)
				{
					//data-info is added with autodetection v4l2src
					var infoJsonDevices = $(event.target).data("info");
					var template = _.template(setMethodTemplate, {className : className, methods : methods, jsonDevices : infoJsonDevices});
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
					that.setMethods(className, quidd.name);

					if(encoder != "none")
					{
						//add to the list the encoder ask to create with shmdata
						collections.quidds.listEncoder.push({quiddName : quidd.name, encoder : encoder});
					}
				});

				//views.global.closePanel();
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
			updateProperties: function(quiddName)
			{
				var dataFormProp =  $('#form-quidd ').serializeObject();

				//parse properties for set value of this
				_.each(dataFormProp, function(value, index)
				{

					var currentValue = 	$('[name="'+index+'"]').data("current")
					,	minValue = $('[name="'+index+'"]').data("min")
					,	maxValue = $('[name="'+index+'"]').data("max")
					,	valueSend = value
					,	select = $('[name="'+index+'"]').is('select');

					if(select)
						value = $('[name="'+index+'"] option:selected').text();


					if(value != currentValue)
					{
						collections.quidds.setPropertyValue(quiddName, index, valueSend, function(ok)
							{
								if(ok)
									$('[name="'+index+'"]').data("current", value);
							});
					}
				});
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
			autoDetectionV4l2 : function()
			{
				console.log("get the camera available on this computer");
				//create temporary v4l2 quiddity for listing device available

				collections.classesDoc.getPropertyByClass("v4l2src", "device", function(property)
				{
					console.log(property);
				});


				// collections.quidds.create("v4l2src", "temp_v4l2", function(quidd)
				// {
				// 	//get the value properties devices-json
				// 	collections.quidds.getPropertyValue(quidd.name, "devices-json", function(devices)
				// 	{
				// 		$("#videoDetected").remove();
				// 		$("[data-name='v4l2src']").append("<ul id='videoDetected'></ul>");

				// 		_.each(devices["capture devices"], function(device)
				// 		{
				// 			var li = $("<li></li>",{ 
				// 				text : device["long name"],
				// 				data : { info : device , name : "v4l2src"},
				// 			});
				// 			$("#videoDetected").append(li);
				// 		});
				// 		//remove the temporary quidd
				// 		collections.quidds.delete("temp_v4l2");
				// 	})
				// });
			}
			
		});

		return QuiddView;
	})