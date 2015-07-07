var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

describe( 'Connect RTP Destination Command', function () {

    var client;
    var command;
    var cb;

    var path;
    var id;
    var port;

    beforeEach( function () {
        command = require( '../../../src/net/commands/rtp.destination.connect' );
        client  = {
            switcherController: {
                rtpManager: {
                    connectRTPDestination: sinon.stub()
                }
            }
        };
        command = command.execute.bind( client );
        cb      = sinon.stub();

        path = '/some/shmdata_path';
        id = 'destinationId';
        port = 9090;
    } );

    afterEach( function () {
        cb.should.have.been.calledOnce;
    } );

    it( 'should return true when successful', function () {
        client.switcherController.rtpManager.connectRTPDestination.returns( true );
        command( id, path, port, cb );
        client.switcherController.rtpManager.connectRTPDestination.should.have.been.calledOnce;
        client.switcherController.rtpManager.connectRTPDestination.should.have.been.calledWithExactly( id, path, port );
        cb.should.have.been.calledWithExactly( null, true );
    } );

    it( 'should return an error when manager throws', function () {
        client.switcherController.rtpManager.connectRTPDestination.throws();
        command( id, path, port, cb );
        client.switcherController.rtpManager.connectRTPDestination.should.have.been.calledOnce;
        client.switcherController.rtpManager.connectRTPDestination.should.have.been.calledWithExactly( id, path, port );
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when failing to connect destination', function () {
        client.switcherController.rtpManager.connectRTPDestination.returns( false );
        command( id, path, port, cb );
        client.switcherController.rtpManager.connectRTPDestination.should.have.been.calledOnce;
        client.switcherController.rtpManager.connectRTPDestination.should.have.been.calledWithExactly( id, path, port );
        cb.should.have.been.calledWithMatch( '' ); // Any message is good
    } );

    // ID

    it( 'should return an error when id parameter is empty', function () {
        command( '', path, port, cb );
        client.switcherController.rtpManager.connectRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when id parameter is null', function () {
        command( null, path, port, cb );
        client.switcherController.rtpManager.connectRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when id parameter is a number', function () {
        command( 666, path, port, cb );
        client.switcherController.rtpManager.connectRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when id parameter is not a string', function () {
        command( ['not s string'], path, port, cb );
        client.switcherController.rtpManager.connectRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    // PATH

    it( 'should return an error when path parameter is empty', function () {
        command( id, '', port, cb );
        client.switcherController.rtpManager.connectRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when path parameter is null', function () {
        command( id, null, port, cb );
        client.switcherController.rtpManager.connectRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when path parameter is a number', function () {
        command( id, 666, port, cb );
        client.switcherController.rtpManager.connectRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when path parameter is not a string', function () {
        command( id, ['not a string'], port, cb );
        client.switcherController.rtpManager.connectRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    // PORT

    it( 'should return an error when port parameter is not a number', function () {
        command( id, path, 'pouet', cb );
        client.switcherController.rtpManager.connectRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when port parameter is empty', function () {
        command( id, path, '', cb );
        client.switcherController.rtpManager.connectRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when port parameter is null', function () {
        command( id, path, null, cb );
        client.switcherController.rtpManager.connectRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

} );