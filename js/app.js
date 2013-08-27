// Filename: app.js
define([
  'underscore',
  'backbone',
  'jquery',
  'collections/tables','collections/classes_doc','collections/clients', 'collections/quidds',
  'views/clients', 'views/global', 'views/quidds'

], function(_, 
          Backbone, 
          $,
          CollectionTables, CollectionClassesDoc, CollectionClients, CollectionQuidds, 
          ViewClients, ViewGlobal, ViewQuidds
  ){
  var initialize = function(){
    "use strict";

    //loading the different collections
    collections.classesDoc = new CollectionClassesDoc();
    collections.classesDoc.fetch({
      success : function(response)
      {
        collections.tables = new CollectionTables();
      }
    });

  
    collections.clients = new CollectionClients();
    collections.clients.fetch();
    
    collections.quidds = new CollectionQuidds();
    collections.quidds.fetch();

    //loading views
    views.clients = new ViewClients({collection : collections.clients});
    views.global = new ViewGlobal();
    views.quidds = new ViewQuidds({collection : collections.quidds});

  }


  return {
    initialize: initialize
  };

});

