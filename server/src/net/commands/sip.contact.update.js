var _    = require( 'underscore' );
var i18n = require( 'i18next' );

module.exports = {
    /**
     * Add contact command
     *
     * @param {String} uri - URI of the contacts
     * @param {Object} info - Object containing the information to update
     * @param {Function} cb Callback
     */
    execute: function ( uri, info, cb ) {
        if ( _.isEmpty( uri ) ) {
            return cb( i18n.t( 'Missing uri parameter', {
                lng: this.lang
            } ) );
        } else if ( !_.isString( uri ) ) {
            return cb( i18n.t( 'Invalid uri (__uri__)', {
                lng: this.lang,
                uri: uri
            } ) );
        }

        if ( _.isEmpty( info ) ) {
            return cb( i18n.t( 'Missing info parameter', {
                lng: this.lang
            } ) );
        } else if ( !_.isObject( info ) || _.isArray( info ) ) {
            return cb( i18n.t( 'Invalid info parameter (__info__)', {
                lng:  this.lang,
                info: info
            } ) );
        }

        try {
            var updated = this.switcherController.sipManager.updateContact( uri, info );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while updating contact __uri__ (__error__)', {
                lng:   this.lang,
                uri:   uri,
                error: e.toString()
            } ) );
        }

        if ( !updated ) {
            return cb( i18n.t( 'Could not update contact __uri__', {
                lng:  this.lang,
                uri:  uri
            } ) )
        }

        cb( null, updated );
    }
};