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
  'collections/channels-irc',
  'views/destinations'

], function(_, 
          Backbone, 
          $, 
          ClassesDocCollection, 
          QuiddsCollection, 
          ShmdatasCollection, 
          DestinationsCollection, 
          GlobalView, 
          QuiddsView, 
          MethodsView, 
          ChannelsCollection, 
          DestinationsView
  ){
  var initialize = function(){
    "use strict";

    //recovery config information from the server
    socket.emit("getConfig", function(configServer) { config = configServer; });
    

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

  return {
    initialize: initialize
  };

});

