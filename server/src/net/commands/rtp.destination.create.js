var _               = require( 'underscore' );
var i18n            = require( 'i18next' );
var NameExistsError = require( '../../exceptions/NameExistsError' );
var InvalidHostError = require( '../../exceptions/InvalidHostError' );
var InvalidPortError = require('../../exceptions/InvalidPortError');


module.exports = {
    /**
     * Create an RTP Destination
     *
     * @param {string} name - Destination name
     * @param {string} host - Hostname or ip address
     * @param {int} port - SOAP port of the destination
     * @param {Function} cb - Callback
     */
    execute: function ( name, host, port, cb ) {

        if ( _.isEmpty( name ) ) {
            return cb( i18n.t( 'Missing name parameter', {
                lng: this.lang
            } ) );
        } else if ( !_.isString( name ) ) {
            return cb( i18n.t( 'Invalid name (__name__)', {
                lng:  this.lang,
                name: name
            } ) );
        }

        if ( _.isEmpty( host ) ) {
            return cb( i18n.t( 'Missing host parameter', {
                lng: this.lang
            } ) );
        } else if ( !_.isString( host ) ) {
            return cb( i18n.t( 'Invalid host (__host__)', {
                lng:  this.lang,
                host: host
            } ) );
        }

        if ( port && isNaN( parseInt( port ) ) ) {
            return cb( i18n.t( 'Invalid port (__port__)', {
                lng:  this.lang,
                port: port
            } ) );
        }

        try {
            var created = this.switcherController.rtpManager.createRTPDestination( name, host, port );
        } catch ( e ) {
            if ( e instanceof InvalidHostError ) {
                return cb( i18n.t( 'Invalid host "__host__"', {
                    lng:  this.lang,
                    host: host
                } ) );
            } else if ( e instanceof NameExistsError ) {
                return cb( i18n.t( 'RTP Destination name "__name__" already exists', {
                    lng:  this.lang,
                    name: name
                } ) );
            } else {
                return cb( i18n.t( 'An error occurred while creating RTP destination "__name__" (__error__)', {
                    lng:   this.lang,
                    name:  name,
                    error: e.toString()
                } ) );
            }
        }

        if ( !created ) {
            return cb( i18n.t( 'Could not create RTP destination "__name__"', {
                lng:  this.lang,
                name: name
            } ) )
        }

        cb( null, created );
    }
};