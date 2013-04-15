define(["jquery", "jqueryui"], // Require jquery
       function($){

        //transform serializeArray to JSON format
        $.fn.serializeObject = function()
        {
            var o = {};
            var a = this.serializeArray();
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

        //define tooltip global with jquery UI
        $(document).tooltip({
            track: true,
            content: function() {
                var element = $(this);
                return element.attr("title");
                
            }
        });

          $.fn.rotateTableCellContent = function (options) {
          /*
          Version 1.0
          7/2011
          Written by David Votrubec (davidjs.com) and
          Michal Tehnik (@Mictech) for ST-Software.com
          */
         
                var cssClass = ((options) ? options.className : false) || "vertical";
                var cellsToRotate = $('.' + cssClass, this);
         
                var betterCells = [];
                    console.log(cellsToRotate);
                cellsToRotate.each(function () {
                    var cell = $(this)
                  , newText = cell.text()
                  , height = cell.height()
                  , width = cell.width()
                  , newDiv = $('<div style="">', { height: width, width: height})
                  , newInnerDiv = $('<div>', { text: newText, 'class': 'rotated' });
         
                    newDiv.append(newInnerDiv);
         
                    betterCells.push(newDiv);
                });
         
                cellsToRotate.each(function (i) {
                    $(this).html(betterCells[i]);
                });
            };

});


