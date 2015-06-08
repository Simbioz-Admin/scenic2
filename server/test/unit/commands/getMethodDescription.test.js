var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

var quiddities   = require( '../../fixtures/quiddities' );

describe( 'Get Method Description Command', function () {

    var client;
    var command;
    var cb;

    beforeEach( function () {
        command = require( '../../../src/net/commands/getMethodDescription' );

        client = {
            switcherController: {
                quiddityManager: {
                    getMethodDescription: sinon.stub()
                }
            }
        };
        command = command.execute.bind( client );
        cb = sinon.stub();
    } );

    afterEach(function() {
        cb.should.have.been.calledOnce;
    });

    it( 'should return the object that the manager returns', function () {
        client.switcherController.quiddityManager.getMethodDescription.returns({});
        command('quidd','method', cb);
        client.switcherController.quiddityManager.getMethodDescription.should.have.been.calledOnce;
        client.switcherController.quiddityManager.getMethodDescription.should.have.been.calledWithExactly('quidd', 'method');
        cb.should.have.been.calledWithExactly(null, {});
    } );

    it( 'should return an error when manager throws', function () {
        client.switcherController.quiddityManager.getMethodDescription.throws();
        command('quidd', 'method', cb);
        client.switcherController.quiddityManager.getMethodDescription.should.have.been.calledOnce;
        client.switcherController.quiddityManager.getMethodDescription.should.have.been.calledWithExactly('quidd', 'method');
        cb.should.have.been.calledWithMatch(Error);
    } );

    it( 'should return an error when quiddity parameter is empty', function () {
        command('', 'method', cb);
        client.switcherController.quiddityManager.getMethodDescription.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when quiddity parameter is null', function () {
        command(null, 'method', cb);
        client.switcherController.quiddityManager.getMethodDescription.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when quiddity parameter is a number', function () {
        command(666, 'method', cb);
        client.switcherController.quiddityManager.getMethodDescription.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when quiddity parameter is not a string', function () {
        command(['not a string'], 'method', cb);
        client.switcherController.quiddityManager.getMethodDescription.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when method is empty', function () {
        command('quidd', '', cb);
        client.switcherController.quiddityManager.getMethodDescription.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when method is null', function () {
        command('quidd', null, cb);
        client.switcherController.quiddityManager.getMethodDescription.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when method is a number', function () {
        command('quidd', 666, cb);
        client.switcherController.quiddityManager.getMethodDescription.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when method is not a string', function () {
        command('quidd', ['not a string'], cb);
        client.switcherController.quiddityManager.getMethodDescription.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );


} );