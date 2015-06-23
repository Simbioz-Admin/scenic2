var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

describe( 'Add Mapping Command', function () {

    var sourceQuiddity;
    var sourceProperty;
    var destinationQuiddity;
    var destinationProperty;
    var command;
    var client;
    var cb;

    beforeEach( function () {
        command = require( '../../../src/net/commands/control.mapping.add' );
        client  = {
            switcherController: {
                controlManager: {
                    addMapping: sinon.stub()
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
        client.switcherController.controlManager.addMapping.returns( true );
        command( sourceQuiddity, sourceProperty, destinationQuiddity, destinationProperty, cb );
        client.switcherController.controlManager.addMapping.should.have.been.calledOnce;
        client.switcherController.controlManager.addMapping.should.have.been.calledWithExactly(sourceQuiddity, sourceProperty, destinationQuiddity, destinationProperty );
        cb.should.have.been.calledWithExactly( null, true );
    } );

    it( 'should return an error when manager throws', function () {
        client.switcherController.controlManager.addMapping.throws();
        command( sourceQuiddity, sourceProperty, destinationQuiddity, destinationProperty, cb );
        client.switcherController.controlManager.addMapping.should.have.been.calledOnce;
        client.switcherController.controlManager.addMapping.should.have.been.calledWithExactly(sourceQuiddity, sourceProperty, destinationQuiddity, destinationProperty );
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when failing to add mapping', function () {
        client.switcherController.controlManager.addMapping.returns( false );
        command( sourceQuiddity, sourceProperty, destinationQuiddity, destinationProperty, cb );
        client.switcherController.controlManager.addMapping.should.have.been.calledOnce;
        client.switcherController.controlManager.addMapping.should.have.been.calledWithExactly(sourceQuiddity, sourceProperty, destinationQuiddity, destinationProperty );
        cb.should.have.been.calledWithMatch( '' ); // Any message is good
    } );

    // SOURCE QUIDDITY

    it( 'should return an error when source quiddity parameter is empty', function () {
        command( '', sourceProperty, destinationQuiddity, destinationProperty, cb );
        client.switcherController.controlManager.addMapping.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when source quiddity parameter is null', function () {
        command( null, sourceProperty, destinationQuiddity, destinationProperty, cb );
        client.switcherController.controlManager.addMapping.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when source quiddity parameter is a number', function () {
        command( 666, sourceProperty, destinationQuiddity, destinationProperty, cb );
        client.switcherController.controlManager.addMapping.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when source quiddity parameter is not a string', function () {
        command( ['array'], sourceProperty, destinationQuiddity, destinationProperty, cb );
        client.switcherController.controlManager.addMapping.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    // SOURCE PROPERTY

    it( 'should return an error when source property parameter is empty', function () {
        command( sourceQuiddity, '', destinationQuiddity, destinationProperty, cb );
        client.switcherController.controlManager.addMapping.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when source property parameter is null', function () {
        command( sourceQuiddity, null, destinationQuiddity, destinationProperty, cb );
        client.switcherController.controlManager.addMapping.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when source property parameter is a number', function () {
        command( sourceQuiddity, 666, destinationQuiddity, destinationProperty, cb );
        client.switcherController.controlManager.addMapping.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when source property parameter is not a string', function () {
        command( sourceQuiddity, ['array'], destinationQuiddity, destinationProperty, cb );
        client.switcherController.controlManager.addMapping.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    // DESTINATION QUIDDITY

    it( 'should return an error when destination quiddity parameter is empty', function () {
        command( sourceQuiddity, sourceProperty, '', destinationProperty, cb );
        client.switcherController.controlManager.addMapping.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when destination quiddity parameter is null', function () {
        command( sourceQuiddity, sourceProperty, null, destinationProperty, cb );
        client.switcherController.controlManager.addMapping.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when destination quiddity parameter is a number', function () {
        command( sourceQuiddity, sourceProperty, 666, destinationProperty, cb );
        client.switcherController.controlManager.addMapping.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when destination quiddity parameter is not a string', function () {
        command( sourceQuiddity, sourceProperty, ['array'], destinationProperty, cb );
        client.switcherController.controlManager.addMapping.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    // DESTINATION PROPERTY

    it( 'should return an error when destination property parameter is empty', function () {
        command( sourceQuiddity, sourceProperty, destinationQuiddity, '', cb );
        client.switcherController.controlManager.addMapping.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when destination property parameter is null', function () {
        command( sourceQuiddity, sourceProperty, destinationQuiddity, null, cb );
        client.switcherController.controlManager.addMapping.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when destination property parameter is a number', function () {
        command( sourceQuiddity, sourceProperty, destinationQuiddity, 666, cb );
        client.switcherController.controlManager.addMapping.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when destination property parameter is not a string', function () {
        command( sourceQuiddity, sourceProperty, destinationQuiddity, ['array'], cb );
        client.switcherController.controlManager.addMapping.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

} );