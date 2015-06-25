var _    = require( 'underscore' );
var i18n = require( 'i18next' );

module.exports = {

    /**
     * Remove mappings by destination command
     *
     * @param destinationQuiddity
     * @param destinationProperty
     * @param {Function} cb Callback
     */
    execute: function ( destinationQuiddity, destinationProperty, cb ) {

        if ( _.isEmpty( destinationQuiddity ) ) {
            return cb( i18n.t( 'Missing destination quiddity parameter', {
                lng: this.lang
            } ) );
        } else if ( !_.isString( destinationQuiddity ) ) {
            return cb( i18n.t( 'Invalid destination quiddity (__destinationQuiddity__)', {
                lng: this.lang,
                destinationQuiddity: destinationQuiddity
            } ) );
        }

        if ( _.isEmpty( destinationProperty ) ) {
            return cb( i18n.t( 'Missing source quiddity parameter', {
                lng: this.lang
            } ) );
        } else if ( !_.isString( destinationProperty ) ) {
            return cb( i18n.t( 'Invalid destination property (__destinationProperty__)', {
                lng: this.lang,
                destinationProperty: destinationProperty
            } ) );
        }

        try {
            var removed = this.switcherController.controlManager.removeMappingsByDestination( destinationQuiddity, destinationProperty );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while removing mappings (__error__)', {
                lng:   this.lang,
                error: e.toString()
            } ) );
        }

        if ( !removed ) {
            return cb( i18n.t( 'Could not remove mappings', {
                lng:  this.lang
            } ) )
        }

        cb( null, removed );
    }
};