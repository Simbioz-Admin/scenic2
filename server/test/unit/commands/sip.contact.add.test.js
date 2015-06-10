var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

describe( 'Add Contact Command', function () {

    var client;
    var command;
    var cb;

    beforeEach( function () {
        command = require( '../../../src/net/commands/sip.contact.add' );

        client  = {
            switcherController: {
                sipManager: {
                    addContact: sinon.stub()
                }
            }
        };
        command = command.execute.bind( client );
        cb      = sinon.stub();
    } );

    afterEach( function () {
        cb.should.have.been.calledOnce;
    } );

    it( 'should return true when successful', function () {
        client.switcherController.sipManager.addContact.returns( true );
        command( 'uri@server.com', cb );
        client.switcherController.sipManager.addContact.should.have.been.calledOnce;
        client.switcherController.sipManager.addContact.should.have.been.calledWithExactly('uri@server.com' );
        cb.should.have.been.calledWithExactly( null, true );
    } );

    it( 'should return an error when manager throws', function () {
        client.switcherController.sipManager.addContact.throws();
        command( 'uri@server.com', cb );
        client.switcherController.sipManager.addContact.should.have.been.calledOnce;
        client.switcherController.sipManager.addContact.should.have.been.calledWithExactly('uri@server.com' );
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when failing to add contact', function () {
        client.switcherController.sipManager.addContact.returns( false );
        command( 'uri@server.com', cb );
        client.switcherController.sipManager.addContact.should.have.been.calledOnce;
        client.switcherController.sipManager.addContact.should.have.been.calledWithExactly('uri@server.com' );
        cb.should.have.been.calledWithMatch( '' ); // Any message is good
    } );

    it( 'should return an error when uri parameter is empty', function () {
        command( '', cb );
        client.switcherController.sipManager.addContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when uri parameter is null', function () {
        command( null, cb );
        client.switcherController.sipManager.addContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when uri parameter is a number', function () {
        command( 666, cb );
        client.switcherController.sipManager.addContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when uri parameter is not a string', function () {
        command( ['uri@server.com'], cb );
        client.switcherController.sipManager.addContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

} );