define([
	'underscore',
	'backbone',
	'text!/templates/destination.html',
	],function(_, Backbone, templateDestination){

		var DestinationsView = Backbone.View.extend({
			el : 'body',
			events : {
				"click #createDestination" : "create",
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
				
				if(destinations.length > 0 ){
					var templateHeader = _.template(templateDestination, {header : true, destinations : destinations});
					var template = _.template(templateDestination, { header : false, destinations : destinations});

					//add Header destinations
					$("#headerDest").html(templateHeader);

					//add the destination il all tr of table
					$(".rows").each(function(index){
						$(this).append(template);
					});

					//add active connection between shmdata and destination
					_.each(destinations, function(destination){
						_.each(destination.data_streams, function(shmdata){
							$("[data-path='"+shmdata.path+"'] [data-destname='"+destination.name+"']").addClass("active");
						})
					});
				}
			},
			create : function(){
				views.methods.getMethod("defaultrtp", "add_destination");
				
			}
		});

		return DestinationsView;
	})