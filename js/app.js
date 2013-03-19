// Filename: app.js
define([
  
  'underscore',
  'backbone',
  'jquery',
  'collections/classes_doc',
  'collections/quidds',
  'views/menu',
  'views/quidds',
  'views/shmdatas'

], function(_, Backbone, $, ClassesDocCollection, QuiddsCollection, MenuView, QuiddsView, shmdatasView){
  var initialize = function(){

    //init the different collection of the project
    collections.classesDoc = new ClassesDocCollection();
    collections.classesDoc.fetch({
      success : function(response){
        //Need to fetch collection before create view
        views.menu = new MenuView({collection : collections.classesDoc.getByCategory("source")});

      }
    });

    collections.quidds = new QuiddsCollection();
    collections.quidds.fetch({
      success : function(response){
        views.shmdatas = new shmdatasView({ collection : collections.quidds});
      }
    })
    views.quidds = new QuiddsView({collection : collections.classesDoc});
    //collections.quidds.create("audiotestsrc", "TestAudio", function(name){});
  }

  return {
    initialize: initialize
  };

});

