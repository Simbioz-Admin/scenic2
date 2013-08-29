define([
	'underscore',
	'backbone',
	'text!/templates/table.html',
	'text!/templates/menu.html'
	],function(_, Backbone, TemplateTable, TemplateMenu){

		var TableView = Backbone.View.extend({
			tagName : 'div',
			className : 'table',
			events : {
				"mouseenter #create-quiddsProperties" : "listQuiddsAndProperties",
				"mouseenter #create-quidds" : "listByCategoryQuidds"
			},
			initialize : function()
			{
				//generate a tab for the table
				var active = (config.defaultPanelTable == this.model.get("type") ? "active" : "");
				var btnTable = $("<div></div>",{ 
					text : "",
					class : "tabTable "+this.model.get("type")+" "+active,
					data : { type : this.model.get("type") }
				});
				$("#panelTables").append(btnTable);		

				// generate the table
				var template = _.template(TemplateTable, { type : this.model.get("type"), menus : this.model.get("menus")} );
				$(this.el)
					.attr("id",this.model.get("type"))
					.addClass(active)
					.html(template);
				$("#panelLeft").append(this.el);
			},
			listQuiddsAndProperties : function(element)
			{
				var quiddsMenu = {};
				//check for remove properties already create for control
				collections.quidds.each( function(quidd)
					{
						var listProperties = [];
						_.each(quidd.get("properties"), function(property)
						{
							if(!collections.controlProperties.get(quidd.get("name")+"_"+property.name) && property.description.writable == "true")
							{
								listProperties.push(property.name);
								quiddsMenu[quidd.get("name")] = listProperties;
							}
						});
					});

				$("#listQuiddsProperties").remove();
				if(!$.isEmptyObject(quiddsMenu)){
					var template = _.template(TemplateMenu, {type : "control", menus : quiddsMenu});
					$(element.target).after(template);
				}
				else
				{
					views.global.notification("error", "you need to create source before to add a property");
				}
			},
			listByCategoryQuidds : function(element)
			{
				$("#listQuiddsByCategory").remove();
				var quiddsByCategory = _.groupBy(collections.classesDoc.getByCategory("source").toJSON(), function(source)
								{ 
									return source.category; 
								});
				var template = _.template(TemplateMenu, {type : "transfer", menus : quiddsByCategory});
				$(element.target).after(template);
			}
		});

		return TableView;
	})