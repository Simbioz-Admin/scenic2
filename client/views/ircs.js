define(

	/** 
	 *	View Irc
	 *	Manage intercation with the user and a channel irc
	 *	@exports Views/Irc
	 */

	[
		'underscore',
		'backbone'
	],

	function(_, Backbone) {



		/** 
		 *	@constructor
		 *  @requires Underscore
		 *  @requires Backbone
		 *	@requires TemplateChannel
		 *  @augments module:Backbone.View
		 */

		var IrcsView = Backbone.View.extend(

			/**
			 *	@lends module: Views/Ircs~IrcsView.prototype
			 */

			{
				el: 'body',
				events: {
					"click #btn-irc, .close-irc": 'panelIrc',
					"touchstart #btn-irc .close-irc": 'panelIrc'

				},

				/* 	Called when the view ircs is initialized 
				 *	adding the container that will host channels
				 */

				initialize: function() {
					//$("#panelTables").append('<div id="btn-irc"><div class="content"></div></div>');
				},

				/* Called when the user open the IRC interface */

				panelIrc: function() {
					if (!this.statePanelIrc) {
						$("#chat").show();
						this.statePanelIrc = true;

						/* we need to reinit the count message for the active channel when is saw on open interface irc */

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

		return IrcsView;
	})