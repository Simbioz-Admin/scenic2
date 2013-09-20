define([
	'underscore',
	'backbone',
	'text!/templates/quidd.html', 'text!/templates/quiddProperty.html', 'text!/templates/quiddMethod.html'
], function(_, Backbone, TemplateQuidd, TemplateQuiddProperty, TemplateQuiddMethod) {

	var ViewQuiddEdit = Backbone.View.extend({
		// tagName: 'td',
		// className: 'nameInOut',
		events: {
			//'click h3' : 'test',
		 },
		initialize : function() {

			var that = this;

			//subscribe to remove and add from the model
			this.model.on('remove:property', this.removeProperty, this);
			this.model.on('add:property', this.addProperty, this);
			this.model.on('remove:method', this.removeMethod, this);
			this.model.on('add:method', this.addMethod, this);

			//generate template for receive properties and methods
			var template = _.template(TemplateQuidd, {
				title: "Set " + this.model.get("name"),
				quiddName: this.model.get("name"),
			});

			$(this.el).append(template);

			//add properties
			_.each(this.model.get("properties"),function(property) {
				that.addProperty(property.name);
			});

			//add methods
			_.each(this.model.get("methods"), function(method) {
				//console.log(method)
				that.addMethod(method.name);
			});

			$("#panelRight .content").html($(this.el));
			views.global.openPanel();

		},
		// initialize2: function() {

		// 	this.model.on('remove:property', this.removeProperty, this);
		// 	this.model.on('add:property', this.addProperty, this);

		// 	var that = this;
		// 	var template = _.template(TemplateQuidd, {
		// 		title: "Set " + this.model.get("name"),
		// 		quiddName: this.model.get("name"),
		// 		properties: this.model.get("properties"),
		// 		methods: this.model.get("methods")
		// 	});

		// 	$(this.el).append(template);

		// 	$("#panelRight .content").html($(this.el));
		// 	views.global.openPanel();

		// 	//generate slider for properties
		// 	_.each(this.model.get("properties"), function(property) {
		// 		var info = property;
		// 		if(info.type == "float" || info.type == "int" || info.type == "double" || info.type == "uint") {

		// 			var step = (info.type == "int" || info.type == "uint" ? 1 : (parseInt(info.maximum) - parseInt(info.minimum))/200);
		// 			$("."+property.name).slider({
		// 				range: "min",
		// 			    value: property.value,
		// 			    step: step,
		// 			    min: parseInt(info.minimum),
		// 			    max: parseInt(info.maximum),
		// 			    slide: function(event, ui) {
		// 			        $("[name='"+property.name+"']").val(ui.value);
		// 			        that.setProperty({name : property.name, value : ui.value});
		// 			  	}
		// 			});
		// 		}
		// 	});
		// },
		addProperty : function(property) {
			var prop = this.model.get("properties")[property];
			var templateProp = _.template(TemplateQuiddProperty, {property : prop});
			var that = this;
			//check position weight for place the property added
			this.addWithPositionWeight(prop["position weight"], templateProp);
			
			//generate slider
			if(prop.type == "float" || prop.type == "int" || prop.type == "double" || prop.type == "uint") {
				var step = (prop.type == "int" || prop.type == "uint" ? 1 : (parseInt(prop.maximum) - parseInt(prop.minimum))/200);
				$("."+prop.name, this.el).slider({
					range: "min",
				    value: prop["default value"],
				    step: step,
				    min: parseInt(prop.minimum),
				    max: parseInt(prop.maximum),
				    slide: function(event, ui) {
				        $("[name='"+prop.name+"']").val(ui.value);
				        that.model.setPropertyValue({name : prop.name, value : ui.value});
				  	}
				});
			}
		},
		removeProperty : function(property) {
			$("#"+property, this.el).remove();
		},
		addMethod : function(method) {
			var meth = this.model.get("methods")[method];
			var templateMeth = _.template(TemplateQuiddMethod, {method : meth});
			this.addWithPositionWeight(meth["position weight"], templateMeth);
		},
		removeMethod : function(method) {
			$("#"+method, this.el).remove();
		},
		addWithPositionWeight : function(weight, templateToAdd){
			var putAfter = null;
			$("[data-weight]", this.el).each(function(property, element) {
				if(weight > $(element).data("weight")) {
					putAfter = $(element);
				}
			});
			if(putAfter != null) {
				putAfter.after(templateToAdd);
			}
			else {
				$("#properties", this.el).prepend(templateToAdd);
			}
		}
	});

	return ViewQuiddEdit;
})