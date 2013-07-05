// Filename: panel.js
define([
  'underscore',
  'backbone',
  'jquery'
], function(_,  Backbone,  $)
{
  var initialize = function(){
    "use strict";


        $("#url").click(function()
        {
            socket.emit("openBrowser", true);
        });
          
        socket.emit("getPort", function(portSoap, portScenic)
        {
            $("[name=portSoap]").val(portSoap);
            $("[name=portScenic]").val(portScenic);
        });


        $("#startServer").click(function()
        {
            if ($('#startServer').is(':checked')) {
                console.log("CHECK");

                socket.emit("statusScenic", true, function(address)
                {
                    $("#msg").animate({"width" : 0}, 200);
                    $("#url").animate({"width" : 215}, 200);
                    console.log(address);
                    $(".address").html(address);
                });
            }
            else
            {
                console.log("uncheck");
                socket.emit("statusScenic", false , function(){});

                $("#url").animate({"width" : 0}, 200);
                $("#msg").delay(400).animate({"width" : 180}, 200);
            }
        });

        $("#form-config").submit(function(){

            var config = $("#form-config").serializeObject();

            if(config.username == "" )
            {
                 $("[name=username]").animate({borderColor : "red"}, 500).animate({borderColor : "#eee"}, 500).animate({borderColor : "red"}, 500).animate({borderColor : "#eee"}, 500);
            }
            else if(config.pass != "" && config.confirmPass == "" )
            {
                $("[name=confirmPass]").animate({borderColor : "red"}, 500).animate({borderColor : "#eee"}, 500).animate({borderColor : "red"}, 500).animate({borderColor : "#eee"}, 500);
            }
            else if(config.pass != config.confirmPass)
            {
                $("[name=pass], [name=confirmPass]").animate({borderColor : "red"}, 500).animate({borderColor : "#eee"}, 500).animate({borderColor : "red"}, 500).animate({borderColor : "#eee"}, 500);
            }
            else
            {
                console.log(config);

                socket.emit("setConfig", config, function()
                {
                    $("#btnServer").show().delay(100).animate({left : 80});
                    $("#config").animate({ marginLeft: 500});
                });

            }

            return false;
        });
  }

  return {
    initialize: initialize
  };

});

