define([
	'underscore',
	'backbone'
	],function(_, Backbone){

		var QuiddView = Backbone.View.extend({
			el : '#lightBox',
			events : {
				'click #create-quidd' : 'create'
			},
			initialize : function(){
				console.log("init QuiddsView");
			},
			create : function(){
				//recover on format json the value of field
				var dataForm = $("#form-lightbox").serializeObject()
				,	className = $("#form-lightbox").data("classname")
				,	quiddName = $("#quidName").val();

				//creation of Quidd and set properties
				collections.quidds.create(className, quiddName, function(quiddName){
					
					//parse properties for set value of this
					_.each(dataForm, function(value, index){

						var defaultValue = 	$('[name="'+index+'"]').data("default")
						,	minValue = $('[name="'+index+'"]').data("min")
						,	maxValue = $('[name="'+index+'"]').data("max");

						if(value != defaultValue){
							collections.quidds.setPropertyValue(quiddName, index, value);
						}
					});
				});


				views.global.closeLightBox();
				return false;
			}
		});

		return QuiddView;
	})