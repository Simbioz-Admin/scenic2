define(

  /** 
   *  View Source
   *  The source view is for each source type quiddity create whatsoever to control or transfer table
   *  @exports Views/Launch
   */

  [
    'underscore',
    'backbone'
  ],

  function(_, Backbone) {

    /** 
     *  @constructor
     *  @requires Underscore
     *  @requires Backbone
     */

    var SourceView = Backbone.View.extend(

      /**
       *  @lends module: Views/source~SourceView.prototype
       */

      {
        events: {},

        /* Called when en new source quiddity is created */

        initialize: function(options) {


        },

      });

    return SourceView;
  })