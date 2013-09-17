define([
	'underscore',
	'backbone',
	'text!/templates/quidd.html',
	'text!/templates/panelInfo.html'
], function(_, Backbone, quiddTemplate, panelInfoTemplate) {

	var MenuView = Backbone.View.extend({
		el: 'body',
		statePanelIrc: false,
		statePanelLog: false,
		statePanelInfo: false,
		//assocition between action on elements html and functions
		events: {
			"click .dropdown-toggle": "openDropdown",
			"click #close-panelRight": "closePanel",
			"click #close-panelInfoSource": "closePanelInfoSource",
			"change .checkbox": 'stateCheckbox',
			"click #btn-info": 'panelInfo',
			"click #btnSave": 'save',
			"click #btnLoadScratch": 'load_from_scratch',
			"mouseenter td.nameInOut, .groupSource, .mapper": "showActions",
			"mouseleave td.nameInOut, .groupSource, .mapper": "hideActions",
			"click .tabTable": 'showTable'

		},

		//generation of the main Menu 
		initialize: function() {

			console.log("init global View");
			var that = this;


			socket.on("msg", function(type, msg) {
				that.notification(type, msg);
			});


			//$("#globalTable").draggable({ cursor: "move", handle:"#headerTable"});
			$("#panelRight .content, .panelInfoSource").draggable({
				cursor: "move",
				handle: "#title"
			});

			$(document).keyup(function(e) {
				that.keyboardAction(e);
			});

		},
		//action for open the sub-menu
		openDropdown: function() {
			var menu = $(event.target);
			menu.next(".dropdown-menu").show();
			$(".dropdown-menu").mouseleave(function() {
				$(this).hide();
			})
		},


		//alert for different message
		notification: function(type, msg) {
			$("#msgHighLight").remove();
			$("body").append("<div id='msgHighLight' class='" + type + "'>" + msg + "</div>");
			var speed = 500;
			$("#msgHighLight").animate({
				top: "50"
			}, speed, function() {
				$(this).delay(4000).animate({
					top: "-50"
				}, speed);
			});
			//$("#msgHighLight").fadeIn(200).delay(5000).fadeOut(200, function(){$(this).remove();});
			$("#msgHighLight").click(function() {
				$(this).remove();
			})
		},
		openPanel: function() {

			$("#panelRight").show();
			// $("#panelLeft").animate({width : "70%"});
			// $("#panelRight").delay(100).animate({width : "30%"});
		},
		closePanel: function(e) {
			//use fore delete quidd add method start with no method start launch
			$("#panelRight").hide();

			// $("#panelLeft").delay(100).animate({width : "100%"});
			// $("#panelRight").animate({width : "0px"});
		},
		closePanelInfoSource: function() {
			$(".panelInfoSource").remove();
		},
		keyboardAction: function(event) {
			var that = this;
			if (event.which == 27) this.closePanel();
		},
		stateCheckbox: function() {

			var check = $(event.target);

			if (check.is(':checked')) check.val('true').attr('checked', true);
			else check.val('false').attr('checked', false);
		},
		save: function() {
			console.log("ask for saving");
			socket.emit("save", "save.scenic", function(ok) {
				views.global.notification("info", "save return :", ok);
			})

		},
		load_from_scratch: function() {
			console.log("ask for load history from scratch");
			socket.emit("load_from_scratch", "save.scenic", function(ok) {
				if (ok) {
					collections.destinations.fetch({
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
		load_from_current_state: function() {
			console.log("ask for load history from current state");
			socket.emit("load_from_current_state", "save", function(ok) {
				console.log("load from current state return :", ok);
			})
		},
		panelLog: function() {
			var that = this;
			if (!this.statePanelLog) {
				$("#log").animate({
					"right": 0
				}, function() {
					//console.log("open");
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
		showActions: function(event) {
			$(".actions", event.target).css("display", "table").animate({
				opacity: 1
			}, 200);
		},
		hideActions: function(event) {
			$(".actions", event.currentTarget).animate({
				opacity: 0
			}, 200).css("display", "none");
		},
		showTable: function(event) {
			var table = $(event.target).parent().data("type");
			collections.tables.currentTable = table;
			$(".tabTable").removeClass("active");
			$(event.target).parent().addClass("active");
			$(".table").hide();
			$("#" + table).show();
		}
	});

	return MenuView;
})