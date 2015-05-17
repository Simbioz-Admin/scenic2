"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicModel'
], function ( _, Backbone, socket, ScenicModel ) {

    /**
     * Shmdata
     *
     * @constructor
     * @extends ScenicModel
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
         *  Initialize
         */

        initialize: function () {
            ScenicModel.prototype.initialize.apply(this,arguments);

            //TODO: LEGACY Listens to quiddity removal to removel ourself
            if ( this.get( "quidd" ) ) {
                //TODO: app.quiddities.get( this.model.get( "quidd" ) ).on( "remove", this.removeModel, this );
            }

            // Handlers
            this.onSocket( 'removeShmdata', _.bind( this._onRemoved, this ) );
            this.onSocket( "signals_properties_value", _.bind( this._onSignalsPropertiesValue, this ) );
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
         *  @private
         */
        _onSignalsPropertiesValue: function ( quiddName, prop, value ) {
            if ( prop == "byte-rate" && quiddName.indexOf('vumeter_') == 0 ) {
                var shmdataName = quiddName.replace( "vumeter_", "" );
                if ( shmdataName == this.id ) {
                    this.set( 'byteRate', value );
                }
            }
        },





        //  ██╗     ███████╗ ██████╗  █████╗  ██████╗██╗   ██╗
        //  ██║     ██╔════╝██╔════╝ ██╔══██╗██╔════╝╚██╗ ██╔╝
        //  ██║     █████╗  ██║  ███╗███████║██║      ╚████╔╝
        //  ██║     ██╔══╝  ██║   ██║██╔══██║██║       ╚██╔╝
        //  ███████╗███████╗╚██████╔╝██║  ██║╚██████╗   ██║
        //  ╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝   ╚═╝
        //

        /**
         * If this is a shmdata for a sipquidd, this will provide the sip user parsed from the shmdata name
         */
        /*getSipUser: function () {
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
        }*/
    } );
    return Shmdata;
} );