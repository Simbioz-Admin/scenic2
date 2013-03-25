define([
	'underscore',
	'backbone',
	'text!/templates/shmdata.html',
	'util'
	],function(_, Backbone, templateShmdata){

		var shmdatasView = Backbone.View.extend({
			el : '#table',
			events : {
				'click .td-fixe .content' : 'copyToClipboard'
			},
			initialize : function(){
				console.log("init shmdataView");
				_.bindAll(this, "render");
				this.collection.bind("add", this.addShmdata);
				this.render();
			},
			render : function(){
				var quidds = this.collection.getShmdatas();
				var template = _.template(templateShmdata, {quidds : quidds});
				$("#table").html(template);
			},
			addShmdata : function(){
				var quiddName = this.last().get("name");
				var quidd = this.getShmdata(quiddName);
				var template = _.template(templateShmdata, {quidds : quidd});
				$("#table").append(template);
				//need to refresh destination because the td of tr source must be recreate
				views.destinations.render();
			},
			copyToClipboard : function(){
				window.prompt ("Copy to clipboard: Ctrl+C, Enter", $(".ui-tooltip-content").html());
			}
		});

		return shmdatasView;
	});