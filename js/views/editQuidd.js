define([
	'underscore',
	'backbone',
	'text!/templates/quidd.html', 'text!/templates/quiddProperty.html', 'text!/templates/quiddMethod.html'
], function(_, Backbone, TemplateQuidd, TemplateQuiddProperty, TemplateQuiddMethod) {

	var ViewQuiddEdit = Backbone.View.extend({
		// tagName: 'td',
		// className: 'nameInOut',
		events: {
			"change input.property, select.property": "setProperty",
		 },
		initialize : function() {

			var that = this;

			//subscribe to remove and add from the model
			this.model.on('remove:property', this.removeProperty, this);
			this.model.on('add:property', this.addProperty, this);
			this.model.on('remove:method', this.removeMethod, this);
			this.model.on('add:method', this.addMethod, this);
			this.model.on("update:value", this.updateValue, this);
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
				       that.setProperty({name : prop.name, value : ui.value});
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
		},
		setProperty: function(element) {
			
			var that = this
			,	property = (element.target ? element.target.name : element.name)
			,	value = (element.target ? element.target.value : element.value);

			if($(element.target).hasClass("checkbox"))
				value = String(element.target.checked);

			this.model.setPropertyValue(property, value, function() {
				// 	//make confirmation message set attributes ok
				// 	//console.log("the property  :", property, "with value : ", value, "has set!");
				// if (property == "started") {
				// 	that.getPropertiesAndMethods(model);
				// }
			});
		

		},
		updateValue : function(property) {
			var value = this.model.get("properties")[property]["default value"];
			var type = this.model.get("properties")[property]["type"];
			
			if(type == "float" || type == "int" || type == "double" || type == "string" || type == "uint") {
				$("."+property).slider('value', value);
				$("[name='"+property+"']").val(value);
			}
			if(type == "boolean") {	
				$("[name='"+property+"']").prop("checked", value).val(value);
				if(value == "false") $("[name='"+property+"']").removeAttr("checked");
			}
			console.log(type);
			if(type == "enum") {
				console.log("enum", value);
			}
			
		}
	});

	return ViewQuiddEdit;
})