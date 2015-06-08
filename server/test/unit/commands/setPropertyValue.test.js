var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

var quiddities   = require( '../../fixtures/quiddities' );

describe( 'Get Property Description Command', function () {

    var client;
    var command;
    var cb;

    beforeEach( function () {
        command = require( '../../../src/net/commands/setPropertyValue' );

        client = {
            switcherController: {
                quiddityManager: {
                    setPropertyValue: sinon.stub()
                }
            }
        };
        command = command.execute.bind( client );
        cb = sinon.stub();
    } );

    afterEach(function() {
        cb.should.have.been.calledOnce;
    });

    it( 'should return nothing when successful', function () {
        client.switcherController.quiddityManager.setPropertyValue.returns(true);
        command('quidd','property', 'value', cb);
        client.switcherController.quiddityManager.setPropertyValue.should.have.been.calledOnce;
        client.switcherController.quiddityManager.setPropertyValue.should.have.been.calledWithExactly('quidd', 'property', 'value');
        cb.should.have.been.calledWithExactly();
    } );

    it( 'should return an error when manager throws', function () {
        client.switcherController.quiddityManager.setPropertyValue.throws();
        command('quidd', 'property', 'value', cb);
        client.switcherController.quiddityManager.setPropertyValue.should.have.been.calledOnce;
        client.switcherController.quiddityManager.setPropertyValue.should.have.been.calledWithExactly('quidd', 'property', 'value');
        cb.should.have.been.calledWithMatch(Error);
    } );

    it( 'should return an error when failing to set property', function () {
        client.switcherController.quiddityManager.setPropertyValue.returns(false);
        command('quidd', 'property', 'value', cb);
        client.switcherController.quiddityManager.setPropertyValue.should.have.been.calledOnce;
        client.switcherController.quiddityManager.setPropertyValue.should.have.been.calledWithExactly('quidd', 'property', 'value');
        cb.should.have.been.calledWithMatch(''); // Any message is good
    } );

    it( 'should return an error when quiddity parameter is empty', function () {
        command('', 'property', 'value', cb);
        client.switcherController.quiddityManager.setPropertyValue.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when quiddity parameter is null', function () {
        command(null, 'property', 'value', cb);
        client.switcherController.quiddityManager.setPropertyValue.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when quiddity parameter is a number', function () {
        command(666, 'property', 'value', cb);
        client.switcherController.quiddityManager.setPropertyValue.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when quiddity parameter is not a string', function () {
        command(['not a string'], 'property', 'value', cb);
        client.switcherController.quiddityManager.setPropertyValue.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when property is empty', function () {
        command('quidd', '', 'value', cb);
        client.switcherController.quiddityManager.setPropertyValue.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when property is null', function () {
        command('quidd', null, 'value', cb);
        client.switcherController.quiddityManager.setPropertyValue.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when property is a number', function () {
        command('quidd', 666, 'value', cb);
        client.switcherController.quiddityManager.setPropertyValue.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when property is not a string', function () {
        command('quidd', ['not a string'], 'value', cb);
        client.switcherController.quiddityManager.setPropertyValue.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    //NOTE: We don't test for value as it can be anything, even null

} );