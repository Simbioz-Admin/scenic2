var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

var quiddities   = require( '../../fixtures/quiddities' );

describe( 'Remove Command', function () {

    var client;
    var command;
    var cb;

    beforeEach( function () {
        command = require( '../../../src/net/commands/remove' );

        client  = {
            switcherController: {
                quiddityManager: {
                    remove: sinon.stub()
                }
            }
        };
        command = command.execute.bind( client );
        cb      = sinon.stub();
    } );

    afterEach( function () {
        cb.should.have.been.calledOnce;
    } );

    it( 'should return true on success', function () {
        client.switcherController.quiddityManager.remove.returns( true );
        command( 'quiddid', cb );
        client.switcherController.quiddityManager.remove.should.have.been.calledOnce;
        client.switcherController.quiddityManager.remove.should.have.been.calledWithExactly('quiddid' );
        cb.should.have.been.calledWithExactly( null,true );
    } );

    it( 'should return an error when manager throws', function () {
        client.switcherController.quiddityManager.remove.throws();
        command( 'quiddid', cb );
        client.switcherController.quiddityManager.remove.should.have.been.calledOnce;
        client.switcherController.quiddityManager.remove.should.have.been.calledWithExactly( 'quiddid' );
        cb.should.have.been.calledWithMatch( Error );
    } );

    it( 'should return an error when failing to remove', function () {
        client.switcherController.quiddityManager.remove.returns( false );
        command( 'quiddid', cb );
        client.switcherController.quiddityManager.remove.should.have.been.calledOnce;
        client.switcherController.quiddityManager.remove.should.have.been.calledWithExactly( 'quiddid' );
        cb.should.have.been.calledWithMatch( '' ); // Any message is good
    } );

    it( 'should return an error when quiddity parameter is empty', function () {
        command( '', cb );
        client.switcherController.quiddityManager.remove.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when quiddity parameter is null', function () {
        command( null, cb );
        client.switcherController.quiddityManager.remove.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when quiddity parameter is a number', function () {
        command( 666, cb );
        client.switcherController.quiddityManager.remove.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when quiddity parameter is not a string', function () {
        command( ['not a string'], cb );
        client.switcherController.quiddityManager.remove.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

} );
