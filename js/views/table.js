define([
	'underscore',
	'backbone',
	'text!/templates/table.html'
	],function(_, Backbone, TemplateTable){

		var TableView = Backbone.View.extend({
			tagName : 'div',
			className : 'table',
			events : {},
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
				

			}
		});

		return TableView;
	})