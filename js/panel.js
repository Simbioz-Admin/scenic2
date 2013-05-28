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
        
        socket.on("TEST", function(test){ console.log(test)});    

        socket.on("sendPort", function(portSoap, portScenic)
        {
            console.log("PORT");
            $("#portSoap").val(portSoap);
            $("#portScenic").val(portScenic);
        });
        console.log("test")

        //choose for password
        $("#questionPass .yes").click(function()
        {
            $("#questionPass").animate({left : 340}, 300, function(){ $(this).remove()});
            $(".setPass").show().delay(300).animate({left : 80}, 300);

        });

        $("#questionPass .no").click(function(){
            $("#questionPass").animate({left : 340}, 300, function(){ $(this).remove()});
            $("#btnServer").show().delay(300).animate({left : 80});
        });

        $("#startServer").click(function()
        {
            if ($('#startServer').is(':checked')) {
                console.log("CHECK");

                socket.emit("statusScenic", true, function(address)
                {
                    $("#msg").animate({"width" : 0}, 200);
                    $("#url").animate({"width" : 215}, 200);
                    console.log($(".address").html(address));
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

        $("#submitPass").click(function(){
            if($("#username").val() == "")
            {
                 $("#username").animate({borderColor : "red"}, 500).animate({borderColor : "#eee"}, 500).animate({borderColor : "red"}, 500).animate({borderColor : "#eee"}, 500);
            }
            else if($("#inputPass").val() == "")
            {
                $("#inputPass").animate({borderColor : "red"}, 500).animate({borderColor : "#eee"}, 500).animate({borderColor : "red"}, 500).animate({borderColor : "#eee"}, 500);
            }
            else if($("#inputConfirmPass").val() == "" )
            {
                 $("#inputConfirmPass").animate({borderColor : "red"}, 500).animate({borderColor : "#eee"}, 500).animate({borderColor : "red"}, 500).animate({borderColor : "#eee"}, 500);
            }else if($("#inputPass").val() != $("#inputConfirmPass").val())
            {
                alert("password different");
            }else
            {
            console.log($("#username").val(), $("#inputPass").val(), $("#inputConfirmPass").val());
                socket.emit("setPass", $("#username").val(),  $("#inputPass").val(), function()
                {
                    $(".setPass").animate({left : 340}, 300, function(){ $(this).remove()});
                    $("#btnServer").show().delay(300).animate({left : 80});
                });
            }

            return false;
        });
  }

  return {
    initialize: initialize
  };

});

