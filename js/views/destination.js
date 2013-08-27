define([
	'underscore',
	'backbone',
	'text!/templates/destination.html',
	],function(_, Backbone, TemplateDestination){

		var ViewDestination = Backbone.View.extend({
			tagName : 'td',
			className : 'nameInOut',
			table : null,
			events : {},
			initialize : function()
			{
				this.table = this.options.table;

				var that = this
				,	template = _.template(TemplateDestination, {name : this.model.get("name")});

				$(this.el).append(template);
				$("#"+this.table+" .destinations").append($(this.el));
				$("#"+this.table+" .shmdata").each(function(index, source){
					$(this).append("<td class='box' data-hostname='"+that.model.get('name')+"'></td>");
				});

			}
		});

		return ViewDestination;
	})