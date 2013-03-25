define([
	'underscore',
	'backbone',
	'text!/templates/setMethod.html',
	],function(_, Backbone, templateMethod){

		var MethodsView = Backbone.View.extend({
			el : '#lightBox',
			events : {
				'click #setMethod' : 'setMethod'
			},
			initialize : function(){
				console.log("init MethodView");
				_.bindAll(this, "render");
				//this.collection.bind("add", this.addDestination);
				this.render();
			},
			getMethod : function(quiddName, method){
				//ask description of method for generate form insertion
				socket.emit("get_method_description", quiddName, method, function(data){
					var methodDescription = $.parseJSON(data);
					var template = _.template(templateMethod, { title : "set Method "+method, quiddName : quiddName, method : method, description : methodDescription});

					$("#lightBox").html(template);
					views.menu.openLightBox();
				});
			},
			setMethod : function(){
				var dataForm = $("#form-lightbox").serializeObject()
				,	parameters = [];

				_.each(dataForm, function(value, index){
					//exclude metho and name for generate parameters array
					if(index != "method" && index != "quiddName"){
						parameters.push(value);
					}
				});
				console.log(dataForm);
				socket.emit("invoke", dataForm.quiddName, dataForm.method, parameters, function(invoke){
					//if the method is set correctly
					if(invoke){
						if(dataForm.method == "add_destination"){
							collections.destinations.add({name : dataForm.name, host_name : dataForm.host_name});
							views.menu.closeLightBox();
						}
					}else{
						views.menu.alertMsg("error", "Oops... We have an error.");
					}
				});
				return false;
			}
		});

		return MethodsView;
	})