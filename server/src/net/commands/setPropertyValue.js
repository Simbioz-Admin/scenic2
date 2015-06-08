var _    = require( 'underscore' );
var i18n = require( 'i18next' );

module.exports = {
    /**
     * Set property value command
     *
     * @param {String} quiddityId Quiddity for which we want to retrieve the property description
     * @param {String} property Property for which we want the description
     * @param {*} value Value to set the property to
     * @param {Function} cb Callback
     */
    execute: function ( quiddityId, property, value, cb ) {
        if ( _.isEmpty( quiddityId ) ) {
            return cb( i18n.t( 'Missing quiddity id parameter' ) );
        } else if ( !_.isString( quiddityId ) ) {
            return cb( i18n.t( 'Invalid quiddity id (__quiddity__)', {quiddity: quiddityId} ) );
        }

        if ( _.isEmpty( property ) ) {
            return cb( i18n.t( 'Missing property parameter' ) );
        } else if ( !_.isString( property ) ) {
            return cb( i18n.t( 'Invalid property (__property__)', {property: property} ) );
        }

        try {
            var result = this.switcherController.quiddityManager.setPropertyValue( quiddityId, property, value );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while setting value of property __property__ to __value__ on quiddity __quiddity__ (__error__)', {
                quiddity: quiddityId,
                property: property,
                value:    value,
                error:    e.toString()
            } ) );
        }

        if ( !result ) {
            return cb( i18n.t( 'Could not set property value of property __property__ to __value__ on quiddity __quiddity__' ) );
        }

        cb();
    }
};