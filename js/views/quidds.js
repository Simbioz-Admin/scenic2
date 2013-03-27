define([
	'underscore',
	'backbone'
	],function(_, Backbone){

		var QuiddView = Backbone.View.extend({
			el : '#lightBox',
			events : {
				'click .submit-quidd' : 'create'
			},
			initialize : function(){
				console.log("init QuiddsView");
			},
			create : function(){

				// recover on format json the value of field for properties
				var className = $("#form-lightbox").data("classname")
				,	quiddName = $("#quidName").val()
				,	dataFormProp = {};
				$("#form-quidd input").each(function(index, value){
					if($(this).attr("name")){
						console.log($(this).attr("name"));
						dataFormProp[$(this).attr("name")] = $(this).val();
					}
				});

				// //recover on format json the value of field for methods
				var dataFormMeth = {};
				$("#form-methods input").each(function(index, value){
					if($(this).attr("name")){
						console.log($(this).attr("name"));
						dataFormMeth[$(this).attr("name")] = $(this).val();
					}
				});

				//creation of Quidd and set properties
				collections.quidds.create(className, quiddName, function(quiddName){
					
					//parse properties for set value of this
					_.each(dataFormProp, function(value, index){
						var defaultValue = 	$('[name="'+index+'"]').data("default")
						,	minValue = $('[name="'+index+'"]').data("min")
						,	maxValue = $('[name="'+index+'"]').data("max");

						if(value != defaultValue){
							collections.quidds.setPropertyValue(quiddName, index, value);
						}
					});

					_.each(dataFormMeth, function(value, index){
						if(value != ""){
							views.methods.setMethod(quiddName, index, [value]);
						}
					});
				});

				views.global.closeLightBox();
				return false;
			}
		});

		return QuiddView;
	})