var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

var quiddities   = require( '../../fixtures/quiddities' );

describe( 'Get Quiddity Classes Command', function () {

    var client;
    var command;
    var cb;

    beforeEach( function () {
        command = require( '../../../src/net/commands/class.list' );

        client = {
            switcherController: {
                quiddityManager: {
                    getQuiddityClasses: sinon.stub()
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
        client.switcherController.quiddityManager.getQuiddityClasses.returns([]);
        command(cb);
        client.switcherController.quiddityManager.getQuiddityClasses.should.have.been.calledOnce;
        client.switcherController.quiddityManager.getQuiddityClasses.should.have.been.calledWithExactly;
        cb.should.have.been.calledWithExactly(null, []);
    } );

    it( 'should return an error when manager throws', function () {
        client.switcherController.quiddityManager.getQuiddityClasses.throws();
        command(cb);
        client.switcherController.quiddityManager.getQuiddityClasses.should.have.been.calledOnce;
        client.switcherController.quiddityManager.getQuiddityClasses.should.have.been.calledWithExactly;
        cb.should.have.been.calledWithMatch('');
    } );

} );