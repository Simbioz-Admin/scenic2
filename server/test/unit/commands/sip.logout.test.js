var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

describe( 'SIP Logout Command', function () {

    var client;
    var command;
    var cb;
    var credentials;

    beforeEach( function () {
        command = require( '../../../src/net/commands/sip.logout' );
        client  = {
            switcherController: {
                sipManager: {
                    logout: sinon.stub()
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
        client.switcherController.sipManager.logout.returns( true );
        command( cb );
        client.switcherController.sipManager.logout.should.have.been.calledOnce;
        client.switcherController.sipManager.logout.should.have.been.calledWithExactly( );
        cb.should.have.been.calledWithExactly(  );
    } );

    it( 'should return error when manager throws', function () {
        client.switcherController.sipManager.logout.throws();
        command( cb );
        client.switcherController.sipManager.logout.should.have.been.calledOnce;
        client.switcherController.sipManager.logout.should.have.been.calledWithExactly( );
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return error when logout is unsuccessful', function () {
        client.switcherController.sipManager.logout.returns(false);
        command( cb );
        client.switcherController.sipManager.logout.should.have.been.calledOnce;
        client.switcherController.sipManager.logout.should.have.been.calledWithExactly( );
        cb.should.have.been.calledWithMatch( '' );
    } );

} );