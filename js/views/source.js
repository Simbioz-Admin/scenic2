define([
	'underscore',
	'backbone',
	'text!/templates/source.html',
], function(_, Backbone, TemplateSource) {

	var ViewSource = Backbone.View.extend({
		tagName: 'table',
		className: 'source',
		table: null,
		events: {
			"click .edit": "edit",
			"click .remove": "removeClick",
			"click .preview": "preview",
			'click .info': 'info'
		},
		initialize: function() {
			this.model.on('remove', this.removeView, this);
			this.model.on('change:shmdatas', this.render, this);
			this.table = this.options.table;

			//here we define were go the source  httpsdpdec
			if (this.model.get("class") == "httpsdpdec") {
				$("#" + this.table + " #remote-sources").prepend($(this.el));
			} else {
				$("#" + this.table + " #local-sources").prepend($(this.el));
			}

			this.render();

		},
		render: function() {
			$(this.el).html("");
			var that = this,
				shmdatas = this.model.get("shmdatas"),
				destinations = (this.table == "transfer" ? collections.clients.toJSON() : null);

			console.log(shmdatas);
			if (typeof shmdatas == "object" && shmdatas.length != 0) {
				_.each(shmdatas, function(shmdata, index) {
					var template = _.template(TemplateSource, {
						shmdata: shmdata,
						index: index,
						nbShmdata: shmdatas.length,
						sourceName: that.model.get("name"),
						destinations: destinations
					});
					$(that.el).append($(template));

					setTimeout(function() {
						that.setPreview(shmdata);
					}, 1000);
				});
			} else {
				var template = _.template(TemplateSource, {
					sourceName: that.model.get("name"),
					shmdata: null
				});

				$(that.el).append($(template));

			}


		},
		setPreview : function(shmdata) {
			var that = this;
			//get info about vumeter for know if we can create a preview
			collections.quidds.getPropertyValue("vumeter_" + shmdata.path, "caps", function(info) {
				info = info.split(",");

				if (info[0] == "audio/x-raw-int" || info[0] == "video/x-raw-yuv") {
					
					var type = (info[0].indexOf("video") >= 0 ? "gtkvideosink" : "pulsesink");
					//check if the quiddity have already a preview active
					socket.emit("get_quiddity_description", that.model.get("name")+type, function(quiddInfo) {
						var active = (quiddInfo.name ? "active" : "");
						$("[data-path='" + shmdata.path + "'] .nameInOut .short").append("<div class='preview "+active+"'></div>");
					});
				}
			});

		},
		edit: function() {
			this.model.edit();
		},
		removeClick: function() {
			this.model.delete();
		},
		removeView: function() {
			this.remove();
		},
		preview: function(element) {
			this.model.preview(element);
			$(element.target).toggleClass("active");
		},
		info: function(element) {
			this.model.info(element);
		}
	});

	return ViewSource;
})