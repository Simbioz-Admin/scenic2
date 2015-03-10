// Filename: app.js
define(

  /** 
   *  View Source
   *  The source view is for each source type quiddity create whatsoever to control or transfer table
   *  @exports Views/Launch
   */

  [
    'underscore',
    'backbone',
    'jquery',
    'i18n',
    'collections/tables', 'collections/classes_doc', 'collections/destinationsRtp', 'collections/quidds', 'collections/destinationsProperties', 'collections/loggers', 'collections/users', 'collections/channels-irc',
    'views/destinations', 'views/global', 'views/quidds', 'views/destinationProperties', 'views/loggers', 'views/users/users', 'views/ircs', 'views/systemusage/sysmon', 'views/systemusage/Systemusage'

  ],

  function(
    _,
    Backbone,
    $,
    i18n,
    CollectionTables, CollectionClassesDoc, CollectionDestinationsRtp, CollectionQuidds, CollectionDestinationsProperties, CollectionLoggers, CollectionUsers, CollectionIrcs,
    ViewDestinations, ViewGlobal, ViewQuidds, ViewDestinationProperties, ViewLoggers, ViewUsers, ViewIrcs, ViewSysmon, ViewSystemUsage
  ) {

    /** 
     * @constructor
     * @requires Underscore
     * @requires Jquery
     * @requires CollectionTables
     * @requires CollectionClassesDoc
     * @requires CollectionDestinationsRtp
     * @requires CollectionQuidds 
     * @requires CollectionDestinationsProperties
     * @requires CollectionLoggers
     * @requires CollectionIrcs
     * @requires ViewDestinations
     * @requires ViewGlobal
     * @requires ViewQuidds
     * @requires ViewDestinationProperties
     * @requires ViewLoggers
     * @requires ViewIrcs
     * @requires ViewSysmon
     *  @augments module:Backbone.View
     */

    var initialize = function() {
      "use strict";


      //init translation
      i18n.init({
        lngWhitelist : ['en-US', 'en', 'fr', 'fr-FR'],
        cookieName : 'lang',
        ns: 'translation'
      }).done(function() {
          $('body').i18n();
      });

      $("#currentUser").html(config.nameComputer);

      //loading the different collections
      collections.classesDoc = new CollectionClassesDoc();
      collections.classesDoc.fetch({
        success: function(response) {

          //loading views
          views.quidds = new ViewQuidds({
            collection: collections.quidds
          });

          collections.quidds = new CollectionQuidds();

          collections.destinationsRtp = new CollectionDestinationsRtp();
          collections.destinationsRtp.fetch();

          collections.tables = new CollectionTables();

          collections.quidds.fetch({
            error: function(err) {
              console.log("error", err);
            },
            success: function() {

              collections.destinationProperties = new CollectionDestinationsProperties();
              collections.destinationProperties.fetch();

              collections.loggers = new CollectionLoggers();
              views.logger = new ViewLoggers({
                collection: collections.loggers
              });

              views.global = new ViewGlobal();
              //views.sysmon = new ViewSysmon();
              views.htop = new ViewSystemUsage();

              collections.irc = new CollectionIrcs();
              views.ircs = new ViewIrcs();

              views.destinationProperties = new ViewDestinationProperties({
                collection: collections.destinationProperties
              });


              views.users = new ViewUsers({
                collection: collections.users
              });
            }
          });



        }
      });


    }


    return {
      initialize: initialize
    };

  });