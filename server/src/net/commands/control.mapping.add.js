var _    = require( 'underscore' );
var i18n = require( 'i18next' );

module.exports = {

    /**
     * Add mapping command
     *
     * @param sourceQuiddity
     * @param sourceProperty
     * @param destinationQuiddity
     * @param destinationProperty
     * @param {Function} cb Callback
     */
    execute: function ( sourceQuiddity, sourceProperty, destinationQuiddity, destinationProperty, cb ) {
        if ( _.isEmpty( sourceQuiddity ) ) {
            return cb( i18n.t( 'Missing source quiddity parameter', {
                lng: this.lang
            } ) );
        } else if ( !_.isString( sourceQuiddity ) ) {
            return cb( i18n.t( 'Invalid source quiddity (__sourceQuiddity__)', {
                lng: this.lang,
                sourceQuiddity: sourceQuiddity
            } ) );
        }

        if ( _.isEmpty( sourceProperty ) ) {
            return cb( i18n.t( 'Missing source property parameter', {
                lng: this.lang
            } ) );
        } else if ( !_.isString( sourceProperty ) ) {
            return cb( i18n.t( 'Invalid source property (__sourceProperty__)', {
                lng: this.lang,
                sourceProperty: sourceProperty
            } ) );
        }

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
            var mapped = this.switcherController.controlManager.addMapping( sourceQuiddity, sourceProperty, destinationQuiddity, destinationProperty );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while adding mapping (__error__)', {
                lng:   this.lang,
                error: e.toString()
            } ) );
        }

        if ( !mapped ) {
            return cb( i18n.t( 'Could not add mapping', {
                lng:  this.lang,
            } ) )
        }

        cb( null, mapped );
    }
};