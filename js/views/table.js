define(

	/** 
	 *	View Table
	 *	The Table view manages activities related to the table, render and actions on menu
	 *	@exports Views/Table
	 */

	[
		'underscore',
		'backbone',
		'text!/templates/table/table.html',
		'text!/templates/table/menu.html',
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
					// "mouseenter #create-quidds": "getMenuQuiddsByCategory",
					"mouseenter #create-midi": "getMenuMidiDevice",
					"mouseenter .get_classes": 'get_classes',
					// "click .connect-to-quidd": "connectToQuidd",

					"click .box" : "ask_connection",
					"keypress #port_destination": "set_connection",
					"blur #port_destination": "removeInputDestination"
				},
				/* Called on initialization of the table (control / transfer) */
				initialize: function() {

					/* generate a btn for the table */

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


					/* generate the table */

					var template = _.template(TemplateTable, {
						type: this.model.get("type"),
						menus: this.model.get("menus")
					});
					$(this.el)
						.attr("id", this.model.get("type"))
						.addClass(active)
						.html(template);


					/* add to the default panel */

					$("#panelLeft").append(this.el);
				},


				/* Called for get list of quiddity source 
				 *	The list of quiddity source is get when source word appear in name Class quiddity
				 */

				get_classes: function(e) {

					/* get the quiddity classes authorized on this table */

					var classes = this.model.classes_authorized($(e.target).data("type"));

					/* we not load classes if nothing is return */
					if(classes.length == 0) return;

					/* GroupBy category the list of classes */

					var classesByCategory = _.groupBy(classes, function(clas) {
						return clas.category;
					});

					var template = _.template(TemplateMenu, {
						type: "classes",
						classes: classesByCategory
					});

					$("#listSources", this.el).remove();
					$(e.target).after(template);

				},

				ask_connection : function(e){

					var box = $(e.target)
					,	destination = box.data("destination")
					,	id = box.data("id")
					,	path = box.parent().data("path");


					/* if transfer we ask port for connect to the receiver */
					if(this.model.get("type") == "transfer") {
						/* if already connect */
						if(box.hasClass("active")) return socket.emit("remove_connection", path, id, function(ok){});
						box.html("<div class='content-port-destination' ><input id='port_destination' autofocus='autofocus' type='text' placeholder='define port'></div>");
					}

					if(this.model.get("type") == "audio"){
						if(box.hasClass("active")){
							console.log("disconnect audio");
							socket.emit("invoke", destination, "disconnect", [], function(data) {
								console.log(data);
							})
						}
						else {
							console.log("connect audio together");
							
							socket.emit("invoke", destination, "connect", [path], function(data) {
								console.log(data);
							});
						}
					}


				},

				set_connection : function(e){
					var that = this;

					if (e.which == 13) //touch enter
					{
						var box = $(e.target).parent(),
							id = $(e.target).closest("td").data("id"),
							path = $(e.target).closest("tr").data("path"),
							quiddName = $(e.target).closest("tr").data("quiddname"),
							port = $(e.target).val(),
							portSoap = this.model.get("collectionDestinations").get(id).get("portSoap"),
							that = this;

						socket.emit("connect_destination", quiddName, path, id, port, portSoap, function(ok) {
							that.removeInputDestination(e);
						});
					}
				},

				/* removes the input who we defined the port */
				removeInputDestination: function(element) {
					$(element.target).parent().parent().html("");
				},


				// getQuidds : function(element){

				// 	var type = $(element.target).data("type");

				// 	if(this.model.get("menus")[type].byCategory){

				// 		var excludes =this.model.get("menus")[type].byCategory.excludes;
				// 		var select = this.model.get("menus")[type].byCategory.select;
				// 		var category = this.model.get("menus")[type].byCategory.name;

				// 		var quiddsList = _.groupBy(collections.classesDoc.getByCategory(category).toJSON(), function(source) {
				// 			return source.category;
				// 		});

				// 		if(excludes) quiddsList = _.omit(quiddsList, excludes);
				// 		if(select) quiddsList = _.pick(quiddsList, select);
				// 	}

				// 	if(this.model.get("menus")[type]["byClasses"]) {

				// 		var excludes = this.model.get("menus")[type].byClasses.excludes;
				// 		var select = this.model.get("menus")[type].byClasses.select;

				// 		var quiddsList = [];

				// 		_.find(collections.classesDoc.toJSON(), function(quidd) {
				// 			if(_.contains(select, quidd["class name"]) && quidd.category.indexOf("source") >= 0) quiddsList.push(quidd);
				// 		});

				// 		quiddsList = _.groupBy(quiddsList, function(source) {
				// 			return source.category;
				// 		});
				// 	}



				// 	$("#listSources").remove();

				// 	var template = _.template(TemplateMenu, {
				// 		type: "sources",
				// 		menus: quiddsList
				// 	});
				// 	$(element.target).after(template);

				// },


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