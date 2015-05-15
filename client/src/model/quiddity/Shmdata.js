"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicModel'
], function ( _, Backbone, socket, ScenicModel ) {

    /**
     *  @constructor
     *  @augments ScenicModel
     */

    var Shmdata = ScenicModel.extend( {
        idAttribute: "path",
        defaults:    {
            path:     null,
            quidd:    null,
            byteRate: 0,
            category: null,
            type:     null
        },

        /**
         *  Function executed when the model quiddity is created
         *  It's used for created a view associate to the model
         *  This view need to know if it's in table controler or transfer and if it's a source or destination
         */

        initialize: function () {
            ScenicModel.prototype.initialize.apply(this,arguments);

            /* listen if the quidd is removed */
            if ( this.get( "quidd" ) ) {
                collections.quiddities.get( this.get( "quidd" ) ).on( "remove", this.removeModel, this );
            }

            socket.on( 'removeShmdata', _.bind( this._onRemove, this ) );

            /** Event called when the value of a property changes */
            socket.on( "signals_properties_value", _.bind( this._onSignalsPropertiesValue, this ) );
        },

        /**
         * Shmdata Remove Handler
         *
         * @param qname
         * @param shmdata
         * @private
         */
        _onRemoved: function ( qname, shmdata ) {
            if ( shmdata.path == this.id ) {
                this.trigger( 'destroy', this, this.collection );
            }
        },

        /**
         *  Signals Property Value Handler
         *
         *  @param {string} quiddName The name of the quiddity
         *  @param {string} prop The name of the property or method
         *  @param {string} value The value of the property
         */
        _onSignalsPropertiesValue: function ( quiddName, prop, value ) {
            if ( prop == "byte-rate" && quiddName.indexOf('vumeter_') == 0 ) {
                var shmdataName = quiddName.replace( "vumeter_", "" );
                if ( shmdataName == this.id ) {
                    this.set( 'byteRate', value );
                }
            }
        },





        //
        //
        //
        //


        removeModel: function () {
            console.log( "Remove Shmdata" );
            this.trigger( "destroy", this );
        },

        /**
         * If this is a shmdata for a sipquidd, this will provide the sip user parsed from the shmdata name
         */
        getSipUser: function () {
            var sipUser = null;
            if ( this.get( 'quidd' ) == config.sip.quiddName ) {
                var parts     = this.get( 'path' ).replace( 'vumeter_', '' ).split( '_' );
                var name      = parts[parts.length - 2];
                var sipPrefix = config.sip.quiddName + '-';
                if ( name.indexOf( sipPrefix ) == 0 ) {
                    sipUser = name.substr( sipPrefix.length );
                }
            }
            return sipUser;
        }
    } );
    return Shmdata;
} );