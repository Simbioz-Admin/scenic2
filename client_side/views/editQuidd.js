define(

    /** 
     *	View EditQuidd
     *	Manage interaction between a specifc node and the interface for editing
     *	all modification are detected when we press enter or switch input
     *	@exports Views/EditQuidd
     */

    [
        'underscore',
        'backbone',
        'text!../../templates/quidd.html', 'text!../../templates/quiddProperty.html', 'text!../../templates/quiddMethod.html'
    ],

    function(_, Backbone, TemplateQuidd, TemplateQuiddProperty, TemplateQuiddMethod) {


        /** 
         *	@constructor
         *  @requires Underscore
         *  @requires Backbone
         *	@requires TemplateQuidd
         *	@requires TemplateQuiddProperty
         *	@requires TemplateQuiddMethod
         *  @augments module:Backbone.View
         */


        var ViewQuiddEdit = Backbone.View.extend(

            /**
             *	@lends module: Views/EditQuidd~ViewQuiddEdit.prototype
             */

            {

                events: {
                    "change input.property, select.property": "setProperty",
                    "click .setMethod": "setMethod",
                    "click input": "selectFocus",
                    "click #form-quidd, #title" : "handlePropagation"
                },

                /* Called when the view is initialized */

                initialize: function() {

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
                    _.each(this.model.get("properties"), function(property) {
                        that.addProperty(property.name);
                    });

                    //add methods
                    _.each(this.model.get("methods"), function(method) {
                        that.addMethod(method.name);
                    });

                    $("#panelRight").data("quiddName", this.model.get("name"));
                    $("#panelRight .content").html($(this.el));
                    views.global.openPanel();

                },
                handlePropagation: function handlePropagation(element) {
                    element.stopPropagation();
                },
                
                selectFocus: function selectFocus() {
                    event.target.select();
                },

                /* Called when a new method is added to the quiddity */

                addProperty: function(property) {
                    var prop = this.model.get("properties")[property],
                        that = this,
                        templateProp = _.template(TemplateQuiddProperty, {
                            property: prop
                        });

                    /* check position weight for place the property added */
                    //temporary add negative weight for started (need to be always on top)
                    if (prop.name == "started") prop["position weight"] = -1000;
                    this.addWithPositionWeight(prop["position weight"], templateProp);


                    /* generate slider for specific type of property */

                    if (prop.type == "float" || prop.type == "int" || prop.type == "double" || prop.type == "uint") {
                        prop["default value"] = prop["default value"].replace(",", ".");
                        var step = (prop.type == "int" || prop.type == "uint" ? 1 : (parseInt(prop.maximum) - parseInt(prop.minimum)) / 200);
                        $("." + prop.name, this.el).slider({
                            range: "min",
                            value: prop["default value"],
                            step: step,
                            min: parseInt(prop.minimum),
                            max: parseInt(prop.maximum),
                            slide: function(event, ui) {
                                $("[name='" + prop.name + "']").val(ui.value);
                                that.setProperty({
                                    name: prop.name,
                                    value: ui.value
                                });
                            }
                        });
                    }

                    /* add virtual button for send modification of property type string */
                    if (prop.type == "string") {
                        $("#btn-" + prop.name, this.el).on("click", function() {
                            $("." + prop.name, this.el).trigger($.Event('keypress', {
                                which: 13
                            }));
                        });
                    }
                },


                /*Called when a property is removed to the quiddity */

                removeProperty: function(property) {
                    $("#prop_" + property, this.el).remove();
                },


                /* Called when a new method is added to the quiddity */

                addMethod: function(method) {
                    var meth = this.model.get("methods")[method],
                        templateMeth = _.template(TemplateQuiddMethod, {
                            method: meth
                        });
                    this.addWithPositionWeight(meth["position weight"], templateMeth);
                },


                /* Called when a  method is removed to the quiddity */

                removeMethod: function(method) {
                    $("#" + method, this.el).remove();
                },


                /* Function use for place the new method or property on the editing interface */

                addWithPositionWeight: function(weight, templateToAdd) {
                    var putAfter = null;
                    $("[data-weight]", this.el).each(function(index, element) {
                        if (weight > $(element).data("weight")) {
                            putAfter = $(element);
                        }
                    });
                    if (putAfter != null) {
                        putAfter.after(templateToAdd);
                    } else {
                        $("#properties", this.el).prepend(templateToAdd);
                    }
                },


                /* Called for set the value of a property */

                setProperty: function(element) {

                    var that = this,
                        property = (element.target ? element.target.name : element.name),
                        value = (element.target ? element.target.value : element.value);

                    if ($(element.target).hasClass("checkbox"))
                        value = String(element.target.checked);

                    this.model.setPropertyValue(property, value, function() {});


                },


                /* Called when the value of a property changed (see in live the real value !) */

                updateValue: function(property) {

                    var value = this.model.get("properties")[property]["default value"];
                    var type = this.model.get("properties")[property]["type"];

                    if (type == "float" || type == "int" || type == "double" || type == "string" || type == "uint") {
                        $("." + property).slider('value', value);
                        $("[name='" + property + "']").val(value);
                    }
                    if (type == "boolean") {
                        $("[name='" + property + "']").prop("checked", value).val(value);
                        if (value == "false") $("[name='" + property + "']").removeAttr("checked");
                    }
                    if (type == "enum") {
                        $("[name='" + property + "']").val(value);
                    }

                    //exeption for last midi value : need to show for have indication click on midi device
                    if (property == "last-midi-value") {
                        $(".preview-value").html("<div class='content-value'>" + value + "</div>");
                    }

                },


                /* Called for set a method  */

                setMethod: function(element) {
                    var that = this,
                        method = $(element.target).attr("id"),
                        valueMethod = $("[name='" + method + "']").val();

                    if (method && valueMethod) {
                        this.model.setMethod(method, [valueMethod], function(ok) {});
                    } else {
                        views.global.notification("error", "error with set method value");
                    }
                }
            });

        return ViewQuiddEdit;
    })
