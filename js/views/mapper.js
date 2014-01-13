define(

	/** 
	 *	View Mapper
	 *	Map view manages the control connection between the elments of mid-type osc and properties quiddities
	 *	@exports Views/Mapper
	 */

	[
		'underscore',
		'backbone',
		'text!/templates/mapper.html'
	],

	function(_, Backbone, TemplateMapper) {

		/** 
		 *	@constructor
		 *  @requires Underscore
		 *  @requires Backbone
		 *	@requires TemplateMapper
		 *  @augments module:Backbone.View
		 */

		var MapperView = Backbone.View.extend(

			/**
			 *	@lends module: Views/Mapper~MapperView.prototype
			 */

			{
				tagName: 'div',
				className: 'mapper',
				table: null,
				events: {
					"click .edit-mapper": "edit",
					"click .remove-mapper": "removeClick"
				},

				/* called for each new mapper */
				initialize: function() {
					/* Subscribe to the remove of a specific mapper */
					this.model.on('remove', this.removeView, this);
					this.table = this.options.table;
					this.render();
				},

				/* Called for render the view */
				render: function() {
					var info = this.model.get("name").split("_");
					var template = _.template(TemplateMapper);
					$(this.el).html(template);
					//find the connection
					var box = $("[data-quiddname='" + info[1] + "'][data-propertyname='" + info[2] + "'] [data-nameandproperty='" + info[3] + "_" + info[4] + "']");
					box.html($(this.el));
				},
				edit: function() {
					this.model.edit();
				},
				removeClick: function() {
					this.model.delete();
				},
				removeView: function() {
					this.remove();
				}
			});

		return MapperView;
	})