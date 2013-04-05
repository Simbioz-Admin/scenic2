define([
	'underscore',
	'backbone',
	'text!/templates/setMethod.html',
	],function(_, Backbone, templateMethod){

		var MethodsView = Backbone.View.extend({
			el : '#lightBox',
			events : {
				'click #setMethod' : 'setMethodPanel'
			},
			initialize : function(){
				console.log("init MethodsView");
				_.bindAll(this, "render");
				//this.collection.bind("add", this.addDestination);
				this.render();
			},
			getDescription : function(quiddName, method, callback){
				//ask description of method for generate form insertion
				socket.emit("getMethodDescription", quiddName, method, function(methodDescription){
					callback(methodDescription);
				});
			},
			getMethodsByClassWithFilter : function(className, filter, callback){

				methods = {};
				socket.emit("getMethodsDescriptionByClass", className, function(methodByClass){
					_.filter(methodByClass, function(method, index){
		    			var existing = $.inArray(method.name, filter);
		    			if(existing >= 0 ) methods[index] = method;
		    		});
		    		callback(methods);
				});
			},
			setMethod : function(quiddName, method, parameters, callback){
				socket.emit("invoke", quiddName, method, parameters, function(ok){
					if(ok){
						//update the properties of quidd
						var quidd = collections.quidds.get(quiddName);
						collections.quidds.getProperties(quiddName, function(propertiesOfQuidd){
							quidd.set({"properties" : propertiesOfQuidd});
						});
						callback(ok);
					}
				});
			},
			setMethodPanel : function(){
				var dataForm = $("#form-lightbox").serializeObject()
				,	parameters = [];

				_.each(dataForm, function(value, index){
					//exclude metho and name for generate parameters array
					if(index != "method" && index != "quiddName"){
						parameters.push(value);
					}
				});

				socket.emit("invoke", dataForm.quiddName, dataForm.method, parameters, function(ok){
					//if the method is set correctly
					if(ok){
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