define([
	'underscore',
	'backbone',
	'text!/templates/quidd.html',
], function(_, Backbone, TemplateQuidd) {

	var ViewQuiddEdit = Backbone.View.extend({
		// tagName: 'td',
		// className: 'nameInOut',
		events: { },
		initialize : function() {

			_.each(this.model.get("properties"),function(property) {
				console.log(property);
			});

		},
		initialize2: function() {

			// this.model.on('change', this.properties, this);

			console.log("OPEN PANEL EDIT QUIDD");
			console.log(this.model);
			var that = this;
			var template = _.template(TemplateQuidd, {
				title: "Set " + this.model.get("name"),
				quiddName: this.model.get("name"),
				properties: this.model.get("properties"),
				methods: this.model.get("methods")
			});
			$("#panelRight .content").html(template);
			views.global.openPanel();

			//generate slider for properties
			_.each(this.model.get("properties"), function(property) {
				var info = property.description["type description"];
				if(info.type == "float" || info.type == "int" || info.type == "double" || info.type == "uint") {

					var step = (info.type == "int" || info.type == "uint" ? 1 : (parseInt(info.maximum) - parseInt(info.minimum))/200);
					$("."+property.name).slider({
						range: "min",
					    value: property.value,
					    step: step,
					    min: parseInt(info.minimum),
					    max: parseInt(info.maximum),
					    slide: function(event, ui) {
					        $("[name='"+property.name+"']").val(ui.value);

					        that.setProperty({name : property.name, value : ui.value});
					  	}
					});
				}
			});
		},
		addProperty : function(property) {
			console.log("BIND");
			console.log(this.model.get("properties")[property]);
		},
		removeProperty : function(property) {

		}
	});

	return ViewQuiddEdit;
})