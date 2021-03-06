var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

var quiddities   = require( '../../fixtures/quiddities' );

describe( 'Get Properties Command', function () {

    var client;
    var command;
    var cb;

    beforeEach( function () {
        command = require( '../../../src/net/commands/quiddity.property.list' );

        client = {
            switcherController: {
                quiddityManager: {
                    getProperties: sinon.stub()
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
        client.switcherController.quiddityManager.getProperties.returns([]);
        command('quidd', cb);
        client.switcherController.quiddityManager.getProperties.should.have.been.calledOnce;
        client.switcherController.quiddityManager.getProperties.should.have.been.calledWithExactly('quidd');
        cb.should.have.been.calledWithExactly(null, []);
    } );

    it( 'should return an error when manager throws', function () {
        client.switcherController.quiddityManager.getProperties.throws();
        command('quidd', cb);
        client.switcherController.quiddityManager.getProperties.should.have.been.calledOnce;
        client.switcherController.quiddityManager.getProperties.should.have.been.calledWithExactly('quidd');
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when quiddity parameter is empty', function () {
        command('', cb);
        client.switcherController.quiddityManager.getProperties.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when quiddity parameter is null', function () {
        command(null, cb);
        client.switcherController.quiddityManager.getProperties.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when quiddity parameter is a number', function () {
        command(666, cb);
        client.switcherController.quiddityManager.getProperties.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when quiddity parameter is not a string', function () {
        command(['not a string'], cb);
        client.switcherController.quiddityManager.getProperties.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

} );