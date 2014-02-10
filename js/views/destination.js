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

				initialize: function(options) {
					/* subscribe to suppression of the model */
					this.model.on('remove', this.removeView, this);
					this.table = options.table;
					var that = this;

					var that = this,
						template = _.template(TemplateDestination, {
							name: this.model.get("name")
						});

					$(this.el).append(template);



					//add the template to the destination table transfer
					$("#" + this.table + " .destinations").append($(this.el));

					_.each($("#" + this.table + " .shmdata"), function(shmdata) {

						/* check if box is already here */
						if ($("[data-id='" + that.model.get('id') + "']", shmdata).length > 0) return;

						/* check if connection is active */
						if (that.table == "transfer") {
							var active = _.where(that.model.get("data_streams"), {
								path: $(shmdata).data("path")
							}).length > 0 ? 'active' : "";
						}

						if (that.table == "audio") {
							if (that.table == "audio") {
								_.each(destination.get("shmdata-readers"), function(shmdata) {
									console.log(shmdata);
								});
							}
						}

						var connection = "<td class='box " + active + " " + that.table + "' data-destination='" + that.model.get('name') + "' data-id='" + that.model.get('id') + "'></td>";

						$(shmdata).append(connection);


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
					/* remove old box */
					$("[data-id='" + this.model.get('id') + "']").remove();
				}
			});

		return ViewDestination;
	})