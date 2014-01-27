define(

	/** 
	 *	View Destination
	 *	Manage interaction with the Destination Model (quiddity)
	 *	@exports Views/Destination
	 */

	[
		'underscore',
		'backbone',
		'text!/templates/destination.html',
	],

	function(_, Backbone, TemplateDestination) {

		/** 
		 *	@constructor
		 *  @requires Underscore
		 *  @requires Backbone
		 *	@requires TemplateDestination
		 *  @augments module:Backbone.View
		 */

		var ViewDestination = Backbone.View.extend(

			/**
			 *	@lends module: Views/Destination~ViewDestination.prototype
			 */

			{
				tagName: 'td',
				className: 'nameInOut',
				table: null,
				events: {
					"click .edit": "edit",
					"click .remove": "removeClick"
				},


				/* Called when the view is initialized */

				initialize: function() {

					/* subscribe to suppression of the model */
					this.model.on('remove', this.removeView, this);
					this.table = this.options.table;

					var that = this,
						template = _.template(TemplateDestination, {
							name: this.model.get("name")
						});

					$(this.el).append(template);
					//add the template to the destination table transfer
					$("#" + this.table + " .destinations").append($(this.el));

					/* add for each shmdata of source transfer a new box for the connection */
					$("#" + this.table + " .shmdata").each(function(index, source) {
						$(this).append("<td class='box connect-client' data-hostname='" + that.model.get('name') + " data-id='" + that.model.get('id') + "'></td>");
					});

				},


				/* Called when the click event is on the button edit destination */

				edit: function() {
					this.model.edit();
				},


				/* Called when the click event is on the button remove destination */

				removeClick: function() {
					this.model.delete();
				},


				/* Called when the model is removed */

				removeView: function() {
					this.remove();
				}
			});

		return ViewDestination;
	})