"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicModel',
    'model/quiddity/method/Arguments'
], function ( _, Backbone, socket, ScenicModel, Arguments ) {

    /**
     * Quiddity Method
     *
     * @constructor
     * @extends ScenicModel
     */
    var Method = ScenicModel.extend( {
        defaults:  function () {
            return {
                'name':              null,
                'description':       null,
                'returnDescription': null,
                'returnType':        null,
                'order':             0,
                'args':              new Arguments()
            }
        },
        methodMap: {
            'create': null,
            'update': null,
            'patch':  null,
            'delete': null,
            'read':   function () {
                return ['getMethodDescription', this.collection.quiddity.id, this.id]
            }
        },

        /**
         * Parse
         *
         * @param response
         * @returns {*}
         */
        parse: function ( response ) {
            //Parse arguments into a collection
            response.args = new Arguments( response.args );
            return response;
        },

        /**
         * Initialize
         */
        initialize: function () {
            ScenicModel.prototype.initialize.apply( this, arguments );

            // Handlers
            this.onSocket( "signals_properties_info", _.bind( this._onSignalsPropertiesInfo, this ) );
        },

        /**
         * Signals Property Info Handler
         * Listens to method removal concerning our parent quiddity and destroy this method if it matches
         *
         * @param {string} quiddityId The name of the quiddity
         * @param {string} signal The type of event on property or method
         * @param {string} name The name of the property or method
         */
        _onSignalsPropertiesInfo: function ( quiddityId, signal, name ) {
            if ( signal == "on-method-removed" && this.collection.quiddity.id == quiddityId && this.id == name ) {
                this.get( 'args' ).destroy();
                this.trigger( 'destroy', this, this.collection );
            }
        },

        /**
         * Invoke method
         *
         * @param args
         * @param callback
         */
        invoke: function ( args, callback ) {
            socket.emit( 'invokeMethod', this.collection.quiddity.id, this.id, args, callback );
        }
    } );

    return Method;
} )
;