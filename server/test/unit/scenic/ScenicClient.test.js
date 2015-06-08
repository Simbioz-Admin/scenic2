var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

var ScenicClient = require( '../../../src/scenic/ScenicClient' );

describe( 'Scenic Client', function () {

    var switcherController;
    var config;
    var socket;
    var client;

    beforeEach( function () {
        switcherController = {
            bindClient: sinon.stub()
        };
        config             = {};
        socket             = {
            on: sinon.stub()
        };
        client             = new ScenicClient( switcherController, config, socket );
    } );

    it( 'Should initialize correctly', function () {
        should.exist( client );
        switcherController.bindClient.should.have.been.calledOnce;
        switcherController.bindClient.should.have.been.calledWithExactly( socket );
    } );

} );