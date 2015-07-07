var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

describe( 'Create RTP Destination Command', function () {

    var client;
    var command;
    var cb;

    var name;
    var host;
    var port;

    beforeEach( function () {
        command = require( '../../../src/net/commands/rtp.destination.create' );
        client  = {
            switcherController: {
                rtpManager: {
                    createRTPDestination: sinon.stub()
                }
            }
        };
        command = command.execute.bind( client );
        cb      = sinon.stub();

        name = 'some name';
        host = 'some.host';
        port = 9090;
    } );

    afterEach( function () {
        cb.should.have.been.calledOnce;
    } );

    it( 'should return true when successful', function () {
        client.switcherController.rtpManager.createRTPDestination.returns( true );
        command( name, host, port, cb );
        client.switcherController.rtpManager.createRTPDestination.should.have.been.calledOnce;
        client.switcherController.rtpManager.createRTPDestination.should.have.been.calledWithExactly( name, host, port );
        cb.should.have.been.calledWithExactly( null, true );
    } );

    it( 'should return an error when manager throws', function () {
        client.switcherController.rtpManager.createRTPDestination.throws();
        command( name, host, port, cb );
        client.switcherController.rtpManager.createRTPDestination.should.have.been.calledOnce;
        client.switcherController.rtpManager.createRTPDestination.should.have.been.calledWithExactly( name, host, port );
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when failing to create destination', function () {
        client.switcherController.rtpManager.createRTPDestination.returns( false );
        command( name, host, port, cb );
        client.switcherController.rtpManager.createRTPDestination.should.have.been.calledOnce;
        client.switcherController.rtpManager.createRTPDestination.should.have.been.calledWithExactly( name, host, port );
        cb.should.have.been.calledWithMatch( '' ); // Any message is good
    } );

    it( 'should return an error when name parameter is empty', function () {
        command( '', host, port, cb );
        client.switcherController.rtpManager.createRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when name parameter is null', function () {
        command( null, host, port, cb );
        client.switcherController.rtpManager.createRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when name parameter is a number', function () {
        command( 666, host, port, cb );
        client.switcherController.rtpManager.createRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when name parameter is not a string', function () {
        command( ['not s string'], host, port, cb );
        client.switcherController.rtpManager.createRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when host parameter is empty', function () {
        command( name, '', port, cb );
        client.switcherController.rtpManager.createRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when host parameter is null', function () {
        command( name, null, port, cb );
        client.switcherController.rtpManager.createRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when host parameter is a number', function () {
        command( name, 666, port, cb );
        client.switcherController.rtpManager.createRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when host parameter is not a string', function () {
        command( name, ['not a string'], port, cb );
        client.switcherController.rtpManager.createRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when port parameter is not a number', function () {
        command( name, host, 'pouet', cb );
        client.switcherController.rtpManager.createRTPDestination.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

} );