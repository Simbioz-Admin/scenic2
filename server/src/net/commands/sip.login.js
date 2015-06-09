var _ = require('underscore');
var i18n = require('i18next');

module.exports = {

    /**
     * SIP Login Command
     *
     * @param {Object} credentials - Object containing the login credentials
     * @param {Function} cb - Callback
     */
    execute: function( credentials, cb ) {

        if ( !credentials ) {
            return cb( i18n.t( 'Missing credentials', {
                lng: this.lang
            } ) );
        }

        if ( !credentials.server ) {
            return cb( i18n.t( 'Missing server', {
                lng: this.lang
            } ) );
        } else if ( !_.isString( credentials.server ) ) {
            return cb( i18n.t( 'Invalid server: __server__', {
                lng: this.lang,
                server: credentials.server
            } ) );
        }

        if ( !credentials.user ) {
            return cb( i18n.t( 'Missing user', {
                lng: this.lang
            } ) );
        } else if ( !_.isString( credentials.user ) ) {
            return cb( i18n.t( 'Invalid user: __user__', {
                lng: this.lang,
                user: credentials.user
            } ) );
        }

        if ( !credentials.password ) {
            return cb( i18n.t( 'Missing password', {
                lng: this.lang
            } ) );
        } else if ( !_.isString( credentials.password ) ) {
            return cb( i18n.t( 'Invalid password', {
                lng: this.lang
            } ) );
        }

        if ( credentials.port ) {
            if ( isNaN( parseInt( credentials.port ) ) ) {
                return cb( i18n.t( 'Invalid SIP Port __port__', {
                    lng: this.lang,
                    port: credentials.port
                } ) );
            }
        }

        try {
            var success = this.switcherController.sipManager.login( credentials );
        } catch( e ) {
            return cb( i18n.t('An error occurred while logging into SIP (__error__)', {
                lng: this.lang,
                error: e.toString()
            }));
        }

        if ( !success ) {
            return cb( i18n.t('Could not log into SIP', {
                lng: this.lang
            }));
        }

        cb();
    }
};