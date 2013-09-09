define([
	'underscore',
	'backbone'
], function(_, Backbone) {

	var ViewsControlProperties = Backbone.View.extend({
		el: 'body',
		events: {
			"click .create-ControlProperty": "createControlProperty",
			"click .connect-properties" : "connectProperties",
		},
		initialize: function() {
			console.log("init Views ViewsControlProperties");
		},
		listQuiddsAndProperties: function() {
			var quidds = collections.quidds.toJSON();
			console.log(quidds);
		},
		createControlProperty: function(element) {
			var property = $(element.target).data("property"),
				that = this,
				quiddName = $(element.target).closest("ul").data("quiddname");

			this.collection.setDico(quiddName, property, function(quiddName) {

				$("#control .property").each(function(index, source) {
					$(this).append("<td class='box connect-properties' data-nameandproperty='" + quiddName + "'></td>");
				});
				$(element.target).remove();
			});
		},
		connectProperties: function(element) {

			if($(element.target).attr("class").indexOf("connect-properties") == -1) return false;
			
			var quiddSource = $(element.target).parent().data("quiddname")
			,	propertySource = $(element.target).parent().data("propertyname")
			,	destination = $(element.target).data("nameandproperty").split("_")
			,	sinkSource = destination[0]
			,	sinkProperty = destination[1]
			,	nameQuidd = "mapper_"+quiddSource+"_"+propertySource+"_"+$(element.target).data("nameandproperty");


			collections.quidds.create("property-mapper", nameQuidd, function(infoQuidd) {

				var model = collections.quidds.createClientSide(infoQuidd);

				socket.emit("invoke", infoQuidd.name, "set-source-property", [quiddSource, propertySource]);
				socket.emit("invoke", infoQuidd.name, "set-sink-property", [sinkSource, sinkProperty]);
			});
		}
	});

	return ViewsControlProperties;
});