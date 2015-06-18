var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

describe( 'SIP Contact Attach Command', function () {

    var client;
    var command;
    var cb;

    var uri;
    var path;

    beforeEach( function () {
        command = require( '../../../src/net/commands/sip.contact.attach' );
        client  = {
            switcherController: {
                sipManager: {
                    attachShmdataToContact: sinon.stub()
                }
            }
        };
        command = command.execute.bind( client );
        cb      = sinon.stub();
        uri     = 'user@server.com';
        path    = '/tmp/some_shmdata';
    } );

    afterEach( function () {
        cb.should.have.been.calledOnce;
    } );

    it( 'should return true when successful', function () {
        client.switcherController.sipManager.attachShmdataToContact.returns( true );
        command( uri, path, cb );
        client.switcherController.sipManager.attachShmdataToContact.should.have.been.calledOnce;
        client.switcherController.sipManager.attachShmdataToContact.should.have.been.calledWithExactly( uri, path );
        cb.should.have.been.calledWithExactly( null, true );
    } );

    it( 'should return an error when manager throws', function () {
        client.switcherController.sipManager.attachShmdataToContact.throws();
        command( uri, path, cb );
        client.switcherController.sipManager.attachShmdataToContact.should.have.been.calledOnce;
        client.switcherController.sipManager.attachShmdataToContact.should.have.been.calledWithExactly( uri, path );
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when failing to attach shmdata to contact', function () {
        client.switcherController.sipManager.attachShmdataToContact.returns( false );
        command( uri, path, cb );
        client.switcherController.sipManager.attachShmdataToContact.should.have.been.calledOnce;
        client.switcherController.sipManager.attachShmdataToContact.should.have.been.calledWithExactly( uri, path );
        cb.should.have.been.calledWithMatch( '' ); // Any message is good
    } );

    it( 'should return an error when uri parameter is empty', function () {
        command('', path, cb);
        client.switcherController.sipManager.attachShmdataToContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when uri parameter is null', function () {
        command(null, path, cb);
        client.switcherController.sipManager.attachShmdataToContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when uri parameter is a number', function () {
        command(666, path, cb);
        client.switcherController.sipManager.attachShmdataToContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when uri parameter is not a string', function () {
        command(['not a string'], path, cb);
        client.switcherController.sipManager.attachShmdataToContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when path parameter is empty', function () {
        command(uri, '', cb);
        client.switcherController.sipManager.attachShmdataToContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when path parameter is null', function () {
        command(uri, null, cb);
        client.switcherController.sipManager.attachShmdataToContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when path parameter is a number', function () {
        command(uri, 666, cb);
        client.switcherController.sipManager.attachShmdataToContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when path parameter is not a string', function () {
        command(uri, ['not a string'], cb);
        client.switcherController.sipManager.attachShmdataToContact.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );
} );