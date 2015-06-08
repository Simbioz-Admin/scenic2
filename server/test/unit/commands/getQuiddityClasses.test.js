var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

var ScenicClient = require( '../../../src/scenic/ScenicClient' );
var quiddities   = require( '../../fixtures/quiddities' );

describe.only( 'Qet Quiddity Classes Command', function () {

    var client;
    var command;
    var cb;

    beforeEach( function () {
        command = require( '../../../src/scenic/commands/getQuiddityClasses' );

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

    it( 'Should return exactly what switcher returns', function () {
        client.switcherController.quiddityManager.getQuiddityClasses.returns([]);
        command(cb);
        cb.should.have.been.calledWithExactly(null, []);
    } );

    it( 'Should return an error when switcher throws', function () {
        client.switcherController.quiddityManager.getQuiddityClasses.throws();
        command(cb);
        cb.should.have.been.calledWithMatch(Error);
    } );

} );