var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

describe( 'SIP Login Command', function () {

    var client;
    var command;
    var cb;
    var credentials;

    beforeEach( function () {
        command = require( '../../../src/net/commands/sip.login' );
        credentials = {
            server:   'sip.server.com',
            user:     'username',
            port:     666,
            password: 'some encrypted password'
        };
        client  = {
            switcherController: {
                sipManager: {
                    login: sinon.stub()
                }
            }
        };
        command = command.execute.bind( client );
        cb      = sinon.stub();
    } );

    afterEach( function () {
        cb.should.have.been.calledOnce;
    } );

    it( 'should return empty callback on success', function () {
        client.switcherController.sipManager.login.returns( true );
        command( credentials, cb );
        client.switcherController.sipManager.login.should.have.been.calledOnce;
        client.switcherController.sipManager.login.should.have.been.calledWithExactly( credentials );
        cb.should.have.been.calledWithExactly(  );
    } );

    it( 'should return error when manager throws', function () {
        client.switcherController.sipManager.login.throws();
        command( credentials, cb );
        client.switcherController.sipManager.login.should.have.been.calledOnce;
        client.switcherController.sipManager.login.should.have.been.calledWithExactly( credentials );
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when login is unsuccessful', function () {
        client.switcherController.sipManager.login.returns(false);
        command( credentials, cb );
        client.switcherController.sipManager.login.should.have.been.calledOnce;
        client.switcherController.sipManager.login.should.have.been.calledWithExactly( credentials );
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should not return error when port is missing', function () {
        delete credentials.port;
        client.switcherController.sipManager.login.returns( true );
        command( credentials, cb );
        client.switcherController.sipManager.login.should.have.been.calledOnce;
        client.switcherController.sipManager.login.should.have.been.calledWithExactly( credentials );
        cb.should.have.been.calledWithExactly(  );
    } );

    it( 'should not return error when port string can be parsed as an int', function () {
        credentials.port = '1234';
        client.switcherController.sipManager.login.returns( true );
        command( credentials, cb );
        client.switcherController.sipManager.login.should.have.been.calledOnce;
        client.switcherController.sipManager.login.should.have.been.calledWithExactly( credentials );
        cb.should.have.been.calledWithExactly(  );
    } );

    it( 'should return error when server is missing', function () {
        delete credentials.server;
        command( credentials, cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when user is missing', function () {
        delete credentials.user;
        command( credentials, cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when password is missing', function () {
        delete credentials.password;
        command( credentials, cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when credentials are missing', function () {
        command( null, cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when credentials are invalid (string)', function () {
        command( 'string', cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when credentials are invalid (number)', function () {
        command( 666, cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when credentials are invalid (bool)', function () {
        command( true, cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when credentials are invalid (array)', function () {
        command( ['array'], cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when server is invalid (number)', function () {
        credentials.server = 666;
        command( credentials, cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when server is invalid (array)', function () {
        credentials.server = ['array'];
        command( credentials, cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when server is invalid (object)', function () {
        credentials.server = {an:'object'};
        command( credentials, cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when server is invalid (bool)', function () {
        credentials.server = true;
        command( credentials, cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when user is invalid (number)', function () {
        credentials.user = 666;
        command( credentials, cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when user is invalid (array)', function () {
        credentials.user = ['array'];
        command( credentials, cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when user is invalid (object)', function () {
        credentials.user = {an:'object'};
        command( credentials, cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when user is invalid (bool)', function () {
        credentials.user = true;
        command( credentials, cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when password is invalid (number)', function () {
        credentials.password = 666;
        command( credentials, cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when password is invalid (array)', function () {
        credentials.password = ['array'];
        command( credentials, cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when password is invalid (object)', function () {
        credentials.password = {an:'object'};
        command( credentials, cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when password is invalid (bool)', function () {
        credentials.password = true;
        command( credentials, cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when port is invalid (unparseable string)', function () {
        credentials.port = 'pouet';
        command( credentials, cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when port is invalid (array)', function () {
        credentials.port = ['array'];
        command( credentials, cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when port is invalid (object)', function () {
        credentials.port = {an:'object'};
        command( credentials, cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when port is invalid (bool)', function () {
        credentials.port = true;
        command( credentials, cb );
        client.switcherController.sipManager.login.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

} );