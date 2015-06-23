var _          = require( 'underscore' );
var proxyquire = require( 'proxyquire' ).noCallThru();
var chai       = require( "chai" );
var sinon      = require( "sinon" );
var sinonChai  = require( "sinon-chai" );
var should     = chai.should();
var expect     = chai.expect;
chai.use( sinonChai );

var logStub      = require( '../../fixtures/log' );
var switcherStub = require( '../../fixtures/switcher' );
var quiddities   = require( '../../fixtures/quiddities' );

describe( 'Sip Manager', function () {

    var switcher;
    var io;
    var config;
    var switcherController;
    var controlManager;

    beforeEach( function () {
        io      = {};
        io.emit = sinon.stub();
        config  = {};

        var ControlManager = proxyquire( '../../../src/switcher/ControlManager', {
            '../lib/logger': logStub()
        } );

        var SwitcherController = proxyquire( '../../../src/switcher/SwitcherController', {
            './ControlManager': ControlManager,
            'switcher':         switcherStub
        } );

        switcherController = new SwitcherController( config, io );
        switcher           = switcherController.switcher;
        controlManager     = switcherController.controlManager;
    } );

    afterEach( function () {
        switcher       = null;
        config         = null;
        io             = null;
        controlManager = null;
    } );

    // Hey, dummy test to get started
    it( 'should exist', function () {
        should.exist( controlManager );
    } );

    describe( 'Initialization', function () {

        it( 'should have been instantiated correctly', function () {
            should.exist( controlManager.config );
            controlManager.config.should.equal( config );

            should.exist( controlManager.switcher );
            controlManager.switcher.should.equal( switcher );

            should.exist( controlManager.io );
            controlManager.io.should.equal( io );
    } );

} );