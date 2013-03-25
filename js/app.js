// Filename: app.js
define([
  
  'underscore',
  'backbone',
  'jquery',
  'collections/classes_doc',
  'collections/quidds',
  'collections/destinations',
  'views/menu',
  'views/quidds',
  'views/methods',
  'views/shmdatas',
  'views/destinations'

], function(_, Backbone, $, ClassesDocCollection, QuiddsCollection, DestinationsCollection, MenuView, QuiddsView, MethodsView, shmdatasView, DestinationsView){
  var initialize = function(){

    //*** init the different collection of the project ***//

    //the colelction classesDoc contain all informations about the different quiddities existing with switcher and there properties
    collections.classesDoc = new ClassesDocCollection();
    collections.classesDoc.fetch({
      success : function(response){
        //Need to fetch collection before create view
        views.menu = new MenuView({collection : collections.classesDoc.getByCategory("source")});

      }
    });

    //init the Collections of quidd where is stocked all informations about the quidds existing.
    collections.quidds = new QuiddsCollection();
    collections.quidds.fetch({
      success : function(response){
        views.shmdatas = new shmdatasView({ collection : collections.quidds});
        collections.destinations = new DestinationsCollection();
        collections.destinations.fetch({
          success : function(response){
            views.destinations = new DestinationsView({ collection : collections.destinations });
          }
        });
      }
    });

    views.quidds = new QuiddsView({collection : collections.classesDoc});
    views.methods = new MethodsView();
  }

  return {
    initialize: initialize
  };

});

