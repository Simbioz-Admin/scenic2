var async = require('async');
var proxyquire = require( 'proxyquire' ).noCallThru();
var chai       = require( "chai" );
var sinon      = require( "sinon" );
var sinonChai  = require( "sinon-chai" );
var should     = chai.should();
chai.use( sinonChai );

var logStub      = require( '../fixtures/log' );
var quiddities   = require( '../fixtures/quiddities' );

describe( 'Quiddity Lifecycle', function () {

    var config;
    var io;
    var switcherController;
    var checkPort;
    var fs;

    beforeEach( function () {
        config                 = require( '../fixtures/config' );
        io                     = {};
        io.emit                = sinon.spy();
        checkPort              = sinon.stub();
        checkPort.yields();
        fs                     = {};
        var SwitcherController = proxyquire( '../../src/switcher/SwitcherController', {
            'fs':                  fs,
            '../utils/check-port': checkPort
        } );
        switcherController     = new SwitcherController( config, io );
    } );

    afterEach( function () {
        switcherController.close();
        config             = null;
        io                 = null;
        switcherController = null;
        checkPort          = null;
        fs                 = null;
    } );

    describe('Creating Quiddities', function() {

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            var result = switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId');
            should.exist( result );
            result.should.eql( quidd_res );
        });

        it('should create a quiddity and start it', function( ) {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            var create_result = switcherController.quiddityManager.create( 'audiotestsrc', 'audio', 'socketId' );
            var set_property_result = switcherController.quiddityManager.setPropertyValue( 'audio', 'started', true );
            var val = switcherController.switcher.get_property_value('audio', 'started');
            should.exist( val );
            val.should.equal(true);
        });

        it('should create a fakesink and start it', function( ) {
            var created = switcherController.switcher.create( 'fakesink' );
            should.exist( created );
            created.should.be.equal('fakesink0');
            var val = switcherController.switcher.get_quiddity_description('fakesink0');
            should.exist( val );
        });

        it('should create a sip quiddity', function() {
            var result = switcherController.quiddityManager.create('sip', 'sip', 'socketId');
            should.exist(result);
        });

    });
});