var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

var ScenicClient = require( '../../../src/net/ScenicClient' );

describe( 'Scenic Client', function () {

    var switcherController;
    var config;
    var socket;
    var client;

    beforeEach( function () {
        switcherController = {
        };
        config             = {};
        socket             = {
            on: sinon.stub()
        };
        client             = new ScenicClient( switcherController, config, socket );
    } );

    it( 'Should initialize correctly', function () {
        should.exist( client );
    } );

} );