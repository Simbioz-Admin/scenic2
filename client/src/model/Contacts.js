"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicCollection',
    'model/Contact'
], function ( _, Backbone, socket, ScenicCollection, Contact ) {

    /**
     *  @constructor
     *  @augments ScenicCollection
     */
    var Contacts = ScenicCollection.extend( {
        model:      Contact,
        methodMap:  {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   'get_user_list'
        },

        initialize: function() {
            ScenicCollection.prototype.initialize.apply(this,arguments);
            socket.on( 'infoUser', _.bind( this._onUserInfo, this ) );
        },

        _onUserInfo: function( userInfo ) {
            this.add( userInfo, { merge: true } );
        }
    } );
    return Contacts;
} );
