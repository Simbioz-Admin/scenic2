define([
	'underscore',
	'backbone'
], function(_, Backbone) {

	var ViewIrcs = Backbone.View.extend({
		tagName: 'body',
		className: 'mapper',
		table: null,
		events: {},
		initialize : function() {
			console.log("view IRCS");
			$("#panelTables").append('<div id="btn-irc"><div class="content"></div></div>');
		}

	});

	return ViewIrcs;
})