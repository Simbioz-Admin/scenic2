define(

	/** 
	 *	View Table
	 *	The Table view manages activities related to the table, render and actions on menu
	 *	@exports Views/Table
	 */

	[
		'underscore',
		'backbone',
		'text!/templates/table.html',
		'text!/templates/menu.html'
	],

	function(_, Backbone, TemplateTable, TemplateMenu) {

		/** 
		 *	@constructor
		 *  @requires Underscore
		 *  @requires Backbone
		 *	@requires TemplateTable
		 *	@requires TemplateMenu
		 *  @augments module:Backbone.View
		 */

		var TableView = Backbone.View.extend(

			/**
			 *	@lends module: Views/Table~TableView.prototype
			 */

			{
				tagName: 'div',
				className: 'table',
				events: {
					"mouseenter #create-quiddsProperties": "getMenuProperties",
					"mouseenter #create-quidds": "getMenuQuiddsByCategory",
					"mouseenter #create-midi": "getMenuMidiDevice"
				},
				/* Called on initialization of the table (control / transfer) */
				initialize: function() {

					//generate a btn for the table
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
					//add to the default panel
					$("#panelLeft").append(this.el);
				},

				/* 
				 *	called for showing list of properties existing
				 *	We show only the propertie of quiddities added to the table transfer
				 */

				getMenuProperties: function(element) {
					var quiddsMenu = {};
					collections.quidds.each(function(quidd) {
						var quiddCategory = quidd.get("category");
						if (quiddCategory.indexOf("source") != -1 && quidd.get("class") != "midisrc") {
							var listProperties = [];
							_.each(quidd.get("properties"), function(property) {
								if (!collections.controlProperties.get(quidd.get("name") + "_" + property.name) && property.writable == "true" && property.name != "started") {
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

				/* Called for get list of quiddity source 
				 *	The list of quiddity source is get when source word appear in name Class quiddity
				 */

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


				/* Called for get the list of device Midi */

				getMenuMidiDevice: function(element) {
					$("#listDevicesMidi").remove();
					collections.classesDoc.getPropertyByClass("midisrc", "device", function(property) {
						var devicesMidi = property["values"];
						_.each(devicesMidi, function(device, index) {
							collections.quidds.each(function(quidd) {
								if (quidd.get("class") == "midisrc") {
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