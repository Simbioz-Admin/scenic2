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

describe( 'RTP Manager', function () {

    var switcher;
    var io;
    var config;
    var switcherController;
    var rtpManager;

    before( function ( done ) {
        var i18n = require( '../../../src/lib/i18n' );
        i18n.initialize( done );
    } );

    beforeEach( function () {
        io      = {};
        io.emit = sinon.spy();
        config  = {
            nameComputer: 'computer-name',
            host:         'myhost.local',
            rtp:          {
                quiddName: 'rtp-quiddity-name'
            },
            soap:         {
                controlClientPrefix: 'soap-control-client-prefix-',
                port:                '1234'
            },
            httpSdpDec:   {
                refreshTimeout: 250 //Lower for the sake of the tests
            }
        };

        var RtpManager = proxyquire( '../../../src/switcher/RtpManager', {
            '../lib/logger': logStub()
        } );

        var SwitcherController = proxyquire( '../../../src/switcher/SwitcherController', {
            './RtpManager': RtpManager,
            'switcher':     switcherStub
        } );

        switcherController = new SwitcherController( config, io );
        switcher           = switcherController.switcher;
        rtpManager         = switcherController.rtpManager;
    } );

    afterEach( function () {
        switcher   = null;
        config     = null;
        io         = null;
        rtpManager = null;
    } );

    // Hey, dummy test to get started
    it( 'should exist', function () {
        should.exist( rtpManager );
    } );

    describe( 'Initialization', function () {

        it( 'should have been instantiated correctly', function () {
            should.exist( rtpManager.config );
            rtpManager.config.should.equal( config );

            should.exist( rtpManager.switcher );
            rtpManager.switcher.should.equal( switcher );

            should.exist( rtpManager.io );
            rtpManager.io.should.equal( io );
        } );

    } );

    describe( 'Internals', function () {

        describe( 'HTTP SDP Dec. refresh', function () {

            var id;
            var url;

            beforeEach( function () {
                id  = 'someId';
                url = 'http://' + config.host + ':' + config.soap.port + '/sdp?rtpsession=' + config.rtp.quiddName + '&destination=' + id;
                sinon.stub( switcherController.quiddityManager, 'invokeMethod' );
            } );

            it( 'should follow protocol', function ( done ) {
                switcherController.quiddityManager.invokeMethod.returns( true );
                rtpManager._refreshHttpSdpDec( id, function ( error ) {
                    should.not.exist( error );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly(
                        config.soap.controlClientPrefix + id,
                        'invoke1',
                        [config.nameComputer, 'to_shmdata', url]
                    );
                    done();
                } );
            } );

            it( 'should callback an error when refresh fails', function ( done ) {
                switcherController.quiddityManager.invokeMethod.returns( false );
                rtpManager._refreshHttpSdpDec( id, function ( error ) {
                    should.exist( error );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly(
                        config.soap.controlClientPrefix + id,
                        'invoke1',
                        [config.nameComputer, 'to_shmdata', url]
                    );
                    done();
                } );
            } );

        } );

    } );

    describe( 'Creating RTP destination', function () {

        var name;
        var host;
        var port;

        beforeEach( function () {
            name = 'some name';
            host = 'some.host';
            port = 9090;
            sinon.stub( switcherController.quiddityManager, 'getPropertyValue' );
            sinon.stub( switcherController.quiddityManager, 'invokeMethod' );
        } );

        describe( 'Various partial successful cases', function () {

            var result;

            beforeEach( function () {
                result = undefined;
                switcherController.quiddityManager.getPropertyValue.returns( quiddities.destinations_json() );
                switcherController.quiddityManager.invokeMethod.returns( true );
            } );

            afterEach( function () {
                switcherController.quiddityManager.getPropertyValue.should.have.been.calledOnce;
                switcherController.quiddityManager.getPropertyValue.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

                switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );

                switcher.create.should.not.have.been.called;

                should.exist( result );
                result.should.be.true;
            } );

            it( 'should work without a port', function () {
                result = rtpManager.createRTPDestination( name, host );
            } );

            it( 'should work with an empty port', function () {
                result = rtpManager.createRTPDestination( name, host, '' );
            } );


            it( 'should work with a null port', function () {
                result = rtpManager.createRTPDestination( name, host, null );
            } );

        } );

        describe( 'Various full successful cases', function () {
            var result;

            beforeEach( function () {
                result = undefined;
                switcherController.quiddityManager.invokeMethod.returns( true );
                switcher.create.returns( config.soap.controlClientPrefix + name );
            } );

            afterEach( function () {
                switcherController.quiddityManager.getPropertyValue.should.have.been.calledOnce;
                switcherController.quiddityManager.getPropertyValue.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

                switcherController.quiddityManager.invokeMethod.should.have.been.calledThrice;
                switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );
                switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port] );
                switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'create', ['httpsdpdec', config.nameComputer] );

                switcher.create.should.have.been.calledOnce;
                switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name );

                should.exist( result );
                result.should.be.true;
            } );

            it( 'should follow protocol', function () {
                switcherController.quiddityManager.getPropertyValue.returns( quiddities.destinations_json() );
                result = rtpManager.createRTPDestination( name, host, port );
            } );

            it( 'should work with a host containing a protocol', function () {
                var protocolHost = 'http://' + host;
                switcherController.quiddityManager.getPropertyValue.returns( quiddities.destinations_json() );
                result           = rtpManager.createRTPDestination( name, protocolHost, port );
            } );

            it( 'should work with a string port', function () {
                var stringPort = String( port );
                switcherController.quiddityManager.getPropertyValue.returns( quiddities.destinations_json() );
                result         = rtpManager.createRTPDestination( name, host, stringPort );
            } );

            it( 'should work without existing destinations', function () {
                switcherController.quiddityManager.getPropertyValue.returns( null );
                result = rtpManager.createRTPDestination( name, host, port );
            } );

            it( 'should work with empty destinations', function () {
                switcherController.quiddityManager.getPropertyValue.returns( { destinations: [] } );
                result = rtpManager.createRTPDestination( name, host, port );
            } );

            it( 'should work with null destinations', function () {
                switcherController.quiddityManager.getPropertyValue.returns( { destinations: null } );
                result = rtpManager.createRTPDestination( name, host, port );
            } );

            it( 'should work with invalid destinations', function () {
                switcherController.quiddityManager.getPropertyValue.returns( { destinations: { not: 'an array' } } );
                result = rtpManager.createRTPDestination( name, host, port );
            } );

        } );

        it( 'should throw with no name', function () {
            expect( rtpManager.createRTPDestination.bind( rtpManager, null, host, port ) ).to.throw();
        } );

        it( 'should throw with no name', function () {
            expect( rtpManager.createRTPDestination.bind( rtpManager, '', host, port ) ).to.throw();
        } );

        it( 'should throw with invalid name', function () {
            expect( rtpManager.createRTPDestination.bind( rtpManager, 666, host, port ) ).to.throw();
        } );

        it( 'should throw with no host', function () {
            expect( rtpManager.createRTPDestination.bind( rtpManager, name, null, port ) ).to.throw();
        } );

        it( 'should throw with empty host', function () {
            expect( rtpManager.createRTPDestination.bind( rtpManager, name, '', port ) ).to.throw();
        } );

        it( 'should throw with invalid host', function () {
            expect( rtpManager.createRTPDestination.bind( rtpManager, name, 666, port ) ).to.throw();
        } );

        it( 'should throw with malformed host', function () {
            expect( rtpManager.createRTPDestination.bind( rtpManager, name, 'not//a/host', port ) ).to.throw();
        } );

        it( 'should throw with invalid port', function () {
            expect( rtpManager.createRTPDestination.bind( rtpManager, name, host, 'not a port' ) ).to.throw();
        } );

        it( 'should throw when destination name already exists', function () {
            name = quiddities.destinations_json().destinations[0].name;
            switcherController.quiddityManager.getPropertyValue.returns( quiddities.destinations_json() );
            expect( rtpManager.createRTPDestination.bind( rtpManager, name, host, port ) ).to.throw();
        } );

        it( 'should return false when first invoke returns null', function () {
            switcherController.quiddityManager.getPropertyValue.returns( quiddities.destinations_json() );
            switcherController.quiddityManager.invokeMethod.onFirstCall().returns( null );
            var result = rtpManager.createRTPDestination( name, host, port );

            switcherController.quiddityManager.getPropertyValue.should.have.been.calledOnce;
            switcherController.quiddityManager.getPropertyValue.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );
            switcher.create.should.not.have.been.called;

            should.exist( result );
            result.should.be.false;
        } );

        it( 'should return false when first invoke returns false', function () {
            switcherController.quiddityManager.getPropertyValue.returns( quiddities.destinations_json() );
            switcherController.quiddityManager.invokeMethod.onFirstCall().returns( false );
            var result = rtpManager.createRTPDestination( name, host, port );

            switcherController.quiddityManager.getPropertyValue.should.have.been.calledOnce;
            switcherController.quiddityManager.getPropertyValue.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );
            switcher.create.should.not.have.been.called;

            should.exist( result );
            result.should.be.false;
        } );

        it( 'should return false when create returns null', function () {
            switcherController.quiddityManager.getPropertyValue.returns( quiddities.destinations_json() );
            switcherController.quiddityManager.invokeMethod.returns( true );
            switcher.create.returns( null );
            var result = rtpManager.createRTPDestination( name, host, port );

            switcherController.quiddityManager.getPropertyValue.should.have.been.calledOnce;
            switcherController.quiddityManager.getPropertyValue.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name );

            should.exist( result );
            result.should.be.false;
        } );

        it( 'should return false when create returns false', function () {
            switcherController.quiddityManager.getPropertyValue.returns( quiddities.destinations_json() );
            switcherController.quiddityManager.invokeMethod.returns( true );
            switcher.create.returns( false );
            var result = rtpManager.createRTPDestination( name, host, port );

            switcherController.quiddityManager.getPropertyValue.should.have.been.calledOnce;
            switcherController.quiddityManager.getPropertyValue.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name );

            should.exist( result );
            result.should.be.false;
        } );

        it( 'should return false when second invoke returns null', function () {
            switcherController.quiddityManager.getPropertyValue.returns( quiddities.destinations_json() );
            switcherController.quiddityManager.invokeMethod.returns( true );
            switcherController.quiddityManager.invokeMethod.onSecondCall().returns( null );
            switcher.create.returns( config.soap.controlClientPrefix + name );
            var result = rtpManager.createRTPDestination( name, host, port );

            switcherController.quiddityManager.getPropertyValue.should.have.been.calledOnce;
            switcherController.quiddityManager.getPropertyValue.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port] );

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name );

            should.exist( result );
            result.should.be.false;
        } );

        it( 'should return false when second invoke returns false', function () {
            switcherController.quiddityManager.getPropertyValue.returns( quiddities.destinations_json() );
            switcherController.quiddityManager.invokeMethod.returns( true );
            switcherController.quiddityManager.invokeMethod.onSecondCall().returns( false );
            switcher.create.returns( config.soap.controlClientPrefix + name );
            var result = rtpManager.createRTPDestination( name, host, port );

            switcherController.quiddityManager.getPropertyValue.should.have.been.calledOnce;
            switcherController.quiddityManager.getPropertyValue.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port] );

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name );

            should.exist( result );
            result.should.be.false;
        } );

        it( 'should return false when third invoke returns null', function () {
            switcherController.quiddityManager.getPropertyValue.returns( quiddities.destinations_json() );
            switcherController.quiddityManager.invokeMethod.returns( true );
            switcherController.quiddityManager.invokeMethod.onThirdCall().returns( null );
            switcher.create.returns( config.soap.controlClientPrefix + name );
            var result = rtpManager.createRTPDestination( name, host, port );

            switcherController.quiddityManager.getPropertyValue.should.have.been.calledOnce;
            switcherController.quiddityManager.getPropertyValue.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcherController.quiddityManager.invokeMethod.should.have.been.calledThrice;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port] );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'create', ['httpsdpdec', config.nameComputer] );

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name );

            should.exist( result );
            result.should.be.false;
        } );

        it( 'should return false when third invoke returns false', function () {
            switcherController.quiddityManager.getPropertyValue.returns( quiddities.destinations_json() );
            switcherController.quiddityManager.invokeMethod.returns( true );
            switcherController.quiddityManager.invokeMethod.onThirdCall().returns( false );
            switcher.create.returns( config.soap.controlClientPrefix + name );
            var result = rtpManager.createRTPDestination( name, host, port );

            switcherController.quiddityManager.getPropertyValue.should.have.been.calledOnce;
            switcherController.quiddityManager.getPropertyValue.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcherController.quiddityManager.invokeMethod.should.have.been.calledThrice;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port] );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'create', ['httpsdpdec', config.nameComputer] );

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name );

            should.exist( result );
            result.should.be.false;
        } );

    } );

    describe( 'Removing RTP destinations', function () {

        var id;

        beforeEach( function () {
            id = 'someId';
            sinon.stub( switcherController.quiddityManager, 'invokeMethod' );
        } );

        it( 'should follow protocol', function () {
            switcherController.quiddityManager.invokeMethod.returns( true );
            switcher.remove.returns( true );
            var result = rtpManager.removeRTPDestination( id );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_destination', [id] );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id, 'remove', [config.nameComputer] );
            switcher.remove.should.have.been.calledOnce;
            switcher.remove.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );
            should.exist( result );
            result.should.be.true;
        } );

        it( 'should return error but continue removing when removing destination returns false', function () {
            switcherController.quiddityManager.invokeMethod.onFirstCall().returns( false );
            var result = rtpManager.removeRTPDestination( id );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_destination', [id] );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id, 'remove', [config.nameComputer] );
            switcher.remove.should.have.been.calledOnce;
            switcher.remove.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );
            should.exist( result );
            result.should.be.false;
        } );

        it( 'should continue and succeed when removing httpsdpdec fails', function () {
            switcherController.quiddityManager.invokeMethod.returns( true );
            switcherController.quiddityManager.invokeMethod.onSecondCall().returns( false );
            switcher.remove.returns( true );
            var result = rtpManager.removeRTPDestination( id );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_destination', [id] );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id, 'remove', [config.nameComputer] );
            switcher.remove.should.have.been.calledOnce;
            switcher.remove.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );
            should.exist( result );
            result.should.be.true;
        } );

        it( 'should continue and succeed when removing soap control client fails', function () {
            switcherController.quiddityManager.invokeMethod.returns( true );
            switcher.remove.returns( false );
            var result = rtpManager.removeRTPDestination( id );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_destination', [id] );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id, 'remove', [config.nameComputer] );
            switcher.remove.should.have.been.calledOnce;
            switcher.remove.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );
            should.exist( result );
            result.should.be.true;
        } );

    } );

    describe( 'Connecting RTP destination', function () {

        var id;
        var path;
        var port;

        beforeEach( function () {
            id   = 'someId';
            path = '/tmp/some_shmdata_path';
            port = 9090;
            sinon.stub( switcherController.quiddityManager, 'getTreeInfo' );
            sinon.stub( switcherController.quiddityManager, 'invokeMethod' );
            sinon.stub( switcherController.quiddityManager, 'exists' );
            sinon.stub( rtpManager, 'disconnectRTPDestination' );
            sinon.stub( rtpManager, '_refreshHttpSdpDec' );
        } );

        it( 'should follow protocol', function () {
            switcherController.quiddityManager.getTreeInfo.returns( quiddities.shmdata_readers() );
            switcherController.quiddityManager.invokeMethod.returns( true );
            switcherController.quiddityManager.exists.returns( true );

            var result = rtpManager.connectRTPDestination( id, path, port );

            switcherController.quiddityManager.getTreeInfo.should.have.been.calledOnce;
            switcherController.quiddityManager.getTreeInfo.should.have.been.calledWithExactly( config.rtp.quiddName, '.shmdata.reader' );

            switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_data_stream', [path] );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_udp_stream_to_dest', [path, id, String(port)] );

            rtpManager.disconnectRTPDestination.should.not.have.been.called;

            switcherController.quiddityManager.exists.should.have.been.calledOnce;
            switcherController.quiddityManager.exists.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            rtpManager._refreshHttpSdpDec.should.have.been.calledOnce;
            rtpManager._refreshHttpSdpDec.should.have.been.calledWith( id );

            should.exist( result );
            result.should.be.true;
        } );

        it( 'should follow protocol with a parseable string port', function () {
            switcherController.quiddityManager.getTreeInfo.returns( quiddities.shmdata_readers() );
            switcherController.quiddityManager.invokeMethod.returns( true );
            switcherController.quiddityManager.exists.returns( true );

            var result = rtpManager.connectRTPDestination( id, path, '666' );

            switcherController.quiddityManager.getTreeInfo.should.have.been.calledOnce;
            switcherController.quiddityManager.getTreeInfo.should.have.been.calledWithExactly( config.rtp.quiddName, '.shmdata.reader' );

            switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_data_stream', [path] );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_udp_stream_to_dest', [path, id, '666'] );

            rtpManager.disconnectRTPDestination.should.not.have.been.called;

            switcherController.quiddityManager.exists.should.have.been.calledOnce;
            switcherController.quiddityManager.exists.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            rtpManager._refreshHttpSdpDec.should.have.been.calledOnce;
            rtpManager._refreshHttpSdpDec.should.have.been.calledWith( id );

            should.exist( result );
            result.should.be.true;
        } );

        it( 'should follow protocol when the connection already exists', function () {
            path = '/tmp/switcher_nodeserver_audiotestsrc0_audio';

            switcherController.quiddityManager.getTreeInfo.returns( quiddities.shmdata_readers() );
            switcherController.quiddityManager.invokeMethod.returns( true );
            switcherController.quiddityManager.exists.returns( true );

            var result = rtpManager.connectRTPDestination( id, path, port );

            switcherController.quiddityManager.getTreeInfo.should.have.been.calledOnce;
            switcherController.quiddityManager.getTreeInfo.should.have.been.calledWithExactly( config.rtp.quiddName, '.shmdata.reader' );

            switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_udp_stream_to_dest', [path, id, String(port)] );

            rtpManager.disconnectRTPDestination.should.not.have.been.called;

            switcherController.quiddityManager.exists.should.have.been.calledOnce;
            switcherController.quiddityManager.exists.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            rtpManager._refreshHttpSdpDec.should.have.been.calledOnce;
            rtpManager._refreshHttpSdpDec.should.have.been.calledWith( id );

            should.exist( result );
            result.should.be.true;
        } );

        it( 'should follow protocol when there is no soap control client', function () {
            switcherController.quiddityManager.getTreeInfo.returns( quiddities.shmdata_readers() );
            switcherController.quiddityManager.invokeMethod.returns( true );
            switcherController.quiddityManager.exists.returns( false );

            var result = rtpManager.connectRTPDestination( id, path, port );

            switcherController.quiddityManager.getTreeInfo.should.have.been.calledOnce;
            switcherController.quiddityManager.getTreeInfo.should.have.been.calledWithExactly( config.rtp.quiddName, '.shmdata.reader' );

            switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_data_stream', [path] );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_udp_stream_to_dest', [path, id, String(port)] );

            rtpManager.disconnectRTPDestination.should.not.have.been.called;

            switcherController.quiddityManager.exists.should.have.been.calledOnce;
            switcherController.quiddityManager.exists.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            rtpManager._refreshHttpSdpDec.should.not.have.been.called;

            should.exist( result );
            result.should.be.true;
        } );

        describe( 'Validation', function () {

            afterEach( function () {
                switcherController.quiddityManager.getTreeInfo.should.not.have.been.called;
                switcherController.quiddityManager.invokeMethod.should.not.have.been.called;
                rtpManager.disconnectRTPDestination.should.not.have.been.called;
                switcherController.quiddityManager.exists.should.not.have.been.called;
                rtpManager._refreshHttpSdpDec.should.not.have.been.called;
            } );

            it( 'should throw error when id is missing', function () {
                expect( rtpManager.connectRTPDestination.bind( rtpManager, null, path, port ) ).to.throw();
            } );

            it( 'should throw error when id is empty', function () {
                expect( rtpManager.connectRTPDestination.bind( rtpManager, '', path, port ) ).to.throw();
            } );

            it( 'should throw error when id is not a tring', function () {
                expect( rtpManager.connectRTPDestination.bind( rtpManager, 666, path, port ) ).to.throw();
            } );

            it( 'should throw error when path is missing', function () {
                expect( rtpManager.connectRTPDestination.bind( rtpManager, id, null, port ) ).to.throw();
            } );

            it( 'should throw error when path is empty', function () {
                expect( rtpManager.connectRTPDestination.bind( rtpManager, id, '', port ) ).to.throw();
            } );

            it( 'should throw error when path is not a string', function () {
                expect( rtpManager.connectRTPDestination.bind( rtpManager, id, 666, port ) ).to.throw();
            } );

            it( 'should throw error when port is missing', function () {
                expect( rtpManager.connectRTPDestination.bind( rtpManager, id, path, null ) ).to.throw();
            } );

            it( 'should throw error when port is empty', function () {
                expect( rtpManager.connectRTPDestination.bind( rtpManager, id, path, '' ) ).to.throw();
            } );

            it( 'should throw error when port is an invalid string', function () {
                expect( rtpManager.connectRTPDestination.bind( rtpManager, id, path, 'pouet' ) ).to.throw();
            } );

        } );


        it( 'should return error when adding data stream fails', function () {
            switcherController.quiddityManager.getTreeInfo.returns( quiddities.shmdata_readers() );
            switcherController.quiddityManager.invokeMethod.returns( true );
            switcherController.quiddityManager.invokeMethod.onFirstCall().returns( false );
            switcherController.quiddityManager.exists.returns( true );

            var result = rtpManager.connectRTPDestination( id, path, port );

            switcherController.quiddityManager.getTreeInfo.should.have.been.calledOnce;
            switcherController.quiddityManager.getTreeInfo.should.have.been.calledWithExactly( config.rtp.quiddName, '.shmdata.reader' );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_data_stream', [path] );
            rtpManager.disconnectRTPDestination.should.not.have.been.called;
            switcherController.quiddityManager.exists.should.not.have.been.called;
            rtpManager._refreshHttpSdpDec.should.not.have.been.called;

            should.exist( result );
            result.should.be.false;
        } );

        it( 'should return error when adding udp to destination fails', function () {
            switcherController.quiddityManager.getTreeInfo.returns( quiddities.shmdata_readers() );
            switcherController.quiddityManager.invokeMethod.returns( true );
            switcherController.quiddityManager.invokeMethod.onSecondCall().returns( false );
            switcherController.quiddityManager.exists.returns( true );

            var result = rtpManager.connectRTPDestination( id, path, port );

            switcherController.quiddityManager.getTreeInfo.should.have.been.calledOnce;
            switcherController.quiddityManager.getTreeInfo.should.have.been.calledWithExactly( config.rtp.quiddName, '.shmdata.reader' );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_data_stream', [path] );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_udp_stream_to_dest', [path, id, String(port)] );
            rtpManager.disconnectRTPDestination.should.have.been.calledOnce;
            rtpManager.disconnectRTPDestination.should.have.been.calledWithExactly( id, path );
            switcherController.quiddityManager.exists.should.not.have.been.called;
            rtpManager._refreshHttpSdpDec.should.not.have.been.calledOnce;

            should.exist( result );
            result.should.be.false;
        } );

    } );

    describe( 'Disconnecting RTP destination', function () {

        var id;
        var path;

        beforeEach(function() {
            id = 'someId';
            path = '/tmp/some_shmdata_path';
            sinon.stub( switcherController.quiddityManager, 'getPropertyValue' );
            sinon.stub( switcherController.quiddityManager, 'invokeMethod' );
            sinon.stub( switcherController.quiddityManager, 'exists' );
            sinon.stub( rtpManager, '_refreshHttpSdpDec' );
        });

        it( 'should follow protocol', function () {
            switcherController.quiddityManager.getPropertyValue.returns( quiddities.destinations_json() );
            switcherController.quiddityManager.invokeMethod.returns( true );
            switcherController.quiddityManager.exists.returns( true );

            var result = rtpManager.disconnectRTPDestination( id, path );

            switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_udp_stream_to_dest', [path, id] );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_data_stream', [path] );

            switcherController.quiddityManager.getPropertyValue.should.have.been.calledOnce;
            switcherController.quiddityManager.getPropertyValue.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcherController.quiddityManager.exists.should.have.been.calledOnce;
            switcherController.quiddityManager.exists.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            rtpManager._refreshHttpSdpDec.should.have.been.calledOnce;
            rtpManager._refreshHttpSdpDec.should.have.been.calledWith( id );

            should.exist(result);
            result.should.be.true;
        } );

        it( 'should follow protocol when shmdata is still in use', function () {
            path    = '/tmp/switcher_nodeserver_audiotestsrc1_audio';

            switcherController.quiddityManager.getPropertyValue.returns( quiddities.destinations_json() );
            switcherController.quiddityManager.invokeMethod.returns( true );
            switcherController.quiddityManager.exists.returns( true );

            var result = rtpManager.disconnectRTPDestination( id, path );

            switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_udp_stream_to_dest', [path, id] );

            switcherController.quiddityManager.getPropertyValue.should.have.been.calledOnce;
            switcherController.quiddityManager.getPropertyValue.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcherController.quiddityManager.exists.should.have.been.calledOnce;
            switcherController.quiddityManager.exists.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            rtpManager._refreshHttpSdpDec.should.have.been.calledOnce;
            rtpManager._refreshHttpSdpDec.should.have.been.calledWith( id );

            should.exist(result);
            result.should.be.true;
        } );

        it( 'should follow protocol when not getting json destinations', function () {
            switcherController.quiddityManager.getPropertyValue.returns( {} );
            switcherController.quiddityManager.invokeMethod.returns( true );
            switcherController.quiddityManager.exists.returns( true );

            var result = rtpManager.disconnectRTPDestination( id, path );

            switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_udp_stream_to_dest', [path, id] );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_data_stream', [path] );

            switcherController.quiddityManager.getPropertyValue.should.have.been.calledOnce;
            switcherController.quiddityManager.getPropertyValue.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcherController.quiddityManager.exists.should.have.been.calledOnce;
            switcherController.quiddityManager.exists.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            rtpManager._refreshHttpSdpDec.should.have.been.calledOnce;
            rtpManager._refreshHttpSdpDec.should.have.been.calledWith( id );

            should.exist(result);
            result.should.be.true;
        } );

        it( 'should follow protocol when soap control client does not exists', function () {
            switcherController.quiddityManager.getPropertyValue.returns( quiddities.destinations_json() );
            switcherController.quiddityManager.invokeMethod.returns( true );
            switcherController.quiddityManager.exists.returns( false );

            var result = rtpManager.disconnectRTPDestination( id, path );

            switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_udp_stream_to_dest', [path, id] );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_data_stream', [path] );

            switcherController.quiddityManager.getPropertyValue.should.have.been.calledOnce;
            switcherController.quiddityManager.getPropertyValue.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcherController.quiddityManager.exists.should.have.been.calledOnce;
            switcherController.quiddityManager.exists.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            rtpManager._refreshHttpSdpDec.should.not.have.been.called;

            should.exist(result);
            result.should.be.true;
        } );

        it( 'should return false when removing udp stream fails', function () {
            switcherController.quiddityManager.getPropertyValue.returns( quiddities.destinations_json() );
            switcherController.quiddityManager.invokeMethod.returns( true );
            switcherController.quiddityManager.invokeMethod.onFirstCall().returns(false);
            switcherController.quiddityManager.exists.returns( true );

            var result = rtpManager.disconnectRTPDestination( id, path );

            switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_udp_stream_to_dest', [path, id] );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_data_stream', [path] );

            switcherController.quiddityManager.getPropertyValue.should.have.been.calledOnce;
            switcherController.quiddityManager.getPropertyValue.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcherController.quiddityManager.exists.should.have.been.calledOnce;
            switcherController.quiddityManager.exists.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            rtpManager._refreshHttpSdpDec.should.have.been.calledOnce;
            rtpManager._refreshHttpSdpDec.should.have.been.calledWith( id );

            should.exist(result);
            result.should.be.false;
        } );

        it( 'should continue and succeed when removing data stream fails', function () {
            switcherController.quiddityManager.getPropertyValue.returns( quiddities.destinations_json() );
            switcherController.quiddityManager.invokeMethod.returns( true );
            switcherController.quiddityManager.invokeMethod.onSecondCall().returns(false);
            switcherController.quiddityManager.exists.returns( true );

            var result = rtpManager.disconnectRTPDestination( id, path );

            switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_udp_stream_to_dest', [path, id] );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_data_stream', [path] );

            switcherController.quiddityManager.getPropertyValue.should.have.been.calledOnce;
            switcherController.quiddityManager.getPropertyValue.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcherController.quiddityManager.exists.should.have.been.calledOnce;
            switcherController.quiddityManager.exists.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            rtpManager._refreshHttpSdpDec.should.have.been.calledOnce;
            rtpManager._refreshHttpSdpDec.should.have.been.calledWith( id );

            should.exist(result);
            result.should.be.true;
        } );

        it( 'should not refresh http sdp dec when quiddity is not found', function () {
            switcherController.quiddityManager.getPropertyValue.returns( quiddities.destinations_json() );
            switcherController.quiddityManager.invokeMethod.returns( true );
            switcherController.quiddityManager.exists.returns( false );

            var result = rtpManager.disconnectRTPDestination( id, path );

            switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_udp_stream_to_dest', [path, id] );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_data_stream', [path] );

            switcherController.quiddityManager.getPropertyValue.should.have.been.calledOnce;
            switcherController.quiddityManager.getPropertyValue.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcherController.quiddityManager.exists.should.have.been.calledOnce;
            switcherController.quiddityManager.exists.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            rtpManager._refreshHttpSdpDec.should.not.have.been.called;

            should.exist(result);
            result.should.be.true;
        } );

    } );

    describe( 'Updating RTP destination', function () {

        it( 'should follow protocol', function () {
            var id   = 'destination 1 name';
            var info = {
                name: 'new destiantion name',
                host: 'some host',
                port: 9090
            };

            switcher.get_property_value.returns( quiddities.destinations_json() );

            var remove = sinon.stub( rtpManager, 'removeRTPDestination' );
            remove.yields();

            var create = sinon.stub( rtpManager, 'createRTPDestination' );
            create.yields();

            var connect = sinon.stub( rtpManager, 'connectRTPDestination' );
            connect.yields();

            rtpManager.updateRTPDestination( id, info, cb );

            remove.should.have.been.calledOnce;
            remove.should.have.been.calledWith( id );

            create.should.have.been.calledOnce;
            create.should.have.been.calledWith( info.name, info.host, info.port );

            connect.callCount.should.equal( quiddities.destinations_json().destinations[0].data_streams.length );
            connect.should.have.been.calledWith(
                quiddities.destinations_json().destinations[0].data_streams[0].path,
                info.name,
                quiddities.destinations_json().destinations[0].data_streams[0].port
            );

            connect.should.have.been.calledWith(
                quiddities.destinations_json().destinations[0].data_streams[1].path,
                info.name,
                quiddities.destinations_json().destinations[0].data_streams[1].port
            );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        } );

        it( 'should follow protocol without existing destination', function () {
            var id   = 'destination 1 name';
            var info = {
                name: 'new destiantion name',
                host: 'some host',
                port: 9090
            };

            switcher.get_property_value.returns( {} );

            var remove = sinon.stub( rtpManager, 'removeRTPDestination' );
            remove.yields();

            var create = sinon.stub( rtpManager, 'createRTPDestination' );
            create.yields();

            var connect = sinon.stub( rtpManager, 'connectRTPDestination' );
            connect.yields();

            rtpManager.updateRTPDestination( id, info, cb );

            remove.should.have.been.calledOnce;
            remove.should.have.been.calledWith( id );

            create.should.have.been.calledOnce;
            create.should.have.been.calledWith( info.name, info.host, info.port );

            connect.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        } );

        it( 'should return error when getting destinations throws', function () {
            var id    = 'destination 1 name';
            var info  = {
                name: 'new destiantion name',
                host: 'some host',
                port: 9090
            };
            var error = 'some error';

            switcher.get_property_value.throws( error );

            var remove = sinon.stub( rtpManager, 'removeRTPDestination' );
            remove.yields();

            var create = sinon.stub( rtpManager, 'createRTPDestination' );
            create.yields();

            var connect = sinon.stub( rtpManager, 'connectRTPDestination' );
            connect.yields();

            rtpManager.updateRTPDestination( id, info, cb );

            remove.should.not.have.been.called;
            create.should.not.have.been.called;
            connect.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should return error when removing returns an error', function () {
            var id    = 'destination 1 name';
            var info  = {
                name: 'new destiantion name',
                host: 'some host',
                port: 9090
            };
            var error = 'some error';

            switcher.get_property_value.returns( quiddities.destinations_json() );

            var remove = sinon.stub( rtpManager, 'removeRTPDestination' );
            remove.yields( error );

            var create = sinon.stub( rtpManager, 'createRTPDestination' );
            create.yields();

            var connect = sinon.stub( rtpManager, 'connectRTPDestination' );
            connect.yields();

            rtpManager.updateRTPDestination( id, info, cb );

            remove.should.have.been.calledOnce;
            remove.should.have.been.calledWith( id );

            create.should.not.have.been.called;
            connect.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should return error when creating returns an error', function () {
            var id    = 'destination 1 name';
            var info  = {
                name: 'new destiantion name',
                host: 'some host',
                port: 9090
            };
            var error = 'some error';

            switcher.get_property_value.returns( quiddities.destinations_json() );

            var remove = sinon.stub( rtpManager, 'removeRTPDestination' );
            remove.yields();

            var create = sinon.stub( rtpManager, 'createRTPDestination' );
            create.yields( error );

            var connect = sinon.stub( rtpManager, 'connectRTPDestination' );
            connect.yields();

            rtpManager.updateRTPDestination( id, info, cb );

            remove.should.have.been.calledOnce;
            remove.should.have.been.calledWith( id );

            create.should.have.been.calledOnce;
            create.should.have.been.calledWith( info.name, info.host, info.port );

            connect.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should return error when connecting returns an error', function () {
            var id    = 'destination 1 name';
            var info  = {
                name: 'new destiantion name',
                host: 'some host',
                port: 9090
            };
            var error = 'some error';

            switcher.get_property_value.returns( quiddities.destinations_json() );

            var remove = sinon.stub( rtpManager, 'removeRTPDestination' );
            remove.yields();

            var create = sinon.stub( rtpManager, 'createRTPDestination' );
            create.yields();

            var connect = sinon.stub( rtpManager, 'connectRTPDestination' );
            connect.yields( error );

            rtpManager.updateRTPDestination( id, info, cb );

            remove.should.have.been.calledOnce;
            remove.should.have.been.calledWith( id );

            create.should.have.been.calledOnce;
            create.should.have.been.calledWith( info.name, info.host, info.port );

            connect.callCount.should.equal( quiddities.destinations_json().destinations[0].data_streams.length );
            connect.should.have.been.calledWith(
                quiddities.destinations_json().destinations[0].data_streams[0].path,
                info.name,
                quiddities.destinations_json().destinations[0].data_streams[0].port
            );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

    } );
} );