define([
	'underscore',
	'backbone',
	'text!/templates/setMethod.html',
	],function(_, Backbone, templateMethod){

		var MethodsView = Backbone.View.extend({
			el : '#lightBox',
			events : {
				'click #setMethod' : 'setMethodLightBox'
			},
			initialize : function(){
				console.log("init MethodView");
				_.bindAll(this, "render");
				//this.collection.bind("add", this.addDestination);
				this.render();
			},
			getMethod : function(quiddName, method){
				//ask description of method for generate form insertion
				socket.emit("getMethodDescription", quiddName, method, function(returnValue){
					var methodDescription = $.parseJSON(returnValue);
					var template = _.template(templateMethod, { title : "set Method "+method, quiddName : quiddName, method : method, description : methodDescription});

					$("#lightBox").html(template);
					views.global.openLightBox();
				});
			},
			getMethodsByClass : function(quiddName){
				socket.emit("getMethodsDescriptionByClass", quiddName, function(returnValue){
					console.log(returnValue);
				});
			},
			setMethod : function(quiddName, method, parameters){
				socket.emit("invoke", quiddName, method, parameters, function(ok){
					if(ok){
						//update the properties of quidd
						var quidd = collections.quidds.get(quiddName);
						collections.quidds.getProperties(quiddName, function(propertiesOfQuidd){
							quidd.set({"properties" : propertiesOfQuidd});
						});
					}
				});
			},
			setMethodLightBox : function(){
				var dataForm = $("#form-lightbox").serializeObject()
				,	parameters = [];

				_.each(dataForm, function(value, index){
					//exclude metho and name for generate parameters array
					if(index != "method" && index != "quiddName"){
						parameters.push(value);
					}
				});

				socket.emit("invoke", dataForm.quiddName, dataForm.method, parameters, function(invoke){
					//if the method is set correctly
					if(invoke){
						if(dataForm.method == "add_destination"){
							collections.destinations.add({name : dataForm.name, host_name : dataForm.host_name});
							views.global.closeLightBox();
						}
					}else{
						views.global.alertMsg("error", "Oops... We have an error.");
					}
				});
				return false;
			}
		});

		return MethodsView;
	})