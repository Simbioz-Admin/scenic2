"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'app',
    'model/sip/Contact'
], function ( _, Backbone, socket, app, Contact ) {

    /**
     * SIP Contact Collection
     *
     * @constructor
     * @extends module:Backbone.Collection
     */
    var Contacts = Backbone.Collection.extend( {
        model:      Contact,

        /**
         * Initialize
         */
        initialize: function( models, options ) {
            this.sip = options.sip;

            // Watch the SIP quiddity as it is not always available on start
            this.quiddity = this.sip.get('quiddity');
            this.listenTo( this.sip, 'change:quiddity', this._onSipQuiddityChanged );
        },

        /**
         * Parse models
         * We do it here so that they have an id before getting merged
         * Parsing inside the Contact class led them to not have their id when it was needed
         *
         * We can't parse it server-side as this comes from the tree
         *
         * @param models
         * @param options
         * @returns {*}
         */
        parse: function(models, options) {
            _.each( models, function( model ) {
                model.id = model.uri;
                model.self = model.uri == options.self;
            });
            return models;
        },

        /**
         * When SIP Quiddity changes, setup a listener for tree changes
         * Trees are where contacts live ;)
         *
         * @private
         */
        _onSipQuiddityChanged: function( ) {
            if ( this.quiddity ) {
                this.stopListening( this.sip.get('quiddity'), 'change:tree', this._updateContactsFromTree );
            }
            this.quiddity = this.sip.get('quiddity');
            if ( this.quiddity ) {
                this.listenTo( this.sip.get( 'quiddity' ), 'change:tree', this._updateContactsFromTree );
            }
            // Check for current values (or not)
            this._updateContactsFromTree();
        },

        /**
         * The tree was changes, either merge with the existing contacts or reset the collection
         * if this was triggered because the SIP quiddity was removed
         *
         * @private
         */
        _updateContactsFromTree: function() {
            if ( this.quiddity ) {
                this.set( _.values( this.quiddity.get( 'tree' ).buddies ), {
                    self: this.quiddity.get( 'tree' ).self,
                    parse: true
                } );
            } else {
                this.reset();
            }
        }
    } );

    return Contacts;
} );
