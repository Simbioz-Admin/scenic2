var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

describe( 'Remove Mappings By Destination Command', function () {

    var destinationQuiddity;
    var destinationProperty;
    var command;
    var client;
    var cb;

    beforeEach( function () {
        command = require( '../../../src/net/commands/control.mapping.remove.destination' );
        client  = {
            switcherController: {
                controlManager: {
                    removeMappingsByDestination: sinon.stub()
                }
            }
        };
        command = command.execute.bind( client );
        cb      = sinon.stub();

        sourceQuiddity = 'sourceQuiddity';
        sourceProperty = 'sourceProperty';
        destinationQuiddity = 'destinationQuiddity';
        destinationProperty = 'destinationProperty';
    } );

    afterEach( function () {
        cb.should.have.been.calledOnce;
    } );

    it( 'should return true when successful', function () {
        client.switcherController.controlManager.removeMappingsByDestination.returns( true );
        command( destinationQuiddity, destinationProperty, cb );
        client.switcherController.controlManager.removeMappingsByDestination.should.have.been.calledOnce;
        client.switcherController.controlManager.removeMappingsByDestination.should.have.been.calledWithExactly(destinationQuiddity, destinationProperty );
        cb.should.have.been.calledWithExactly( null, true );
    } );

    it( 'should return an error when manager throws', function () {
        client.switcherController.controlManager.removeMappingsByDestination.throws();
        command( destinationQuiddity, destinationProperty, cb );
        client.switcherController.controlManager.removeMappingsByDestination.should.have.been.calledOnce;
        client.switcherController.controlManager.removeMappingsByDestination.should.have.been.calledWithExactly(destinationQuiddity, destinationProperty );
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when failing to add mapping', function () {
        client.switcherController.controlManager.removeMappingsByDestination.returns( false );
        command( destinationQuiddity, destinationProperty, cb );
        client.switcherController.controlManager.removeMappingsByDestination.should.have.been.calledOnce;
        client.switcherController.controlManager.removeMappingsByDestination.should.have.been.calledWithExactly(destinationQuiddity, destinationProperty );
        cb.should.have.been.calledWithMatch( '' ); // Any message is good
    } );

    // DESTINATION QUIDDITY

    it( 'should return an error when destination quiddity parameter is empty', function () {
        command( '', destinationProperty, cb );
        client.switcherController.controlManager.removeMappingsByDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when destination quiddity parameter is null', function () {
        command( null, destinationProperty, cb );
        client.switcherController.controlManager.removeMappingsByDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when destination quiddity parameter is a number', function () {
        command( 666, destinationProperty, cb );
        client.switcherController.controlManager.removeMappingsByDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when destination quiddity parameter is not a string', function () {
        command( ['array'], destinationProperty, cb );
        client.switcherController.controlManager.removeMappingsByDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    // DESTINATION PROPERTY

    it( 'should return an error when destination property parameter is empty', function () {
        command( destinationQuiddity, '', cb );
        client.switcherController.controlManager.removeMappingsByDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when destination property parameter is null', function () {
        command( destinationQuiddity, null, cb );
        client.switcherController.controlManager.removeMappingsByDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when destination property parameter is a number', function () {
        command( destinationQuiddity, 666, cb );
        client.switcherController.controlManager.removeMappingsByDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when destination property parameter is not a string', function () {
        command( destinationQuiddity, ['array'], cb );
        client.switcherController.controlManager.removeMappingsByDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

} );