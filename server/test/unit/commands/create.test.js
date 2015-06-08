var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

var quiddities   = require( '../../fixtures/quiddities' );

describe( 'Create Command', function () {

    var client;
    var command;
    var cb;

    beforeEach( function () {
        command = require( '../../../src/net/commands/create' );

        client  = {
            switcherController: {
                quiddityManager: {
                    create: sinon.stub()
                }
            }
        };
        command = command.execute.bind( client );
        cb      = sinon.stub();
    } );

    afterEach( function () {
        cb.should.have.been.calledOnce;
    } );

    it( 'should return the quiddity name returned by the manager', function () {
        client.switcherController.quiddityManager.create.returns( quiddities.quiddity_parsed() );
        command( 'quidd', 'quiddid', 'socketid', cb );
        client.switcherController.quiddityManager.create.should.have.been.calledOnce;
        client.switcherController.quiddityManager.create.should.have.been.calledWithExactly( 'quidd', 'quiddid', 'socketid' );
        cb.should.have.been.calledWithExactly( null, quiddities.quiddity_parsed() );
    } );

    it( 'should work without a quiddity name', function () {
        client.switcherController.quiddityManager.create.returns( quiddities.quiddity_parsed() );
        command( 'quidd', null, 'socketid', cb );
        client.switcherController.quiddityManager.create.should.have.been.calledOnce;
        client.switcherController.quiddityManager.create.should.have.been.calledWithExactly( 'quidd', null, 'socketid' );
        cb.should.have.been.calledWithExactly( null, quiddities.quiddity_parsed() );
    } );

    it( 'should return an error when manager throws', function () {
        client.switcherController.quiddityManager.create.throws();
        command( 'quidd', 'quiddid', 'socketid', cb );
        client.switcherController.quiddityManager.create.should.have.been.calledOnce;
        client.switcherController.quiddityManager.create.should.have.been.calledWithExactly( 'quidd', 'quiddid', 'socketid' );
        cb.should.have.been.calledWithMatch( Error );
    } );

    it( 'should return an error when failing to invoke method', function () {
        client.switcherController.quiddityManager.create.returns( null );
        command( 'quidd', 'quiddid', 'socketid', cb );
        client.switcherController.quiddityManager.create.should.have.been.calledOnce;
        client.switcherController.quiddityManager.create.should.have.been.calledWithExactly( 'quidd', 'quiddid', 'socketid' );
        cb.should.have.been.calledWithMatch( '' ); // Any message is good
    } );

    it( 'should return an error when class parameter is empty', function () {
        command( '', 'quiddid', 'socketid', cb );
        client.switcherController.quiddityManager.create.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when class parameter is null', function () {
        command( null, 'quiddid', 'socketid', cb );
        client.switcherController.quiddityManager.create.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when class parameter is a number', function () {
        command( 666, 'quiddid', 'socketid', cb );
        client.switcherController.quiddityManager.create.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when class parameter is not a string', function () {
        command( ['not a string'], 'quiddid', 'socketid', cb );
        client.switcherController.quiddityManager.create.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

} );