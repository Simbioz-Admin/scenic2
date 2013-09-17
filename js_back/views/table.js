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
				//"click .source" : "test",

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

				/* generate the table
				*
				* if the table is a control we transfert we select quidds type devices for destinations and midi/osc for sources
				*
				*/
				if(this.model.get("type") == "transfert")
					var sources = _.groupBy(collections.classesDoc.getByCategory("source").toJSON(), function(source){ return source.category; });

				var template = _.template(TemplateTable);
				$(this.el)
					.attr("id",this.model.get("type"))
					.addClass(active)
					.html(template);
				$("#panelLeft").append(this.el);
				
				var templateMenu = _.template(TemplateMenu, {menu : sources});
				$("#"+this.model.get("type")+" .menuTable").append(templateMenu);

			}
		});

		return TableView;
	})