var log = require( '../lib/logger' );

/**
 * Utility method to log an error and apply a callback with the same error
 * This comes handy when trying to handle all the possible error cases in the managers
 *
 * @param message
 * @param callback
 */
module.exports = function ( message, callback ) {
    log.warn( message );
    callback( message );
};
