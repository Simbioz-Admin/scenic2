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
            '../lib/logger':       logStub(),
            '../utils/logback':    function ( e, c ) {
                c( e );
            }
        } );
        switcherController     = new SwitcherController( config, io );
        cb                     = sinon.stub();
    } );

    afterEach( function () {
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
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        it('should create a quiddity', function() {
            var quidd = quiddities.quiddity();
            var quidd_res = quiddities.quiddity_parsed();
            switcherController.quiddityManager.create(quidd.class, quidd.name, 'socketId', cb);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly( null, quidd_res );
        });

        


    });
});