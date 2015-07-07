"use strict";

define( [
    // Lib
    'underscore',
    'backbone',
    'marionette',
    // Template
    'text!template/shutdown.html'
], function ( _, Backbone, Marionette, ShutdownTemplate ) {

    /**
     * @constructor
     * @augments module:Marionette.ItemView
     */
    var ShutdownView = Marionette.ItemView.extend( {
        template: _.template( ShutdownTemplate ),
        el:       'body',

        initialize: function ( ) {}
    } );
    return ShutdownView;
} );
