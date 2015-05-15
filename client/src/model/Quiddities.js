"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicCollection',
    'model/Quiddity'
], function ( _, Backbone, socket, ScenicCollection, Quiddity ) {

    /**
     *  @constructor
     *  @augments ScenicCollection
     */

    var Quiddities = ScenicCollection.extend( {
        model: Quiddity,
        methodMap:  {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   'get_quiddities'
        },

        ignoredQuiddities: [
            'dico',
            'create_remove_spy',
            'rtpsession',
            'logger',
            'runtime',
            'logger',
            'SOAPcontrolServer'
        ],

        /**
         * Initialize
         */
        initialize: function () {
            ScenicCollection.prototype.initialize.apply( this, arguments );
            socket.on( "create", _.bind( this._onCreate, this ) );
        },

        /**
         * Create Handler
         *
         * @param {Object} quiddity
         */
        _onCreate: function ( quiddity ) {
            if ( !_.contains( this.ignoredQuiddities, quiddity.class ) ) {
                this.add( quiddity, {merge: true} );
            }
        },


        //
        //
        //
        //
        //


        /**
         *  create a model quiddity and add to the collection Quidds in client side
         *  This function is executed on event create emitted by the server when switcher create a quiddity
         *  @param {object} quiddInfo object json with information about the quiddity (name, class, etc...)
         */

        create: function ( quiddInfo ) {
            var model = new Quiddity( quiddInfo );
            this.add( model );
            if ( quiddInfo.class != "sip" ) {
                views.global.notification( "info", model.get( "name" ) + " (" + model.get( "class" ) + ") " + $.t( 'is created' ) );
            }
            return model;
        },





        /**
         *  Ask to the server switcher the property value of a specific quiddity
         *  @param {string} Name of the quiddity
         *  @param {string} property The name of the property
         *  @param {function} callback callback to send the value
         */

        getPropertyValue: function ( quiddName, property, callback ) {
            socket.emit( "get_property_value", quiddName, property, function ( err, propertyValue ) {
                if ( err ) {
                    return views.global.notification( 'error', err );
                }
                callback( propertyValue );
            } );
        }
        ,

        /**
         *  Filter for get specific quidds of this collection
         */
        SelectQuidds: function ( category ) {

            var quidds = this.filter( function ( quidd ) {
                return quidd.get( "category" ) == category;
            } );

            return quidds;
        }
    } );

    return Quiddities;
} );