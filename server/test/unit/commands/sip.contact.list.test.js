var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

describe( 'SIP Contact List Command', function () {

    var client;
    var command;
    var cb;

    beforeEach( function () {
        command     = require( '../../../src/net/commands/sip.contact.list' );
        client      = {
            switcherController: {
                sipManager: {
                    getContacts: sinon.stub()
                }
            }
        };
        command     = command.execute.bind( client );
        cb          = sinon.stub();
    } );

    afterEach( function () {
        cb.should.have.been.calledOnce;
    } );

    it( 'should an array of contacts on success', function () {
        client.switcherController.sipManager.getContacts.returns( [ 'some', 'array' ] );
        command( cb );
        client.switcherController.sipManager.getContacts.should.have.been.calledOnce;
        client.switcherController.sipManager.getContacts.should.have.been.calledWithExactly( );
        cb.should.have.been.calledWithExactly(null, ['some', 'array']);
    } );

    it( 'should return an error when manager throws', function () {
        client.switcherController.sipManager.getContacts.throws();
        command( cb );
        client.switcherController.sipManager.getContacts.should.have.been.calledOnce;
        client.switcherController.sipManager.getContacts.should.have.been.calledWithExactly( );
        cb.should.have.been.calledWithMatch('');
    } );
});