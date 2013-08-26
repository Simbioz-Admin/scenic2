// Filename: app.js
define([
  'underscore',
  'backbone',
  'jquery',
  'collections/classes_doc','collections/clients', 'collections/quidds',
  'views/clients', 'views/global', 'views/quidds'

], function(_, 
          Backbone, 
          $,
          ClassesDocCollection, ClientsCollection, QuiddsCollections, 
          ViewClients, ViewGlobal, ViewQuidds
  ){
  var initialize = function(){
    "use strict";

    //loading the different collections
    collections.classesDoc = new ClassesDocCollection();
    collections.classesDoc.fetch();
    collections.clients = new ClientsCollection();
    collections.clients.fetch();
    collections.quidds = new QuiddsCollections();
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

