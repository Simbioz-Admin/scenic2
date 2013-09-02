// Filename: app.js
define([
  'underscore',
  'backbone',
  'jquery',
  'collections/classes_doc',
  'collections/tables',
  'collections/quidds',
  'collections/shmdatas',
  'collections/clients',
  'views/global',
  'views/quidds',
  'views/methods',
  'collections/channels-irc',
  'views/destinations'

], function(_, 
          Backbone, 
          $, 
          ClassesDocCollection,
          TablesCollection,
          QuiddsCollection, 
          ShmdatasCollection, 
          ClientsCollection, 
          GlobalView,
          QuiddsView, 
          MethodsView, 
          ChannelsCollection, 
          DestinationsView
  ){
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

                //init the collections Table and 
            collections.tables = new TablesCollection();
            //views.tables = new TablesView({collection : collections.tables});

    collections.clients = new ClientsCollection();
    collections.clients.fetch
    ({
      success : function(response)
      {
        collections.clients.render();
        views.destinations = new DestinationsView({ collection : collections.clients });

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
      },
      error : function(res)
      {
        console.log(res);
        console.log("error fetch destinations");
      }
    });


    collections.irc = new ChannelsCollection();

    views.methods = new MethodsView();
  }
  var test = function()
  {
    console.log("TEST");
  }

  return {
    initialize: initialize,
    test : test
  };

});

