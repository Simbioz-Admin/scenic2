var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

describe( 'Disconnect RTP Destination Command', function () {

    var client;
    var command;
    var cb;

    var path;
    var id;

    beforeEach( function () {
        command = require( '../../../src/net/commands/rtp.destination.disconnect' );
        client  = {
            switcherController: {
                rtpManager: {
                    disconnectRTPDestination: sinon.stub()
                }
            }
        };
        command = command.execute.bind( client );
        cb      = sinon.stub();

        path = '/some/shmdata_path';
        id = 'destinationId';
    } );

    afterEach( function () {
        cb.should.have.been.calledOnce;
    } );

    it( 'should return true when successful', function () {
        client.switcherController.rtpManager.disconnectRTPDestination.returns( true );
        command( id, path, cb );
        client.switcherController.rtpManager.disconnectRTPDestination.should.have.been.calledOnce;
        client.switcherController.rtpManager.disconnectRTPDestination.should.have.been.calledWithExactly( id, path );
        cb.should.have.been.calledWithExactly( null, true );
    } );

    it( 'should return an error when manager throws', function () {
        client.switcherController.rtpManager.disconnectRTPDestination.throws();
        command( id, path, cb );
        client.switcherController.rtpManager.disconnectRTPDestination.should.have.been.calledOnce;
        client.switcherController.rtpManager.disconnectRTPDestination.should.have.been.calledWithExactly( id, path );
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when failing to disconnect destination', function () {
        client.switcherController.rtpManager.disconnectRTPDestination.returns( false );
        command( id, path, cb );
        client.switcherController.rtpManager.disconnectRTPDestination.should.have.been.calledOnce;
        client.switcherController.rtpManager.disconnectRTPDestination.should.have.been.calledWithExactly( id, path );
        cb.should.have.been.calledWithMatch( '' ); // Any message is good
    } );

    // ID

    it( 'should return an error when id parameter is empty', function () {
        command( '', path, cb );
        client.switcherController.rtpManager.disconnectRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when id parameter is null', function () {
        command( null, path, cb );
        client.switcherController.rtpManager.disconnectRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when id parameter is a number', function () {
        command( 666, path, cb );
        client.switcherController.rtpManager.disconnectRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when id parameter is not a string', function () {
        command( ['not s string'], path, cb );
        client.switcherController.rtpManager.disconnectRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    // PATH

    it( 'should return an error when path parameter is empty', function () {
        command( id, '', cb );
        client.switcherController.rtpManager.disconnectRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when path parameter is null', function () {
        command( id, null, cb );
        client.switcherController.rtpManager.disconnectRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when path parameter is a number', function () {
        command( id, 666, cb );
        client.switcherController.rtpManager.disconnectRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when path parameter is not a string', function () {
        command( id, ['not a string'], cb );
        client.switcherController.rtpManager.disconnectRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

} );