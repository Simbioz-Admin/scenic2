var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

describe( 'Update Contact Command', function () {

    var client;
    var command;
    var cb;
    var info;

    beforeEach( function () {
        command = require( '../../../src/net/commands/sip.contact.update' );

        client  = {
            switcherController: {
                sipManager: {
                    updateContact: sinon.stub()
                }
            }
        };
        command = command.execute.bind( client );
        cb      = sinon.stub();

        info = {
            name: 'new name',
            status: 'status',
            status_text: 'message'
        };
    } );

    afterEach( function () {
        cb.should.have.been.calledOnce;
    } );

    it( 'should return true when successful', function () {
        client.switcherController.sipManager.updateContact.returns( true );
        command( 'uri@server.com', info, cb );
        client.switcherController.sipManager.updateContact.should.have.been.calledOnce;
        client.switcherController.sipManager.updateContact.should.have.been.calledWithExactly('uri@server.com', info );
        cb.should.have.been.calledWithExactly( null, true );
    } );

    it( 'should return an error when manager throws', function () {
        client.switcherController.sipManager.updateContact.throws();
        command( 'uri@server.com', info, cb );
        client.switcherController.sipManager.updateContact.should.have.been.calledOnce;
        client.switcherController.sipManager.updateContact.should.have.been.calledWithExactly('uri@server.com', info );
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when failing to update contact', function () {
        client.switcherController.sipManager.updateContact.returns( false );
        command( 'uri@server.com', info, cb );
        client.switcherController.sipManager.updateContact.should.have.been.calledOnce;
        client.switcherController.sipManager.updateContact.should.have.been.calledWithExactly('uri@server.com', info );
        cb.should.have.been.calledWithMatch( '' ); // Any message is good
    } );

    it( 'should return an error when uri parameter is empty', function () {
        command( '', info, cb );
        client.switcherController.sipManager.updateContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when uri parameter is null', function () {
        command( null, info, cb );
        client.switcherController.sipManager.updateContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when uri parameter is a number', function () {
        command( 666, info, cb );
        client.switcherController.sipManager.updateContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when uri parameter is not a string', function () {
        command( ['uri@server.com'], info, cb );
        client.switcherController.sipManager.updateContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when info parameter is empty', function () {
        command( 'uri@server.com', '', cb );
        client.switcherController.sipManager.updateContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when info parameter is null', function () {
        command( 'uri@server.com', null, cb );
        client.switcherController.sipManager.updateContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when info parameter is a number', function () {
        command( 'uri@server.com', 666, cb );
        client.switcherController.sipManager.updateContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when info parameter is not a object', function () {
        command( 'uri@server.com', [info], cb );
        client.switcherController.sipManager.updateContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

} );