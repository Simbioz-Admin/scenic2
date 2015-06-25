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

describe( 'Switcher Controller', function () {

    var switcher;
    var config;
    var io;
    var switcherController;
    var checkPort;
    var fs;

    beforeEach( function () {
        config                 = {
            systemUsage: { quiddName: 'systemusage' }
        };
        io                     = {};
        io.emit                = sinon.stub();
        checkPort              = sinon.stub();
        checkPort.yields();
        fs                     = {};
        var SwitcherController = proxyquire( '../../../src/switcher/SwitcherController', {
            'switcher':            switcherStub,
            'fs':                  fs,
            '../utils/check-port': checkPort,
            '../lib/logger':       logStub()
        } );
        switcherController     = new SwitcherController( config, io );
        switcher               = switcherController.switcher;
    } );

    afterEach( function () {
        switcher           = null;
        config             = null;
        io                 = null;
        switcherController = null;
        checkPort          = null;
        fs                 = null;
    } );

    function setupForInit() {
        config.soap        = { quiddName: 'soap', port: 123 };
        config.rtp         = { quiddName: 'rtp' };
        config.systemUsage = { quiddName: 'usage', period: 1.0 };
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

        it( 'should have been instantiated correctly', function () {
            should.exist( switcherController.config );
            switcherController.config.should.equal( config );

            should.exist( switcherController.io );
            switcherController.io.should.equal( io );

            should.exist( switcherController.quiddityManager );
            switcherController.quiddityManager.should.be.an.instanceOf( require( '../../../src/switcher/QuiddityManager' ) );

            should.exist( switcherController.sipManager );
            switcherController.sipManager.should.be.an.instanceOf( require( '../../../src/switcher/SipManager' ) );

            should.exist( switcherController.rtpManager );
            switcherController.rtpManager.should.be.an.instanceOf( require( '../../../src/switcher/RtpManager' ) );
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
            var socket = { on: sinon.spy() };
            switcherController.rtpManager = sinon.stub( switcherController.rtpManager );
            switcherController.sipManager = sinon.stub( switcherController.sipManager );
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

        /* DEPRECATED it( 'should pass along system usage grafts', function () {
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
        } );*/

        /* DEPRECATED it( 'should not pass along system usage prunes', function () {
            var id     = 'systemusage';
            var signal = 'on-tree-pruned';
            var val    = 'smtng';

            switcherController.quiddityManager = sinon.stub( switcherController.quiddityManager );
            switcherController.rtpManager      = sinon.stub( switcherController.rtpManager );
            switcherController.sipManager      = sinon.stub( switcherController.sipManager );

            switcherController._onSwitcherSignal( id, signal, [val] );
            io.emit.should.not.have.been.called;
        } );*/


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

        var file;
        var ext;

        beforeEach(function() {
            ext = '.json';
            file            = 'file';
            config.savePath = 'some/path/';
        });

        describe( 'File list', function () {

            var cb;

            beforeEach( function () {
                cb = sinon.stub();
            } );

            it( 'should get save files', function () {
                var files_fs       = ['file-a.json', 'file-b.json'];
                var files_ui       = ['file-a', 'file-b'];
                config.savePath = 'some/path/';
                fs.readdir      = sinon.stub();
                fs.readdir.yields( null, files_fs );
                switcherController.getFileList( cb );
                fs.readdir.should.have.been.calledOnce;
                fs.readdir.should.have.been.calledWith( config.savePath );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWith( null, files_ui );
            } );

            it( 'should get an error when save files loading throws', function () {
                var error  = 'some error';
                fs.readdir = sinon.stub();
                fs.readdir.throws( new Error( error ) );
                switcherController.getFileList( cb );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
            } );

            it( 'should get an error when save files loading fails', function () {
                var error  = 'some error';
                fs.readdir = sinon.stub();
                fs.readdir.yields( error, null );
                switcherController.getFileList( cb );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
            } );

        } );

        describe( 'Loading save file', function () {

            it( 'should get a save file', function () {
                switcher.load_history_from_scratch.returns( true );
                var result = switcherController.loadFile( file );
                switcher.load_history_from_scratch.should.have.been.calledOnce;
                switcher.load_history_from_scratch.should.have.been.calledWith( config.savePath + file + ext );
                should.exist( result );
                result.should.be.true;
                io.emit.should.have.been.calledTwice;
                io.emit.should.have.been.calledBefore(switcher.load_history_from_scratch);
                io.emit.should.have.been.calledWithExactly( 'file.loading', file );
                io.emit.should.have.been.calledWithExactly( 'file.loaded', file );
            } );

            it( 'should throw an error when loading save file throws', function () {
                var error = 'some error';
                switcher.load_history_from_scratch.throws( new Error( error ) );
                expect( switcherController.loadFile.bind( switcherController, file ) ).to.throw( error );
                switcher.load_history_from_scratch.should.have.been.calledOnce;
                switcher.load_history_from_scratch.should.have.been.calledWith( config.savePath + file + ext );
                io.emit.should.have.been.calledOnce;
                io.emit.should.have.been.calledBefore(switcher.load_history_from_scratch);
                io.emit.should.have.been.calledWithExactly( 'file.loading', file );
            } );

            it( 'should return false when loading save file fails', function () {
                switcher.load_history_from_scratch.returns( false );
                var result = switcherController.loadFile( file );
                should.exist( result );
                result.should.be.false;
                io.emit.should.have.been.calledTwice;
                io.emit.should.have.been.calledBefore(switcher.load_history_from_scratch);
                io.emit.should.have.been.calledWithExactly( 'file.loading', file );
                io.emit.should.have.been.calledWithExactly( 'file.load.error', file );
            } );

            it( 'should clean save file name from junk', function () {
                switcher.load_history_from_scratch.returns( true );
                var result = switcherController.loadFile( '../my:dirty.file' );
                switcher.load_history_from_scratch.should.have.been.calledOnce;
                switcher.load_history_from_scratch.should.have.been.calledWith( config.savePath + 'mydirtyfile' + ext );
                should.exist( result );
                result.should.be.true;
                io.emit.should.have.been.calledTwice;
                io.emit.should.have.been.calledBefore(switcher.load_history_from_scratch);
                io.emit.should.have.been.calledWithExactly( 'file.loading', 'mydirtyfile' );
                io.emit.should.have.been.calledWithExactly( 'file.loaded', 'mydirtyfile' );
            } );

        } );

        describe( 'Saving scenic file', function () {

            it( 'should save a save file', function () {
                switcher.save_history.returns( true );
                var result = switcherController.saveFile( file );
                switcher.save_history.should.have.been.calledOnce;
                switcher.save_history.should.have.been.calledWith( config.savePath + file + ext );
                should.exist( result );
                result.should.be.true;
                io.emit.should.have.been.calledOnce;
                io.emit.should.have.been.calledWithExactly( 'file.saved', file );
            } );

            it( 'should get an error when saving save file throws', function () {
                var error = 'some error';
                switcher.save_history.throws( new Error( error ) );
                expect( switcherController.saveFile.bind( switcherController, file ) ).to.throw( error );
                switcher.save_history.should.have.been.calledOnce;
                switcher.save_history.should.have.been.calledWith( config.savePath + file + ext );
                io.emit.should.not.have.been.called;
            } );

            it( 'should return false when saving save file fails', function () {
                switcher.save_history.returns( false );
                var result = switcherController.saveFile( file + ext );
                should.exist( result );
                result.should.be.false;
                io.emit.should.not.have.been.called;
            } );

            it( 'should remove two dots from name', function () {
                switcher.save_history.returns( true );
                var result = switcherController.saveFile( '..test' );
                switcher.save_history.should.have.been.calledOnce;
                switcher.save_history.should.have.been.calledWith( config.savePath + 'test' + ext );
                should.exist( result );
                result.should.be.true;
                io.emit.should.have.been.calledOnce;
                io.emit.should.have.been.calledWithExactly( 'file.saved', 'test' );
            } );

            it( 'should remove slashes from name', function () {
                switcher.save_history.returns( true );
                var result = switcherController.saveFile( '/test' );
                switcher.save_history.should.have.been.calledOnce;
                switcher.save_history.should.have.been.calledWith( config.savePath + 'test' + ext );
                should.exist( result );
                result.should.be.true;
                io.emit.should.have.been.calledOnce;
                io.emit.should.have.been.calledWithExactly( 'file.saved', 'test' );
            } );

            it( 'should remove backslashes from name', function () {
                switcher.save_history.returns( true );
                var result = switcherController.saveFile( '\\test' );
                switcher.save_history.should.have.been.calledOnce;
                switcher.save_history.should.have.been.calledWith( config.savePath + 'test' + ext );
                should.exist( result );
                result.should.be.true;
                io.emit.should.have.been.calledOnce;
                io.emit.should.have.been.calledWithExactly( 'file.saved', 'test' );
            } );

            it( 'should make a really clean path name from junk from name', function () {
                switcher.save_history.returns( true );
                var result = switcherController.saveFile( '../../my:test.blah/../pouet' );
                switcher.save_history.should.have.been.calledOnce;
                switcher.save_history.should.have.been.calledWith( config.savePath + 'mytestblahpouet' + ext );
                should.exist( result );
                result.should.be.true;
                io.emit.should.have.been.calledOnce;
                io.emit.should.have.been.calledWithExactly( 'file.saved', 'mytestblahpouet' );
            } );

        } );

        describe( 'Deleting scenic file', function () {

            var cb;

            beforeEach( function () {
                cb              = sinon.stub();
            } );

            it( 'should delete a save file', function () {
                fs.unlink = sinon.stub();
                fs.unlink.yields( null );
                switcherController.deleteFile( file, cb );
                fs.unlink.should.have.been.calledOnce;
                fs.unlink.should.have.been.calledWith( config.savePath + file + ext );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithExactly();
                io.emit.should.have.been.calledOnce;
                io.emit.should.have.been.calledWithExactly( 'file.deleted', file );
            } );

            it( 'should get an error when deleting a save file throws', function () {
                var error = 'some error';
                fs.unlink = sinon.stub();
                fs.unlink.throws( new Error( error ) );
                switcherController.deleteFile( file, cb );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
                io.emit.should.not.have.been.called;
            } );

            it( 'should get an error when deleting a save file fails', function () {
                var error = 'some error';
                fs.unlink = sinon.stub();
                fs.unlink.yields( error, null );
                switcherController.deleteFile( file, cb );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
                io.emit.should.not.have.been.called;
            } );

            it( 'should clean dirty file names before deleting a save file', function () {
                fs.unlink = sinon.stub();
                fs.unlink.yields( null );
                switcherController.deleteFile( '../my:dirty.file', cb );
                fs.unlink.should.have.been.calledOnce;
                fs.unlink.should.have.been.calledWith( config.savePath + 'mydirtyfile' + ext );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithExactly();
                io.emit.should.have.been.calledOnce;
                io.emit.should.have.been.calledWithExactly( 'file.deleted', 'mydirtyfile' );
            } );

        } );

    } );

} );