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
        command = require( '../../../src/net/commands/getPropertyDescription' );

        client = {
            switcherController: {
                quiddityManager: {
                    getPropertyDescription: sinon.stub()
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
        client.switcherController.quiddityManager.getPropertyDescription.returns({});
        command('quidd','property', cb);
        client.switcherController.quiddityManager.getPropertyDescription.should.have.been.calledOnce;
        client.switcherController.quiddityManager.getPropertyDescription.should.have.been.calledWithExactly('quidd', 'property');
        cb.should.have.been.calledWithExactly(null, {});
    } );

    it( 'should return an error when manager throws', function () {
        client.switcherController.quiddityManager.getPropertyDescription.throws();
        command('quidd', 'property', cb);
        client.switcherController.quiddityManager.getPropertyDescription.should.have.been.calledOnce;
        client.switcherController.quiddityManager.getPropertyDescription.should.have.been.calledWithExactly('quidd', 'property');
        cb.should.have.been.calledWithMatch(Error);
    } );

    it( 'should return an error when quiddity parameter is empty', function () {
        command('', 'property', cb);
        client.switcherController.quiddityManager.getPropertyDescription.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when quiddity parameter is null', function () {
        command(null, 'property', cb);
        client.switcherController.quiddityManager.getPropertyDescription.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when quiddity parameter is a number', function () {
        command(666, 'property', cb);
        client.switcherController.quiddityManager.getPropertyDescription.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when quiddity parameter is not a string', function () {
        command(['not a string'], 'property', cb);
        client.switcherController.quiddityManager.getPropertyDescription.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when property is empty', function () {
        command('quidd', '', cb);
        client.switcherController.quiddityManager.getPropertyDescription.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when property is null', function () {
        command('quidd', null, cb);
        client.switcherController.quiddityManager.getPropertyDescription.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when property is a number', function () {
        command('quidd', 666, cb);
        client.switcherController.quiddityManager.getPropertyDescription.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when property is not a string', function () {
        command('quidd', ['not a string'], cb);
        client.switcherController.quiddityManager.getPropertyDescription.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );


} );