var _    = require( 'underscore' );
var i18n = require( 'i18next' );

module.exports = {
    /**
     * Invoke method command
     *
     * @param {String} quiddityId Quiddity for which we want to retrieve the property description
     * @param {String} method  Method to invoke on the quiddity
     * @param {Array} args Array of arguments
     * @param {Function} cb Callback
     */
    execute: function ( quiddityId, method, args, cb ) {
        if ( _.isEmpty( quiddityId ) ) {
            return cb( i18n.t( 'Missing quiddity id parameter', {
                lng: this.lang
            } ) );
        } else if ( !_.isString( quiddityId ) ) {
            return cb( i18n.t( 'Invalid quiddity id (__quiddity__)', {
                lng: this.lang,
                quiddity: quiddityId
            } ) );
        }

        if ( _.isEmpty( method ) ) {
            return cb( i18n.t( 'Missing method parameter', {
                lng: this.lang
            } ) );
        } else if ( !_.isString( method ) ) {
            return cb( i18n.t( 'Invalid method (__property__)', {
                lng: this.lang,
                property: method
            } ) );
        }

        try {
            var result = this.switcherController.quiddityManager.invokeMethod( quiddityId, method, args );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while invoking method __method__ with arguments __args__ on quiddity __quiddity__ (__error__)', {
                lng: this.lang,
                quiddity: quiddityId,
                method:   method,
                args:     args,
                error:    e.toString()
            } ) );
        }

        if ( result == null ) {
            return cb( i18n.t( 'Could not invoke method __method__ with arguments __args__ on quiddity __quiddity__', {
                lng: this.lang,
                quiddity: quiddityId,
                method:   method,
                args:     args
            } ) );
        }

        cb( null, result );
    }
};