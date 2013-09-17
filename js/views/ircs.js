define([
	'underscore',
	'backbone'
], function(_, Backbone) {

	var ViewIrcs = Backbone.View.extend({
		el: 'body',
		events: {
			"click #btn-irc, .close-irc": 'panelIrc'
		},
		initialize : function() {
			console.log("view IRCS");
			$("#panelTables").append('<div id="btn-irc"><div class="content"></div></div>');
		},
		panelIrc: function() {
			if (!this.statePanelIrc) {
				$("#chat").show();
				this.statePanelIrc = true;
				if (collections.irc.active) {
					var modelIrc = collections.irc.get($(".channel.active").attr("id"));
					modelIrc.set({
						active: true
					});
					collections.irc.totalMsg = collections.irc.totalMsg - modelIrc.get("msgNotView");
					modelIrc.set({
						msgNotView: 0
					});
				}
			} else {
				$("#chat").hide();
				this.statePanelIrc = false;
				collections.irc.each(function(channel) {
					channel.set({
						active: false
					})
				});
			}
		},

	});

	return ViewIrcs;
})