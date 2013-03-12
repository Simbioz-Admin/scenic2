define([
	'underscore',
	'backbone',
	'text!/templates/quidd.html'
	],function(_, Backbone, quiddTemplate){

		var QuiddView = Backbone.View.extend({
			el : '#menu',
			events : {
				"click .dropdown-menu li" : "addQuidd"
			},
			initialize : function(){
				console.log("init QuiddsView");
			},
			//open the lightbox and show the properties to define for create the quidd
			addQuidd : function(){
				className = $(event.target).data("name");
				var classDoc = this.collection.get(className);
				console.log(classDoc.get("properties"));
				var template = _.template(quiddTemplate, {title : "add Quidd "+className, classDoc : classDoc});
				$("#lightBox").html(template);
				$("#lightBox, #bgLightbox").fadeIn(200);
			}
		});

		return QuiddView;
	})