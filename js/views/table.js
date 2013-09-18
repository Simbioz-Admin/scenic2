define([
	'underscore',
	'backbone',
	'text!/templates/table.html',
	'text!/templates/menu.html'
], function(_, Backbone, TemplateTable, TemplateMenu) {

	var TableView = Backbone.View.extend({
		tagName: 'div',
		className: 'table',
		events: {
			"mouseenter #create-quiddsProperties": "getMenuProperties",
			"mouseenter #create-quidds": "getMenuQuiddsByCategory",
			"mouseenter #create-midi": "getMenuMidiDevice"
		},
		initialize: function() {
			//generate a tab for the table
			var active = (config.defaultPanelTable == this.model.get("type") ? "active" : "");
			var btnTable = $("<div></div>", {
				text: "",
				class: "tabTable " + this.model.get("type") + " " + active,
				data: {
					type: this.model.get("type")
				}
			});
			btnTable.append("<div class='content'></div>");
			$("#panelTables").prepend(btnTable);

			// generate the table
			var template = _.template(TemplateTable, {
				type: this.model.get("type"),
				menus: this.model.get("menus")
			});
			$(this.el)
				.attr("id", this.model.get("type"))
				.addClass(active)
				.html(template);
			$("#panelLeft").append(this.el);
		},
		getMenuProperties: function(element) {
			var quiddsMenu = {};
			collections.quidds.each(function(quidd) {
				var quiddCategory = quidd.get("category");
				if(quiddCategory.indexOf("source") != -1 && quidd.get("class") != "midisrc") {
					var listProperties = [];
					_.each(quidd.get("properties"), function(property) {
						if (!collections.controlProperties.get(quidd.get("name") + "_" + property.name) && property.description.writable == "true" && property.name != "started") {
							listProperties.push(property.name);
							quiddsMenu[quidd.get("name")] = listProperties;
						}
					});
				}
			});

			$("#listQuiddsProperties").remove();
			if (!$.isEmptyObject(quiddsMenu)) {
				var template = _.template(TemplateMenu, {
					type: "QuiddsAndProperties",
					menus: quiddsMenu
				});
				$(element.target).after(template);
			} else {
				views.global.notification("error", "you need to create source before to add a property");
			}
		},
		getMenuQuiddsByCategory: function(element) {
			$("#listQuiddsByCategory").remove();
			var quiddsByCategory = _.groupBy(collections.classesDoc.getByCategory("source").toJSON(), function(source) {
				return source.category;
			});

			delete quiddsByCategory["midi source"]; //remove midi source because it's just use for table control
			var template = _.template(TemplateMenu, {
				type: "quiddsClass",
				menus: quiddsByCategory
			});
			$(element.target).after(template);
		},
		getMenuMidiDevice: function(element) {
			$("#listDevicesMidi").remove();
			collections.classesDoc.getPropertyByClass("midisrc", "device", function(property) {

				var devicesMidi = property["type description"]["values"];
				_.each(devicesMidi, function(device, index) {
					collections.quidds.each(function(quidd) {
						if(quidd.get("class") == "midisrc") {
							_.each(quidd.get("properties"), function(property) {
								if (property.name == "device" && property.value == device.name) delete devicesMidi[index];
							});
						}
					});
				});

				var template = _.template(TemplateMenu, {
					type: "devicesMidi",
					menus: devicesMidi
				});
				$(element.target).after(template);
			});
		}
	});

	return TableView;
})