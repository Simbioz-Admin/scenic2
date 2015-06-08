var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

var quiddities   = require( '../../fixtures/quiddities' );

describe( 'Invoke Method Command', function () {

    var client;
    var command;
    var cb;

    beforeEach( function () {
        command = require( '../../../src/net/commands/invokeMethod' );

        client = {
            switcherController: {
                quiddityManager: {
                    invokeMethod: sinon.stub()
                }
            }
        };
        command = command.execute.bind( client );
        cb = sinon.stub();
    } );

    afterEach(function() {
        cb.should.have.been.calledOnce;
    });

    it( 'should return exactly what the manager returns', function () {
        client.switcherController.quiddityManager.invokeMethod.returns(true);
        command('quidd','method', ['argument'], cb);
        client.switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
        client.switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly('quidd', 'method', ['argument']);
        cb.should.have.been.calledWithExactly(null, true);
    } );

    it( 'should return an error when manager throws', function () {
        client.switcherController.quiddityManager.invokeMethod.throws();
        command('quidd', 'method', ['argument'], cb);
        client.switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
        client.switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly('quidd', 'method', ['argument']);
        cb.should.have.been.calledWithMatch(Error);
    } );

    it( 'should return an error when failing to invoke method', function () {
        client.switcherController.quiddityManager.invokeMethod.returns(null);
        command('quidd', 'method', ['argument'], cb);
        client.switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
        client.switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly('quidd', 'method', ['argument']);
        cb.should.have.been.calledWithMatch(''); // Any message is good
    } );

    it( 'should return an error when quiddity parameter is empty', function () {
        command('', 'method', ['argument'], cb);
        client.switcherController.quiddityManager.invokeMethod.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when quiddity parameter is null', function () {
        command(null, 'method', ['argument'], cb);
        client.switcherController.quiddityManager.invokeMethod.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when quiddity parameter is a number', function () {
        command(666, 'method', ['argument'], cb);
        client.switcherController.quiddityManager.invokeMethod.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when quiddity parameter is not a string', function () {
        command(['not a string'], 'method', ['argument'], cb);
        client.switcherController.quiddityManager.invokeMethod.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when method is empty', function () {
        command('quidd', '', ['argument'], cb);
        client.switcherController.quiddityManager.invokeMethod.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when method is null', function () {
        command('quidd', null, ['argument'], cb);
        client.switcherController.quiddityManager.invokeMethod.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when method is a number', function () {
        command('quidd', 666, ['argument'], cb);
        client.switcherController.quiddityManager.invokeMethod.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when method is not a string', function () {
        command('quidd', ['not a string'], ['argument'], cb);
        client.switcherController.quiddityManager.invokeMethod.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

} );