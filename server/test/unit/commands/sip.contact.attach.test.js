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
} );