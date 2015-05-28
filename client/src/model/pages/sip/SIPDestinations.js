"use strict";

define( [
    'underscore',
    'backbone',
    'model/sip/Contact'
], function ( _, Backbone, Contact ) {

    /**
     * SIP Destinations
     *
     * @constructor
     * @extends module:Backbone.Collection
     */
    var SIPDestinations = Backbone.Collection.extend( {
        model: Contact,

        /**
         * Initialization
         * A property option is passed to the collection, this is the property that will be wrapped in this collection.
         * In that case it is the "destinations-json" property of the rtp quiddity, so that we can expose it as its
         * own collection to render/filter in the ui for example.
         *
         * @param models
         * @param options
         */
        initialize: function ( models, options ) {
            //this.quiddity = options.quiddity;
            //this.listenTo( this.quiddity.get( 'properties' ), 'update', this.updateProperty, this );
            //this.updateProperty();
        },

        updateProperty: function() {
            /*this.wrappedProperty = this.quiddity.get( 'properties' ).get( 'destinations-json' );
            if ( this.wrappedProperty ) {
                this.stopListening( this.quiddity.get( 'properties' ), 'update', this.updateProperty, this );
                this.listenTo( this.wrappedProperty, 'change', this.updateCollection, this );
                this.updateCollection();
            }*/
        },

        /**
         * Update the wrapper collection from the property value
         */
        /*updateCollection: function () {
            this.set( this.wrappedProperty.get( 'value' ).destinations );
        }*/
    } );

    return SIPDestinations;
} );
