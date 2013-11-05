define(

	/** 
	 *	View Global
	 *	Manage interaction with the Destination Model (quiddity)
	 *	@exports Views/Gobal
	 */

	[
		'underscore',
		'backbone',
		'text!/templates/quidd.html',
		'text!/templates/panelInfo.html'
	],

	function(_, Backbone, quiddTemplate, panelInfoTemplate) {

		/** 
		 *	@constructor
		 *  @requires Underscore
		 *  @requires Backbone
		 *	@requires quiddTemplate
		 *	@requires panelInfoTemplate
		 *  @augments module:Backbone.View
		 */

		var GlobalView = Backbone.View.extend(

			/**
			 *	@lends module: Views/Gobal~GlobalView.prototype
			 */

			{
				el: 'body',
				statePanelIrc: false,
				statePanelLog: false,
				statePanelInfo: false,

				//assocition between action on elements html and functions
				events: {
					"click #close-panelRight": "closePanel",
					"click #close-panelInfoSource": "closePanelInfoSource",
					"change .checkbox": 'stateCheckbox',
					"click #btn-info": 'panelInfo',
					"click #btnSave": 'save',
					"click #btnLoadScratch": 'load_from_scratch',
					"click .tabTable": 'showTable',
					"touchstart .tabTable": 'showTable',


				},


				/* Called when the view is initialized */

				initialize: function() {

					var that = this;
					/** Event called when the server has a message for you */
					socket.on("msg", function(type, msg) {
						that.notification(type, msg);
					});

					/* Define the panelRight draggable */
					$("#panelRight .content, .panelInfoSource").draggable({
						cursor: "move",
						handle: "#title"
					});

					$(document).keyup(function(e) {
						that.keyboardAction(e);
					});

				},


				/* Function called for show a specific message in the interface */

				notification: function(type, msg) {
					var speed = 500;

					$("#msgHighLight").remove();
					$("body").append("<div id='msgHighLight' class='" + type + "'>" + msg + "</div>");
					$("#msgHighLight").animate({
						top: "50"
					}, speed, function() {
						$(this).delay(4000).animate({
							top: "-50"
						}, speed);
					});

					$("#msgHighLight").click(function() {
						$(this).remove();
					})
				},


				/* Called for open the panel Right (use for edit and create quiddity) */

				openPanel: function() {
					$("#panelRight").show();
				},


				/* Called for close the panel Right  */

				closePanel: function(e) {
					$("#panelRight").hide();
					/* we unsubscribe to the quiddity */
					socket.emit("unsubscribe_info_quidd", $("#quiddName").val());

				},


				/* Called when we type a touch on keyboard for specified action (only use for close panel for the moment) */

				keyboardAction: function(event) {
					var that = this;
					if (event.which == 27) this.closePanel();
				},


				/* 	Called for all checkbox changed
				 *	To dynamically change its value
				 */

				stateCheckbox: function() {
					var check = $(event.target);

					if (check.is(':checked')) check.val('true').attr('checked', true);
					else check.val('false').attr('checked', false);
				},


				/* 
				 *	Called for saving the current state of scenic
				 *	@TODO make this work !
				 */

				save: function() {
					console.log("ask for saving");
					socket.emit("save", "save.scenic", function(ok) {
						views.global.notification("info", "save return :", ok);
					})

				},


				/*
				 *	Called for loading the state saved of scenic without the current state
				 *	@TODO make this work !
				 */

				load_from_scratch: function() {
					console.log("ask for load history from scratch");
					socket.emit("load_from_scratch", "save.scenic", function(ok) {
						if (ok) {
							collections.clients.fetch({
								success: function(response) {
									//generate destinations
									$("#destinations").html("");
									collections.destinations.render();
									views.destinations.displayTitle();
									$("#sources").html("");
									collections.quidds.fetch();
								}
							});
						}

						console.log("load from scratch return :", ok);
					})
				},


				/*
				 *	Called for loading the state saved of scenic with the current state
				 *	@TODO make this work !
				 */

				load_from_current_state: function() {
					console.log("ask for load history from current state");
					socket.emit("load_from_current_state", "save", function(ok) {
						console.log("load from current state return :", ok);
					})
				},

				/* Called for showing the panel of log information */

				panelLog: function() {
					var that = this;
					if (!this.statePanelLog) {
						$("#log").animate({
								"right": 0
							},
							function() {
								that.statePanelLog = true;
							});
					} else {
						$("#log").animate({
							"right": -$("#log").width() - 61
						}, function() {
							that.statePanelLog = false;
						});
					}

				},



				/* Called for showing panel Info  */

				panelInfo: function() {
					if (!this.statePanelInfo) {
						var template = _.template(panelInfoTemplate, {
							username: config.nameComputer,
							host: config.host,
							soap: config.port.soap
						});
						$("#btn-info").after(template);
						this.statePanelInfo = true;
					} else {
						$("#panelInfo").remove();
						this.statePanelInfo = false;
					}
				},


				/* Called for closing panel Info  */

				closePanelInfoSource: function() {
					$(".panelInfoSource").remove();
				},

				/* Called for switcher between the different table (control and tranfer) */

				showTable: function(event) {
					var table = $(event.target).parent().data("type");
					collections.tables.currentTable = table;
					$(".tabTable").removeClass("active");
					$(event.target).parent().addClass("active");
					$(".table").hide();
					$("#" + table).show();
				}
			});

		return GlobalView;
	})