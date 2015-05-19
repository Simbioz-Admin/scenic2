define(

  /** 
   *  View EditQuidd
   *  Manage interaction between a specifc node and the interface for editing
   *  all modification are detected when we press enter or switch input
   *  @exports Views/EditQuidd
   */

  [
    'underscore',
    'backbone',
    'text!../../templates/quidd.html', 'text!../../templates/quiddProperty.html', 'text!../../templates/quiddMethod.html'
  ],

  function(_, Backbone, TemplateQuidd, TemplateQuiddProperty, TemplateQuiddMethod) {


    /** 
     *  @constructor
     *  @requires Underscore
     *  @requires Backbone
     *  @requires TemplateQuidd
     *  @requires TemplateQuiddProperty
     *  @requires TemplateQuiddMethod
     *  @augments module:Backbone.View
     */


    var ViewQuiddEdit = Backbone.View.extend(


        /* Called when the value of a property changed (see in live the real value !) */

        updateValue: function(property) {


          //exeption for last midi value : need to show for have indication click on midi device
          if (property == "last-midi-value") {
            $(".preview-value").html("<div class='content-value'>" + value + "</div>");
          }

        },


        /* Called for set a method  */
        setMethod: function(element) {
          var that = this,
            method = $(element.target).attr("id"),
            methodArguments = [],
            nbArguments = $("[name='" + method + "']").length;

          $.each($("[name='" + method + "']"), function(i, method) {
            if ($(method).val()) methodArguments.push($(method).val());
          });

          console.log(nbArguments, methodArguments.length);

          if (nbArguments == methodArguments.length) {
            this.model.setMethod(method, methodArguments, function(ok) {});
          } else {
            console.log('a');
            views.global.notification("error", $.t("Missing some arguments of your method"));
          }
        }
      });


    return ViewQuiddEdit;
  })