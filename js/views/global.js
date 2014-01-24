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
		'text!/templates/panelInfo.html',
		'text!/templates/panelLoadFiles.html',
		'text!/templates/panelSaveFile.html',
		'text!/templates/confirmation.html',
		'app'
	],

	function(_, Backbone, quiddTemplate, panelInfoTemplate, panelLoadtemplate, panelSaveTemplate, confirmationTemplate, app) {

		/** 
		 *	@constructor
		 *  @requires Underscore
		 *  @requires Backbone
		 *	@requires quiddTemplate
		 *	@requires panelInfoTemplate
		 *	@requires confirmationTemplate
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

				//assocition between action on elements html and functions
				events: {
					"click #close-panelRight": "closePanel",
					"click #close-panelInfoSource": "closePanelInfoSource",
					"change .checkbox": 'stateCheckbox',
					"click #btn-info": 'panelInfo',
					"click #btnSave": 'save_file',
					"submit #saveFile" : 'save',
					"click #btnGetFiles": 'get_save_file',
					'click #panelFiles .file' : 'load_file',
					'click .remove_save' : 'remove_save',
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

				/* Called when we need confirmation for actions */

				confirmation: function(msg, callback){

					if(!callback) {
						callback = msg;
						msg = "Are you sure?";
					}

					var template = _.template(confirmationTemplate, {msg : msg});
					$("body").prepend(template);
					$("#container").addClass("blur");
					$("#overlay_confirmation").animate({opacity : 1},100);

					$("#confirmation .btn_confirmation").on("click", function(){
						callback($(this).data("val"));
						$("#overlay_confirmation").remove();
						$("#container").removeClass("blur");

					});
					//var result = confirm(msg);
					//return result
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
					if (event.which == 27) 
						{
							this.closePanel();
							if($("#overlay_confirmation").length > 0){ 
								$("#overlay_confirmation").remove(); 
								$("#container").removeClass("blur");
							}
						}
				},


				/* 	Called for all checkbox changed
				 *	To dynamically change its value
				 */

				stateCheckbox: function() {
					var check = $(event.target);

					if (check.is(':checked')) check.val('true').attr('checked', true);
					else check.val('false').attr('checked', false);
				},


				save_file: function() {
					if ($("#panelSave").length == 0) {
							$(".panelBox").remove();
							var template = _.template(panelSaveTemplate, {});
							$("#btnSave").after(template);
						} else {
							$(".panelBox").remove();
						}
				},

				/* 
				 *	Called for saving the current state of scenic
				 */

				save: function(e) {
					e.preventDefault();
					var nameFile = $("#name_file").val()
					,	that = this;

					if(nameFile.indexOf(".scenic") >= 0 || nameFile == "") {
						that.notification("error", "the name is not correct (ex : save_202) ");
						return;
					}

					console.log("ask for saving ", nameFile );
					socket.emit("save", nameFile+".scenic", function(ok) {
						views.global.notification("info", nameFile +" is successfully saved", ok);
						$(".panelBox").remove();
					})
				},

				/* 
				 *	Called for get files saved on the server
				 */

				get_save_file : function() {
					var that = this;
					socket.emit('get_save_file', function(saveFiles) {
						if ($("#panelFiles").length == 0) {
							$(".panelBox").remove();
							var template = _.template(panelLoadtemplate, {
								files : saveFiles
							});
							$("#btnGetFiles").after(template);
						} else {
							$(".panelBox").remove();
						}
					});
				},

				/*
				 *	Called for loading the state saved of scenic without the current state
				 *	@TODO make this work !
				 */

				load_file: function(e) {

					socket.emit("load_file", "save_files/"+$(e.target).html(), function(ok) {
						if (ok) {
							
							collections.clients.fetch({
								success: function(response) {
									//generate destinations
									$(".destinations").html("");
									collections.clients.fetch();
									views.clients.displayTitle();
									//regenerate source transfer
									$("#sources").html("");
									collections.quidds.fetch();
									collections.controlProperties.fetch();


								}
							});
							views.global.notification("info", $(e.target).html() + " is loaded");
						}
					});
					$("#panelFiles").remove();
				},

				remove_save : function(e) {
					var name = $(e.target).data("name");
					console.log("REMOVE!", name);
					socket.emit("remove_file", name, function(ok){
						if(ok) {
							$(e.target).parent().remove();
						}
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
					if ($("#panelInfo").length == 0) {
						$(".panelBox").remove();
						var template = _.template(panelInfoTemplate, {
							username: config.nameComputer,
							host: config.host,
							soap: config.port.soap
						});
						$("#btn-info").after(template);;
					} else {
						$("#panelInfo").remove();
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