// Filename: app.js
define([
  
  'underscore',
  'backbone',
  'jquery',
  'collections/classes_doc',
  'collections/quidds',
  'collections/shmdatas',
  'collections/destinations',
  'views/global',
  'views/quidds',
  'views/methods',
  'views/irc',
  'views/destinations'

], function(_, Backbone, $, ClassesDocCollection, QuiddsCollection, ShmdatasCollection, DestinationsCollection, GlobalView, QuiddsView, MethodsView, IrcView, DestinationsView){
  var initialize = function(){
    "use strict";

  
    //*** init the different collection of the project ***//

    //the colelction classesDoc contain all informations about the different quiddities existing with switcher and there properties
    collections.classesDoc = new ClassesDocCollection();
    collections.classesDoc.fetch({
      success : function(response)
      {
        //Need to fetch collection before create view
        views.global = new GlobalView({collection : collections.classesDoc.getByCategory("source")});
      }
    });



   collections.destinations = new DestinationsCollection();
      collections.destinations.fetch
      ({
        success : function(response)
        {
          collections.destinations.render();
          views.destinations = new DestinationsView({ collection : collections.destinations });

          //init the Collections of quidd where is stocked all informations about the quidds existing.
          collections.quidds = new QuiddsCollection();
          collections.quidds.fetch
          ({
            success : function(response)
            {
              //collections.quidds.render();
              views.quidds = new QuiddsView({collection : collections.quidds});
            }
          });
        }
      });



    views.methods = new MethodsView();
    views.irc = new IrcView();
  }

  return {
    initialize: initialize
  };

});

