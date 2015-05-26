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
        initialize: function() {
            ScenicCollection.prototype.initialize.apply(this,arguments);

            // Handlers
            this.onSocket( 'contactInfo', _.bind( this._onUserInfo, this ) );
        },

        /**
         * User Info Handler
         *
         * @param userInfo
         * @private
         */
        _onUserInfo: function( userInfo ) {
            this.add( userInfo, { merge: true } );
        }
    } );
    return Contacts;
} );
