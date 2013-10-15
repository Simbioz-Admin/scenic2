define([
	'underscore',
	'backbone',
	'text!/templates/logger.html'
], function(_, Backbone, TemplateLogger) {

	var ViewLogger = Backbone.View.extend({
		tagName: 'div',
		events: {
			"click .close" : "show",
			'change input[type=checkbox]' : "filter"
		},
		level : { info : true, debug : true, error : true, warn : true},
		initialize: function() {

			var that =this;

			socket.on("messageLog", function(log) {
				that.addLog(log.date, log.level, log.message);
			});
			// "click #btn-log": 'panelLog',
			$("#btn-log").on("click",function() { that.show() });
			this.render();
		},
		render : function() {

			var template = _.template(TemplateLogger);
			$(this.el).attr("id", "log").html(template);
			$("body").append($(this.el));
			// this.show();
		},
		hide : function() {
			console.log("close");

		},
		show : function(){
			var that = this;
			//Check if panelLog is open if not we fetch log for get the messages
			if(!$(this.el).hasClass("active")) {
				$(this.el).addClass("active");
				$(".content", this.el).html("");
				that.collection.fetch({
					success : function() {
						that.collection.each(function(log) {

							that.addLog(log.get("date"), log.get("level"), log.get("message"));
						});
					}
				})
			}
			else {
				$(this.el).removeClass("active");
			}
			
		},
		addLog : function(date, level, message) {

			var msg = $("<div class='msgLog level-"+level+"'></div>");
				msg.append("<div class='type "+level+"'>"+level+"</div>");
				msg.append("<div class='date'>"+date+"</div>");
				msg.append("<div class='message'>"+message+"</div>");

			//check if show level log
			if(this.level[level] == false) {
				msg.css("display", "none");
			}

			$(".content", this.el).append(msg);
			$(".content", this.el).scrollTop(100000000000000000);
		},
		filter : function(element) {
			var level = $(element.target).attr("name");
			this.level[level] = (this.level[level] ? false : true);
			if(this.level[level]) {
				$(".level-"+level).show();
			}
			else {
				$(".level-"+level).hide();
			}
		}

	});

	return ViewLogger;
})