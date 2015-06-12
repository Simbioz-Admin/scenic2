var _    = require( 'underscore' );
var i18n = require( 'i18next' );

module.exports = {
    /**
     * Get property description command
     *
     * @param {String} quiddityId Quiddity for which we want to retrieve the property description
     * @param {String} property Property for which we want the description
     * @param {Function} cb Callback
     */
    execute: function ( quiddityId, property, cb ) {
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

        if ( _.isEmpty( property ) ) {
            return cb( i18n.t( 'Missing property parameter', {
                lng: this.lang
            } ) );
        } else if ( !_.isString( property ) ) {
            return cb( i18n.t( 'Invalid property (__property__)', {
                lng: this.lang,
                property: property
            } ) );
        }

        try {
            var propertyDescription = this.switcherController.quiddityManager.getPropertyDescription( quiddityId, property );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while getting property description for property __property__ on quiddity __quiddity__ (__error__)', {
                lng: this.lang,
                quiddity: quiddityId,
                property: property,
                error:    e.toString()
            } ) );
        }
        cb( null, propertyDescription );
    }
};