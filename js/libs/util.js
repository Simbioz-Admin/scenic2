define(["jquery",  'underscore', 'jqueryui'], // Require jquery
       function($, _){

        //transform serializeArray to JSON format
        $.fn.serializeObject = function()
        {
            var o = {};
            var a = this.serializeArray();
            
            /* Because serializeArray() ignores unset checkboxes and radio buttons: */
            a = a.concat(
                $('#form-quidd input[type=checkbox]:not(:checked)').map(
                    function() {
                        return {"name": this.name, "value": this.value}
                    }).get()
            );
            $.each(a, function() {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        };

        //close lightbox
        $(document).on("click", "#close, #bgLightbox", function(){
            $("#lightBox, #bgLightbox").fadeOut(200);
        });

        // define tooltip global with jquery UI
        $(document).tooltip({
            track: true,
            content: function() {
                var element = $(this);
                return element.attr("title");
                
            }
        });


        //******** MIXIN for Underscore *******//
        _.mixin({
          // ### _.objMap
          // _.map for objects, keeps key/value associations
          objMap: function (input, mapper, context) {
            return _.reduce(input, function (obj, v, k) {
                     obj[k] = mapper.call(context, v, k, input);
                     return obj;
                   }, {}, context);
          },
          // ### _.objFilter
          // _.filter for objects, keeps key/value associations
          // but only includes the properties that pass test().
          objFilter: function (input, test, context) {
            return _.reduce(input, function (obj, v, k) {
                     if (test.call(context, v, k, input)) {
                       obj[k] = v;
                     }
                     return obj;
                   }, {}, context);
          },
          // ### _.objReject
          //
          // _.reject for objects, keeps key/value associations
          // but does not include the properties that pass test().
          objReject: function (input, test, context) {
            return _.reduce(input, function (obj, v, k) {
                     if (!test.call(context, v, k, input)) {
                       obj[k] = v;
                     }
                     return obj;
                   }, {}, context);
          }
        });
});


