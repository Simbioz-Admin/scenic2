var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

describe( 'update RTP Destination Command', function () {

    var client;
    var command;
    var cb;

    var id;
    var info;

    beforeEach( function () {
        command = require( '../../../src/net/commands/rtp.destination.update' );
        client  = {
            switcherController: {
                rtpManager: {
                    updateRTPDestination: sinon.stub()
                }
            }
        };
        command = command.execute.bind( client );
        cb      = sinon.stub();

        id = 'destinationId';
        info = {
            name: 'new destination name',
            host: 'some host',
            port: 9090
        };
    } );

    afterEach( function () {
        cb.should.have.been.calledOnce;
    } );

    it( 'should return true when successful', function () {
        client.switcherController.rtpManager.updateRTPDestination.returns( true );
        command( id, info, cb );
        client.switcherController.rtpManager.updateRTPDestination.should.have.been.calledOnce;
        client.switcherController.rtpManager.updateRTPDestination.should.have.been.calledWithExactly( id, info );
        cb.should.have.been.calledWithExactly( null, true );
    } );

    it( 'should return an error when manager throws', function () {
        client.switcherController.rtpManager.updateRTPDestination.throws();
        command( id, info, cb );
        client.switcherController.rtpManager.updateRTPDestination.should.have.been.calledOnce;
        client.switcherController.rtpManager.updateRTPDestination.should.have.been.calledWithExactly( id, info );
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when failing to update destination', function () {
        client.switcherController.rtpManager.updateRTPDestination.returns( false );
        command( id, info, cb );
        client.switcherController.rtpManager.updateRTPDestination.should.have.been.calledOnce;
        client.switcherController.rtpManager.updateRTPDestination.should.have.been.calledWithExactly( id, info );
        cb.should.have.been.calledWithMatch( '' ); // Any message is good
    } );

    // ID

    it( 'should return an error when id parameter is empty', function () {
        command( '', info, cb );
        client.switcherController.rtpManager.updateRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when id parameter is null', function () {
        command( null, info, cb );
        client.switcherController.rtpManager.updateRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when id parameter is a number', function () {
        command( 666, info, cb );
        client.switcherController.rtpManager.updateRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when id parameter is not a string', function () {
        command( ['not s string'], info, cb );
        client.switcherController.rtpManager.updateRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    // INFO

    it( 'should return an error when info parameter is empty', function () {
        command( id, '', cb );
        client.switcherController.rtpManager.updateRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when info parameter is null', function () {
        command( id, null, cb );
        client.switcherController.rtpManager.updateRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when info parameter is a number', function () {
        command( id, 666, cb );
        client.switcherController.rtpManager.updateRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when info parameter is not an object', function () {
        command( id, ['not an object'], cb );
        client.switcherController.rtpManager.updateRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

} );