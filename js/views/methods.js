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

				socket.on("invoke", function(ok, quiddName, method, parameters){
					console.log(ok, quiddName, method, parameters);
					if(ok){
						if(method == "add_destination"){
							collections.destinations.add({name : parameters[0], host_name : parameters[1]});
						}
					}
				});

				_.bindAll(this, "render");
				//this.collection.bind("add", this.addDestination);
				this.render();
			},
			getMethod : function(quiddName, method){
				//ask description of method for generate form insertion
				socket.emit("getMethodDescription", quiddName, method, function(methodDescription){
					var template = _.template(templateMethod, { title : "set Method "+method, quiddName : quiddName, method : method, description : methodDescription});
					$("#lightBox").html(template);
					views.global.openLightBox();
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
						//update the properties of quidd because setMethod can change properties or create
						var quidd = collections.quidds.get(quiddName);
						collections.quidds.getProperties(quiddName, function(propertiesOfQuidd){

							quidd.set({"properties" : propertiesOfQuidd});

							/**** TEMPORARY CREATE ENC AFTER SET METHOD FOR GSTVIDEOSRC *****************************///
							if(quidd.get("class") == "gstvideosrc"){
								console.log(quidd.get("name"));
					    		_.each(quidd.get("properties"), function(property){
					    			if(property.name == "shmdata-writers"){
						    			var path = property.value.shmdata_writers[0].path;
					    				console.log(property.value.shmdata_writers[0].path);

						    			collections.quidds.create("x264enc",quidd.get("name")+"_enc", function(name){
						    				views.methods.setMethod(name, "connect", [path]);
						    			});
					    			}
					    		});
				    		}

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

				socket.emit("invoke", dataForm.quiddName, dataForm.method, parameters, function(ok){
					if(ok){
						views.global.closeLightBox();
					
					}else{
						views.global.alertMsg("error", "Oops... We have an error.");
					}
				});
				return false;
			}
		});

		return MethodsView;
	})