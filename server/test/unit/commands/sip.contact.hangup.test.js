var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

describe( 'SIP Contact Hang Up Command', function () {

    var client;
    var command;
    var cb;

    var uri;
    var path;

    beforeEach( function () {
        command = require( '../../../src/net/commands/sip.contact.hangup' );
        client  = {
            switcherController: {
                sipManager: {
                    hangUpContact: sinon.stub()
                }
            }
        };
        command = command.execute.bind( client );
        cb      = sinon.stub();
        uri     = 'user@server.com';
    } );

    afterEach( function () {
        cb.should.have.been.calledOnce;
    } );

    it( 'should return true when successful', function () {
        client.switcherController.sipManager.hangUpContact.returns( true );
        command( uri, cb );
        client.switcherController.sipManager.hangUpContact.should.have.been.calledOnce;
        client.switcherController.sipManager.hangUpContact.should.have.been.calledWithExactly( uri );
        cb.should.have.been.calledWithExactly( null, true );
    } );

    it( 'should return an error when manager throws', function () {
        client.switcherController.sipManager.hangUpContact.throws();
        command( uri, cb );
        client.switcherController.sipManager.hangUpContact.should.have.been.calledOnce;
        client.switcherController.sipManager.hangUpContact.should.have.been.calledWithExactly( uri );
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when failing to remove contact', function () {
        client.switcherController.sipManager.hangUpContact.returns( false );
        command( uri, cb );
        client.switcherController.sipManager.hangUpContact.should.have.been.calledOnce;
        client.switcherController.sipManager.hangUpContact.should.have.been.calledWithExactly( uri );
        cb.should.have.been.calledWithMatch( '' ); // Any message is good
    } );

    it( 'should return an error when uri parameter is empty', function () {
        command('', cb);
        client.switcherController.sipManager.hangUpContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when uri parameter is null', function () {
        command(null, cb);
        client.switcherController.sipManager.hangUpContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when uri parameter is a number', function () {
        command(666, cb);
        client.switcherController.sipManager.hangUpContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when uri parameter is not a string', function () {
        command(['not a string'], cb);
        client.switcherController.sipManager.hangUpContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );
} );