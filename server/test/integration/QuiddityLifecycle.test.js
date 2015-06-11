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
    var cb;

    before( function ( done ) {
        var i18n = require( '../../src/lib/i18n' );
        i18n.initialize( done );
    } );

    beforeEach( function () {
        config                 = require( '../fixtures/config' );
        io                     = {};
        io.emit                = sinon.spy();
        checkPort              = sinon.stub();
        checkPort.yields();
        fs                     = {};
        var SwitcherController = proxyquire( '../../src/switcher/SwitcherController', {
            'fs':                  fs,
            '../utils/check-port': checkPort,
            //'../lib/logger':       logStub(),
            '../utils/logback':    function ( e, c ) {
                //if ( e ) { console.error( e ); }
                c( e );
            }
        } );
        switcherController     = new SwitcherController( config, io );
        cb                     = sinon.stub();
    } );

    afterEach( function () {
        switcherController.close();
        config             = null;
        io                 = null;
        switcherController = null;
        checkPort          = null;
        fs                 = null;
        cb                 = null;
    } );

    describe('Creating Quiddities', function() {

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            switcherController.quiddityManager.create(quidd.class, quidd.id, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd );
        });

        it.skip('should create a quiddity and start it', function( done ) {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();

            async.series( [
                function( callback ) {
                    switcherController.quiddityManager.create( 'audiotestsrc', 'audio', 'socketId', callback );
                },

                function( callback ) {
                    switcherController.quiddityManager.setPropertyValue( 'audio', 'started', true, callback );
                }
            ], function( error ) {
                if ( error ) {
                    return done( error )
                }

                var val = switcherController.switcher.get_property_value('audio', 'started');

                should.exist( val );
                val.should.equal(true);

                //TODO: Test here
                done();

            } );
        });

        it.skip('should create a fakesink and start it', function( ) {
            var created = switcherController.switcher.create( 'fakesink' );
            should.exist( created );
            created.should.be.equal('fakesink0');

            var val = switcherController.switcher.get_quiddity_description('fakesink0');

            should.exist( val );
        });

        it('should create a sip quiddity', function() {
            switcherController.quiddityManager.create('sip', 'sip', 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWith( null );
        });

    });
});