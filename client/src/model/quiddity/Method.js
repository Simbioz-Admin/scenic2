"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicModel',
    'model/quiddity/method/Arguments'
], function ( _, Backbone, socket, ScenicModel, Arguments ) {

    /**
     *  @constructor
     *  @augments ScenicModel
     */

    var Method = ScenicModel.extend( {
        idAttribute: 'name',
        defaults:    {
            'name':               null,
            'long name':          null,
            'description':        null,
            'return description': null,
            'return type':        null,
            'position category':  null,
            'position weight':    0,
            arguments:            new Arguments()
        },

        methodMap: {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   function () {
                return ['getMethodDescription', this.collection.quiddity.id, this.get('name')]
            }
        },

        parse: function( response ) {
            //Parse arguments into a collection
            response.arguments = new Arguments( response.arguments );
            return response;
        },

        initialize:  function () {
            ScenicModel.prototype.initialize.apply( this, arguments );

            socket.on( "signals_properties_info", _.bind( this._onSignalsPropertiesInfo, this ) );
        },

        /**
         * Signals Property Info Handler
         *
         * @param {string} signal The type of event on property or method
         * @param {string} quiddityId The name of the quiddity
         * @param {string} name The name of the property or method
         */
        _onSignalsPropertiesInfo: function ( signal, quiddityId, name ) {
            if ( signal == "on-method-removed" && this.quiddity.id == quiddityId &&  this.get('name') == name[0] ) {
                this.trigger( 'destroy', this, this.collection );
            }
        },

        /**
         * Invoke method
         *
         * @param args
         * @param callback
         */
        invoke: function( args, callback ) {
            socket.emit( 'invokeMethod', this.collection.quiddity.id, this.get('name'), args, callback );
        }
    } );
    return Method;
} )
;