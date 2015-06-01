"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicCollection',
    'model/sip/Contact'
], function ( _, Backbone, socket, ScenicCollection, Contact ) {

    /**
     * SIP Contact Collection
     *
     * @constructor
     * @extends ScenicCollection
     */
    var Contacts = ScenicCollection.extend( {
        model:      Contact,
        methodMap:  {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   'getContacts'
        },

        /**
         * Initialize
         */
        initialize: function( options ) {
            ScenicCollection.prototype.initialize.apply(this,arguments);

            this.sip = options.sip;

            // Handlers
            this.onSocket( 'contactInfo', _.bind( this._onContactInfo, this ) );
        },

        /**
         * Contact Info Handler
         *
         * @param userInfo
         * @private
         */
        _onContactInfo: function( userInfo ) {
            this.add( userInfo, { merge: true } );
        }
    } );
    return Contacts;
} );
