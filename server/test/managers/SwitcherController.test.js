var proxyquire = require( 'proxyquire' ).noCallThru();
var chai       = require( "chai" );
var sinon      = require( "sinon" );
var sinonChai  = require( "sinon-chai" );
var should     = chai.should();
chai.use( sinonChai );

var logStub      = require( '../fixtures/log' );
var switcherStub = require( '../fixtures/switcher' );

describe( 'Switcher Controller', function () {

    var switcher;
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
        config                 = {
            systemUsage: {quiddName: 'systemusage'}
        };
        io                     = {};
        io.emit                = sinon.spy();
        checkPort              = sinon.stub();
        checkPort.yields();
        fs                     = {};
        var SwitcherController = proxyquire( '../../src/switcher/SwitcherController', {
            'switcher':            switcherStub,
            'fs':                  fs,
            '../utils/check-port': checkPort,
            '../lib/logger':       logStub(),
            '../utils/logback':    function ( e, c ) {
                c( e );
            }
        } );
        switcherController     = new SwitcherController( config, io );
        cb                     = sinon.stub();
        switcher               = switcherController.switcher;
    } );

    afterEach( function () {
        switcher           = null;
        config             = null;
        io                 = null;
        switcherController = null;
        checkPort          = null;
        fs                 = null;
        cb                 = null;
    } );

    function setupForInit() {
        config.soap        = {quiddName: 'soap', port: 123};
        config.rtp         = {quiddName: 'rtp'};
        config.systemUsage = {quiddName: 'usage', period: 1.0};
        config.loadFile    = false;

        switcherController.quiddityManager = sinon.stub( switcherController.quiddityManager );
        switcherController.rtpManager      = sinon.stub( switcherController.rtpManager );
        switcherController.sipManager      = sinon.stub( switcherController.sipManager );
    }

    // Hey, dummy test to get started
    it( 'should exist', function () {
        should.exist( switcherController );
    } );

    describe( 'Initialization', function () {

        it( 'should have been instanciated correctly', function () {
            should.exist( switcherController.config );
            switcherController.config.should.equal( config );

            should.exist( switcherController.io );
            switcherController.io.should.equal( io );

            should.exist( switcherController.quiddityManager );
            switcherController.quiddityManager.should.be.an.instanceOf( require( '../../src/switcher/QuiddityManager' ) );

            should.exist( switcherController.sipManager );
            switcherController.sipManager.should.be.an.instanceOf( require( '../../src/switcher/SipManager' ) );

            should.exist( switcherController.rtpManager );
            switcherController.rtpManager.should.be.an.instanceOf( require( '../../src/switcher/RtpManager' ) );
        } );

        it( 'should initialize correctly', function ( done ) {
            setupForInit();

            switcherController.initialize( function ( error ) {
                should.not.exist( error );
                switcher.register_prop_callback.should.have.been.calledOnce;
                switcher.register_signal_callback.should.have.been.calledOnce;

                switcher.create.should.have.been.calledThrice;
                switcher.create.should.have.been.calledWith( 'rtpsession', config.rtp.quiddName );
                switcher.create.should.have.been.calledWith( 'SOAPcontrolServer', config.soap.quiddName );
                switcher.create.should.have.been.calledWith( 'systemusage', config.systemUsage.quiddName );

                switcher.set_property_value.should.have.been.calledOnce;
                switcher.set_property_value.should.have.been.calledWith( config.systemUsage.quiddName, 'period', String( config.systemUsage.period ) );

                switcher.subscribe_to_signal.should.have.been.calledOnce;
                switcher.subscribe_to_signal.should.have.been.calledWith( config.systemUsage.quiddName, 'on-tree-grafted' );

                switcher.invoke.should.have.been.calledOnce;
                switcher.invoke.should.have.been.calledWith( config.soap.quiddName, 'set_port', [config.soap.port] );

                switcherController.quiddityManager.initialize.should.have.been.calledOnce;
                switcherController.sipManager.initialize.should.have.been.calledOnce;
                switcherController.rtpManager.initialize.should.have.been.calledOnce;

                done();
            } );
        } );

        it( 'should initialize, load file and not set soap port', function ( done ) {
            setupForInit();

            var file        = 'somefile';
            config.loadFile = file;

            switcher.load_history_from_scratch.returns( 'true' );

            switcherController.initialize( function ( error ) {
                should.not.exist( error );
                switcher.load_history_from_scratch.should.have.been.calledOnce;
                switcher.load_history_from_scratch.should.have.been.calledWith( file );

                switcher.invoke.should.not.have.been.called;

                done();
            } );
        } );

        it( 'should initialize, fail to load file and set soap port', function ( done ) {
            setupForInit();

            var file        = 'somefile';
            config.loadFile = file;

            switcher.load_history_from_scratch.returns( false );

            switcherController.initialize( function ( error ) {
                should.not.exist( error );
                switcher.load_history_from_scratch.should.have.been.calledOnce;
                switcher.load_history_from_scratch.should.have.been.calledWith( file );

                switcher.invoke.should.have.been.calledOnce;
                switcher.invoke.should.have.been.calledWith( config.soap.quiddName, 'set_port', [config.soap.port] );

                done();
            } );
        } );
    } );

    describe( 'Manager delegation', function () {

        it( 'should bind client to managers', function () {
            var socket = {on: sinon.spy()};

            switcherController.quiddityManager = sinon.stub( switcherController.quiddityManager );
            switcherController.rtpManager      = sinon.stub( switcherController.rtpManager );
            switcherController.sipManager      = sinon.stub( switcherController.sipManager );

            switcherController.bindClient( socket );

            socket.on.callCount.should.equal( 4 );
            socket.on.should.have.been.calledWith( 'getFiles' );
            socket.on.should.have.been.calledWith( 'loadFile' );
            socket.on.should.have.been.calledWith( 'saveFile' );
            socket.on.should.have.been.calledWith( 'deleteFile' );

            switcherController.quiddityManager.bindClient.should.have.been.calledOnce;
            switcherController.sipManager.bindClient.should.have.been.calledOnce;
            switcherController.rtpManager.bindClient.should.have.been.calledOnce;

            switcherController.quiddityManager.bindClient.should.have.been.calledWith( socket );
            switcherController.sipManager.bindClient.should.have.been.calledWith( socket );
            switcherController.rtpManager.bindClient.should.have.been.calledWith( socket );
        } );

        it( 'should forward property changes to managers', function () {
            switcherController.quiddityManager = sinon.stub( switcherController.quiddityManager );
            switcherController.rtpManager      = sinon.stub( switcherController.rtpManager );
            switcherController.sipManager      = sinon.stub( switcherController.sipManager );

            var quiddity = 'hola';
            var property = 'que';
            var value    = 'tal';

            switcherController._onSwitcherProperty( quiddity, property, value );

            switcherController.quiddityManager.onSwitcherProperty.should.have.been.calledOnce;
            switcherController.sipManager.onSwitcherProperty.should.have.been.calledOnce;
            switcherController.rtpManager.onSwitcherProperty.should.have.been.calledOnce;

            switcherController.quiddityManager.onSwitcherProperty.should.have.been.calledWith( quiddity, property, value );
            switcherController.sipManager.onSwitcherProperty.should.have.been.calledWith( quiddity, property, value );
            switcherController.rtpManager.onSwitcherProperty.should.have.been.calledWith( quiddity, property, value );
        } );

        it( 'should forward signals to managers', function () {
            switcherController.quiddityManager = sinon.stub( switcherController.quiddityManager );
            switcherController.rtpManager      = sinon.stub( switcherController.rtpManager );
            switcherController.sipManager      = sinon.stub( switcherController.sipManager );

            var quiddity = 'hola';
            var signal   = 'que';
            var value    = 'tal';

            switcherController._onSwitcherSignal( quiddity, signal, value );

            switcherController.quiddityManager.onSwitcherSignal.should.have.been.calledOnce;
            switcherController.sipManager.onSwitcherSignal.should.have.been.calledOnce;
            switcherController.rtpManager.onSwitcherSignal.should.have.been.calledOnce;

            switcherController.quiddityManager.onSwitcherSignal.should.have.been.calledWith( quiddity, signal, value );
            switcherController.sipManager.onSwitcherSignal.should.have.been.calledWith( quiddity, signal, value );
            switcherController.rtpManager.onSwitcherSignal.should.have.been.calledWith( quiddity, signal, value );
        } );

    } );

    describe( 'Signal Events', function () {


        it( 'should pass along system usage grafts', function () {
            var id     = 'systemusage';
            var signal = 'on-tree-grafted';
            var val    = 'smtng';
            var ret    = 'sysinfo';

            switcherController.quiddityManager = sinon.stub( switcherController.quiddityManager );
            switcherController.rtpManager      = sinon.stub( switcherController.rtpManager );
            switcherController.sipManager      = sinon.stub( switcherController.sipManager );

            switcher.get_info.returns( ret );
            switcherController._onSwitcherSignal( id, signal, [val] );
            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWith( id, val );
            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWith( 'systemusage', ret );
        } );

        it( 'should not pass along system usage prunes', function () {
            var id     = 'systemusage';
            var signal = 'on-tree-pruned';
            var val    = 'smtng';

            switcherController.quiddityManager = sinon.stub( switcherController.quiddityManager );
            switcherController.rtpManager      = sinon.stub( switcherController.rtpManager );
            switcherController.sipManager      = sinon.stub( switcherController.sipManager );

            switcherController._onSwitcherSignal( id, signal, [val] );
            io.emit.should.not.have.been.called;
        } );


    } );

    describe( 'Shutdown', function () {

        it( 'should emit a shutdown on close', function () {
            switcherController.close();
            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWith( 'shutdown' );
            switcher.close.should.have.been.calledOnce;
        } );

    } );

    describe( 'File operations', function () {

        it( 'should get save files', function () {
            var files = ['file-a', 'file-b'];

            config.savePath = 'some/path/';

            fs.readdir = sinon.stub();
            fs.readdir.yields( null, files );

            switcherController.getSaveFiles( cb );

            fs.readdir.should.have.been.calledOnce;
            fs.readdir.should.have.been.calledWith( config.savePath );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWith( null, files );
        } );

        it( 'should get an error when save files loading throws', function () {
            var error = 'some error';

            fs.readdir = sinon.stub();
            fs.readdir.throws( error );

            switcherController.getSaveFiles( cb );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should get an error when save files loading fails', function () {
            var error = 'some error';

            fs.readdir = sinon.stub();
            fs.readdir.yields( error, null );

            switcherController.getSaveFiles( cb );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should get a save file', function () {
            var file = 'file.json';

            config.savePath = 'some/path/';

            switcher.load_history_from_scratch.returns( true );

            switcherController.loadSaveFile( file, cb );

            switcher.load_history_from_scratch.should.have.been.calledOnce;
            switcher.load_history_from_scratch.should.have.been.calledWith( config.savePath + file );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        } );

        it( 'should get an error when loading save file throws', function () {
            var file  = 'file.json';
            var error = 'some error';

            config.savePath = 'some/path/';

            switcher.load_history_from_scratch.throws( error );

            switcherController.loadSaveFile( file, cb );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should get an error when loading save file fails', function () {
            var file = 'file.json';

            config.savePath = 'some/path/';

            switcher.load_history_from_scratch.returns( false );

            switcherController.loadSaveFile( file, cb );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( file ); // Error contains file name...
        } );

        it( 'should save a save file', function () {
            var file = 'file.json';

            config.savePath = 'some/path/';

            switcher.save_history.returns( 'true' );

            switcherController.saveFile( file, cb );

            switcher.save_history.should.have.been.calledOnce;
            switcher.save_history.should.have.been.calledWith( config.savePath + file );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        } );

        it( 'should get an error when saving save file throws', function () {
            var file  = 'file.json';
            var error = 'some error';

            config.savePath = 'some/path/';

            switcher.save_history.throws( error );

            switcherController.saveFile( file, cb );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should get an error when saving save file fails', function () {
            var file = 'file.json';

            config.savePath = 'some/path/';

            switcher.save_history.returns( false );

            switcherController.saveFile( file, cb );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( file ); // Error contains file name...
        } );

        it( 'should delete a save file', function () {
            var file = 'file.json';

            config.savePath = 'some/path/';

            fs.unlink = sinon.stub();
            fs.unlink.yields( null );

            switcherController.deleteFile( file, cb );

            fs.unlink.should.have.been.calledOnce;
            fs.unlink.should.have.been.calledWith( config.savePath + file );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        } );

        it( 'should get an error when deletind a save file throws', function () {
            var file  = 'file.json';
            var error = 'some error';

            fs.unlink = sinon.stub();
            fs.unlink.throws( error );

            switcherController.deleteFile( file, cb );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should get an error when deleting a save file fails', function () {
            var file  = 'file.json';
            var error = 'some error';

            fs.unlink = sinon.stub();
            fs.unlink.yields( error, null );

            switcherController.deleteFile( file, cb );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

    } );

} );