var _    = require( 'underscore' );
var i18n = require( 'i18next' );

module.exports = {
    /**
     * Get tree information command
     *
     * @param {String} quiddityId Quiddity for which we want to retrieve the tree information
     * @param {String} path Branch/leaf path to query inside the tree
     * @param {Function} cb Callback
     */
    execute: function ( quiddityId, path, cb ) {
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

        if ( _.isEmpty( path ) ) {
            return cb( i18n.t( 'Missing path parameter', {
                lng: this.lang
            } ) );
        } else if ( !_.isString( path ) ) {
            return cb( i18n.t( 'Invalid path (__path__)', {
                lng: this.lang,
                path: path
            } ) );
        }

        try {
            var tree = this.switcherController.quiddityManager.getTreeInfo( quiddityId, path );
        } catch ( e ) {
            return cb( i18n.t( 'An error occurred while getting tree information for path __path__ on quiddity __quiddity__ (__error__)', {
                lng: this.lang,
                quiddity: quiddityId,
                path:     path,
                error:    e.toString()
            } ) );
        }
        cb( null, tree );
    }
};