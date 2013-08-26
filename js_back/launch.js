// Filename: panel.js
define([
  'underscore',
  'backbone',
  'jquery',
  'views/launch',
], function(_,  Backbone,  $, launchView)
{
  var initialize = function(){
    "use strict";
    views.launch = new launchView();

  }

  return {
    initialize: initialize
  };

});

