define(
  /** 
   *	View ControlProperties
   *	Manage the event global (not associate to a model) for the properties in table control
   *	@exports Models/ControlProperties
   */
  [
    'underscore',
    'backbone',
    // 'text!../templates/connexion.html'
  ],

  function(_, Backbone) {
    /** 
     *	@constructor
     *  @requires Underscore
     *  @requires Backbone
     *  @augments module:Backbone.Model
     */

    var ConnexionView = Backbone.View.extend(
      /**
       *	@lends module: Views/connexion~ConnexionView.prototype
       */
      {
        // template: ConnexionTemplate,
        events: {},

        /* Called when the view ConnexionView is initialized */

        initialize: function() {},
      });
    return ConnexionView;
  });
