'use strict';

var _   = require( 'underscore' );
var log = require( '../lib/logger' );

/**
 * Constructor
 *
 * @param switcherController
 * @constructor
 */
function ControlManager( switcherController) {
    this.switcherController = switcherController;
    this.config             = this.switcherController.config;
    this.switcher           = this.switcherController.switcher;
    this.io                 = this.switcherController.io;
}

/**
 * Initialize
 */
ControlManager.prototype.initialize = function () {

};

/**
 * Switcher Property Callback
 *
 * @param quiddityId
 * @param property
 * @param value
 */
ControlManager.prototype.onSwitcherProperty = function ( quiddityId, property, value ) {

};


/**
 * Switcher Signal Callback
 *
 * @param quiddityId
 * @param signal
 * @param value
 */
ControlManager.prototype.onSwitcherSignal = function ( quiddityId, signal, value ) {

};

ControlManager.prototype.addMapping = function( sourceQuiddity, sourceProperty, destinationQuiddity, destinationProperty ) {
    log.info('Adding mapping', sourceQuiddity, sourceProperty, 'to', destinationQuiddity, destinationProperty );
    
    var sourcePropertyDescription = this.switcherController.quiddityManager.getPropertyDescription( sourceQuiddity, sourceProperty );
    if ( !sourcePropertyDescription) {
        log.warn('Source property not found');
        return false;
    }

    var destinationPropertyDescription = this.switcherController.quiddityManager.getPropertyDescription( destinationQuiddity, destinationProperty );
    if ( !destinationPropertyDescription) {
        log.warn('Destination property not found');
        return false;
    }

    var mapper = this.switcherController.quiddityManager.create('property-mapper');
    if ( !mapper) {
        log.warn('Could not create mapper');
        return false;
    }

    // Utility function to remove the mapper
    var self = this;
    function removeMapper() {
        log.info('Removing mapper');
        var removed = self.switcherController.quiddityManager.remove( mapper.id );
        if ( !removed ) {
            log.error('Could not remove mapper after mapping failed');
        }
    }

    var sourceSet = this.switcherController.quiddityManager.invokeMethod( mapper.id, 'set-source-property', [ sourceQuiddity, sourceProperty ] );
    if ( !sourceSet ) {
        log.warn('Could not map source property');
        removeMapper();
        return false;
    }

    var destinationSet = this.switcherController.quiddityManager.invokeMethod( mapper.id, 'set-sink-property', [ destinationQuiddity, destinationProperty ] );
    if ( !destinationSet ) {
        log.warn('Could not map destination property');
        removeMapper();
        return false;
    }

    // If we are here everything went smoothly
    return true;
};


module.exports = ControlManager;