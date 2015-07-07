var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

describe( 'Remove RTP Destination Command', function () {

    var client;
    var command;
    var cb;

    var id;

    beforeEach( function () {
        command = require( '../../../src/net/commands/rtp.destination.remove' );
        client  = {
            switcherController: {
                rtpManager: {
                    removeRTPDestination: sinon.stub()
                }
            }
        };
        command = command.execute.bind( client );
        cb      = sinon.stub();

        id = 'some name';
    } );

    afterEach( function () {
        cb.should.have.been.calledOnce;
    } );

    it( 'should return true when successful', function () {
        client.switcherController.rtpManager.removeRTPDestination.returns( true );
        command( id, cb );
        client.switcherController.rtpManager.removeRTPDestination.should.have.been.calledOnce;
        client.switcherController.rtpManager.removeRTPDestination.should.have.been.calledWithExactly( id );
        cb.should.have.been.calledWithExactly( null, true );
    } );

    it( 'should return an error when manager throws', function () {
        client.switcherController.rtpManager.removeRTPDestination.throws();
        command( id, cb );
        client.switcherController.rtpManager.removeRTPDestination.should.have.been.calledOnce;
        client.switcherController.rtpManager.removeRTPDestination.should.have.been.calledWithExactly( id );
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when failing to remove destination', function () {
        client.switcherController.rtpManager.removeRTPDestination.returns( false );
        command( id, cb );
        client.switcherController.rtpManager.removeRTPDestination.should.have.been.calledOnce;
        client.switcherController.rtpManager.removeRTPDestination.should.have.been.calledWithExactly( id );
        cb.should.have.been.calledWithMatch( '' ); // Any message is good
    } );

    it( 'should return an error when name parameter is empty', function () {
        command( '', cb );
        client.switcherController.rtpManager.removeRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when name parameter is null', function () {
        command( null, cb );
        client.switcherController.rtpManager.removeRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when name parameter is a number', function () {
        command( 666, cb );
        client.switcherController.rtpManager.removeRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when name parameter is not a string', function () {
        command( ['not s string'], cb );
        client.switcherController.rtpManager.removeRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

} );