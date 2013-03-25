define([
	'underscore',
	'backbone',
	'text!/templates/destination.html',
	],function(_, Backbone, templateDestination){

		var DestinationsView = Backbone.View.extend({
			el : '#table',
			events : {
				//'click #create-quidd' : 'create'
			},
			initialize : function(){
				console.log("init DestinationsView");
				_.bindAll(this, "render");
				this.collection.bind("add", this.render);
				this.render();
			},
			render : function(){
				//remove all box
				$(".box").remove();
				var destinations = this.collection.toJSON();
				var templateHeader = _.template(templateDestination, {header : true, destinations : destinations});
				var template = _.template(templateDestination, { header : false, destinations : destinations});

				//add Header destinations
				$("#headerDest").html(templateHeader);

				//add the destination il all tr of table
				$(".rows").each(function(index){
					$(this).append(template);
				});
			}
		});

		return DestinationsView;
	})