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
					class : "tabTable "+active,
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
				console.log(this.model.get("type"));

				var quidds = collections.quidds.toJSON();
				$("#listQuiddsProperties").remove();
				var template = _.template(TemplateMenu, {type : "control", menus : quidds});
				$(element.target).after(template);
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