"use strict";

define( [
    'underscore',
    'backbone',
    'model/base/ScenicCollection',
    'model/sip/Contact'
], function ( _, Backbone, ScenicCollection, Contact ) {

    /**
     * SIP Contact Collection
     *
     * @constructor
     * @extends module:Backbone.Collection
     */
    var Contacts = Backbone.Collection.extend( {
        model:      Contact,
        comparator: function( contact ) {
            return this.sip.statuses.indexOf(contact.get('status')) + '.' + contact.get('name');
        },

        /**
         * Initialize
         */
        initialize: function( models, options ) {
            this.scenic = options.scenic;
            this.sip = options.sip;

            // Watch the SIP quiddity as it is not always available on start
            this.quiddity = this.sip.get('quiddity');

            // Watch for properties that trigger a re-sort
            this.listenTo( this, 'change:status change:name', this.sort );
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

        setSipQuiddity: function( sip ) {
            if ( this.quiddity ) {
                this.stopListening( this.sip.quiddity, 'change:tree', this._updateContactsFromTree );
            }
            this.quiddity = this.sip.quiddity;
            if ( this.quiddity ) {
                this.listenTo( this.sip.quiddity, 'change:tree', this._updateContactsFromTree );
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
                    scenic: this.scenic,
                    parse: true
                } );
            } else {
                this.reset();
            }
        }
    } );

    return Contacts;
} );
