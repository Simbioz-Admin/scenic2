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
            'read':   function () { return ['getMethodDescription', this.collection.quiddity.id, this.get('name')] }
        },

        /**
         * Parse
         *
         * @param response
         * @returns {*}
         */
        parse: function( response ) {
            //Parse arguments into a collection
            response.arguments = new Arguments( response.arguments );
            return response;
        },

        /**
         * Initialize
         */
        initialize:  function () {
            ScenicModel.prototype.initialize.apply( this, arguments );

            // Handlers
            socket.on( "signals_properties_info", _.bind( this._onSignalsPropertiesInfo, this ) );
        },

        /**
         * Signals Property Info Handler
         * Listens to method removal concerning our parent quiddity and destroy this method if it matches
         *
         * @param {string} signal The type of event on property or method
         * @param {string} quiddityId The name of the quiddity
         * @param {string} name The name of the property or method
         */
        _onSignalsPropertiesInfo: function ( signal, quiddityId, name ) {
            if ( signal == "on-method-removed" && this.collection.quiddity.id == quiddityId &&  this.get('name') == name[0] ) {
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