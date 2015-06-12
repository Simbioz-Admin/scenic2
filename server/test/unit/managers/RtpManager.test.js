var _          = require( 'underscore' );
var proxyquire = require( 'proxyquire' ).noCallThru();
var chai       = require( "chai" );
var sinon      = require( "sinon" );
var sinonChai  = require( "sinon-chai" );
var should     = chai.should();
chai.use( sinonChai );

var logStub      = require( '../../fixtures/log' );
var switcherStub = require( '../../fixtures/switcher' );
var quiddities   = require( '../../fixtures/quiddities' );

describe( 'RTP Manager', function () {

    var switcher;
    var config;
    var io;
    var switcherController;
    var rtpManager;
    var cb;

    before( function ( done ) {
        var i18n = require( '../../../src/lib/i18n' );
        i18n.initialize( done );
    } );

    beforeEach( function () {
        switcher           = new switcherStub.Switcher();
        config             = {
            nameComputer: 'computer-name',
            rtp:          {
                quiddName: 'rtp-quiddity-name'
            },
            soap:         {
                soapControlClientPrefix: 'soap-control-client-prefix'
            }
        };
        io                 = {};
        io.emit            = sinon.spy();

        switcherController = {
            switcher: switcher,
            config:   config,
            io:       io
        };

        var RtpManager     = proxyquire( '../../../src/switcher/RtpManager', {
            'switcher':         switcher,
            '../lib/logger':    logStub(),
            '../utils/logback': function ( e, c ) {
                //if ( e ) { console.error(e);}
                c( e );
            }
        } );
        rtpManager         = new RtpManager( switcherController );
        rtpManager.logback = sinon.stub();
        rtpManager.logback.yields();
        cb                 = sinon.stub();
    } );

    afterEach( function () {
        switcher   = null;
        config     = null;
        io         = null;
        rtpManager = null;
        cb         = null;
    } );

    // Hey, dummy test to get started
    it( 'should exist', function () {
        should.exist( rtpManager );
    } );

    describe( 'Initialization', function () {

        it( 'should have been instanciated correctly', function () {
            should.exist( rtpManager.config );
            rtpManager.config.should.equal( config );

            should.exist( rtpManager.switcher );
            rtpManager.switcher.should.equal( switcher );

            should.exist( rtpManager.io );
            rtpManager.io.should.equal( io );
        } );

        it( 'should bind to clients', function () {
            var socket = {on: sinon.spy()};

            rtpManager.bindClient( socket );

            socket.on.callCount.should.equal( 5 );
            socket.on.should.have.been.calledWith( 'createRTPDestination' );
            socket.on.should.have.been.calledWith( 'removeRTPDestination' );
            socket.on.should.have.been.calledWith( 'connectRTPDestination' );
            socket.on.should.have.been.calledWith( 'disconnectRTPDestination' );
            socket.on.should.have.been.calledWith( 'updateRTPDestination' );
        } );
    } );

    describe( 'Creating RTP destination', function () {

        it( 'should follow protocol', function () {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;

            switcher.get_property_value.returns(  quiddities.destinations_json() );
            switcher.invoke.returns( [true] );
            switcher.create.returns( [config.soap.controlClientPrefix + name] );

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.invoke.should.have.been.calledThrice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'create', ['httpsdpdec', config.nameComputer] );

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        } );

        it( 'should follow protocol with a host with protocol', function () {
            var name        = 'some name';
            var host        = 'http://some.host';
            var host_parsed = 'some.host';
            var port        = 9090;

            switcher.get_property_value.returns( quiddities.destinations_json());
            switcher.invoke.returns( [true] );
            switcher.create.returns( [config.soap.controlClientPrefix + name] );

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.invoke.should.have.been.calledThrice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host_parsed] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host_parsed + ':' + port] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'create', ['httpsdpdec', config.nameComputer] );

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        } );

        it( 'should follow protocol with a string port', function () {
            var name = 'some name';
            var host = 'some.host';
            var port = '9090';

            switcher.get_property_value.returns(JSON.stringify( quiddities.destinations_json() ));
            switcher.invoke.returns( [true] );
            switcher.create.returns( [config.soap.controlClientPrefix + name] );

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.invoke.should.have.been.calledThrice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'create', ['httpsdpdec', config.nameComputer] );

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        } );

        it( 'should follow protocol without a port', function () {
            var name = 'some name';
            var host = 'some.host';
            var port = null;

            switcher.get_property_value.returns( JSON.stringify( quiddities.destinations_json() ));
            switcher.invoke.returns( [true] );
            switcher.create.returns( [config.soap.controlClientPrefix + name] );

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.invoke.should.have.been.calledOnce;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );

            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        } );

        it( 'should follow protocol without an empty port', function () {
            var name = 'some name';
            var host = 'some.host';
            var port = '';

            switcher.get_property_value.returns(  quiddities.destinations_json());
            switcher.invoke.returns( [true] );
            switcher.create.returns( [config.soap.controlClientPrefix + name] );

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.invoke.should.have.been.calledOnce;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );

            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        } );

        it( 'should follow protocol without destinations', function () {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;

            switcher.get_property_value.returns(  {});
            switcher.invoke.returns( [true] );
            switcher.create.returns( [config.soap.controlClientPrefix + name] );

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.invoke.should.have.been.calledThrice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'create', ['httpsdpdec', config.nameComputer] );

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        } );

        it( 'should follow protocol with empty destinations', function () {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;

            switcher.get_property_value.returns(  {destinations: []});
            switcher.invoke.returns( [true] );
            switcher.create.returns( [config.soap.controlClientPrefix + name] );

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.invoke.should.have.been.calledThrice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'create', ['httpsdpdec', config.nameComputer] );

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        } );

        it( 'should follow protocol with null destinations', function () {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;

            switcher.get_property_value.returns(  {destinations: null});
            switcher.invoke.returns( [true] );
            switcher.create.returns( [config.soap.controlClientPrefix + name] );

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.invoke.should.have.been.calledThrice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'create', ['httpsdpdec', config.nameComputer] );

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        } );

        it( 'should follow protocol with invalid destinations', function () {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;

            switcher.get_property_value.returns(  {destinations: {not: 'an array'}});
            switcher.invoke.returns( [true] );
            switcher.create.returns( [config.soap.controlClientPrefix + name] );

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.invoke.should.have.been.calledThrice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'create', ['httpsdpdec', config.nameComputer] );

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        } );

        it( 'should return error with no name', function () {
            var name = null;
            var host = 'some.host';
            var port = 9090;

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.not.have.been.called;
            switcher.invoke.should.not.have.been.called;
            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( '' );
        } );

        it( 'should return error with empty name', function () {
            var name = '';
            var host = 'some.host';
            var port = 9090;

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.not.have.been.called;
            switcher.invoke.should.not.have.been.called;
            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( '' );
        } );

        it( 'should return error with no host', function () {
            var name = 'some name';
            var host = null;
            var port = 9090;

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.not.have.been.called;
            switcher.invoke.should.not.have.been.called;
            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( '' );
        } );

        it( 'should return error with empty host', function () {
            var name = 'some name';
            var host = '';
            var port = 9090;

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.not.have.been.called;
            switcher.invoke.should.not.have.been.called;
            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( '' );
        } );

        it( 'should return error with invalid port', function () {
            var name = 'some name';
            var host = 'some.host';
            var port = 'this is not a port';

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.not.have.been.called;
            switcher.invoke.should.not.have.been.called;
            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( '' );
        } );

        it( 'should return error when get_property_value throws', function () {
            var name  = 'some name';
            var host  = 'some.host';
            var port  = 9090;
            var error = 'some error';

            switcher.get_property_value.throws( error );

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.invoke.should.not.have.been.called;
            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should return error when get_property_value returns an error', function () {
            var name  = 'some name';
            var host  = 'some.host';
            var port  = 9090;
            var error = 'some error';

            switcher.get_property_value.returns(  {error: error} );

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.invoke.should.not.have.been.called;
            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should return error when get_property_value destination name already exists', function () {
            var name = 'destination 1 name';
            var host = 'some.host';
            var port = 9090;

            switcher.get_property_value.returns( quiddities.destinations_json() );

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.invoke.should.not.have.been.called;
            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( name );
        } );

        it( 'should return error when first invoke throws', function () {
            var name  = 'some name';
            var host  = 'some.host';
            var port  = 9090;
            var error = 'some error';

            switcher.get_property_value.returns(  quiddities.destinations_json());
            switcher.invoke.onFirstCall().throws( error );

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.invoke.should.have.been.calledOnce;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );
            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should return error when first invoke returns null', function () {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;

            switcher.get_property_value.returns(  quiddities.destinations_json());
            switcher.invoke.onFirstCall().returns( null );

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.invoke.should.have.been.calledOnce;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );
            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( '' );
        } );

        it( 'should return error when create throws', function () {
            var name  = 'some name';
            var host  = 'some.host';
            var port  = 9090;
            var error = 'some error';

            switcher.get_property_value.returns(  quiddities.destinations_json());
            switcher.invoke.returns( [true] );
            switcher.create.throws( error );

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.invoke.should.have.been.calledOnce;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should return error when create returns null', function () {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;

            switcher.get_property_value.returns(  quiddities.destinations_json());
            switcher.invoke.returns( [true] );
            switcher.create.returns( null );

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.invoke.should.have.been.calledOnce;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( '' );
        } );

        it( 'should return error when second invoke throws', function () {
            var name  = 'some name';
            var host  = 'some.host';
            var port  = 9090;
            var error = 'some error';

            switcher.get_property_value.returns(  quiddities.destinations_json());
            switcher.invoke.returns( [true] );
            switcher.create.returns( [config.soap.controlClientPrefix + name] );
            switcher.invoke.onSecondCall().throws( error );

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port] );

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should return error when second invoke returns null', function () {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;

            switcher.get_property_value.returns( JSON.stringify( quiddities.destinations_json() ));
            switcher.invoke.returns( [true] );
            switcher.create.returns( [config.soap.controlClientPrefix + name] );
            switcher.invoke.onSecondCall().returns( null );

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port] );

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( '' );
        } );

        it( 'should return error when third invoke throws', function () {
            var name  = 'some name';
            var host  = 'some.host';
            var port  = 9090;
            var error = 'some error';

            switcher.get_property_value.returns(  quiddities.destinations_json());
            switcher.invoke.returns( [true] );
            switcher.create.returns( [config.soap.controlClientPrefix + name] );
            switcher.invoke.onThirdCall().throws( error );

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.invoke.should.have.been.calledThrice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'create', ['httpsdpdec', config.nameComputer] );

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should return error when third invoke returns null', function () {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;

            switcher.get_property_value.returns(  quiddities.destinations_json());
            switcher.invoke.returns( [true] );
            switcher.create.returns( [config.soap.controlClientPrefix + name] );
            switcher.invoke.onThirdCall().returns( null );

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.invoke.should.have.been.calledThrice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'create', ['httpsdpdec', config.nameComputer] );

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( '' );
        } );

    } );

    describe( 'Removing RTP destinations', function () {

        it( 'should follow protocol', function () {
            var id = 'someId';

            switcher.invoke.returns( true );
            switcher.remove.returns( true );

            rtpManager.removeRTPDestination( id, cb );

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_destination', [id] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id, 'remove', [config.nameComputer] );

            switcher.remove.should.have.been.calledOnce;
            switcher.remove.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly(null);
        } );

        it( 'should return error when removing destination throws', function () {
            var id    = 'someId';
            var error = 'some error';

            switcher.invoke.onFirstCall().throws( error );

            rtpManager.removeRTPDestination( id, cb );

            switcher.invoke.should.have.been.calledOnce;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_destination', [id] );

            switcher.remove.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should return error but continue removing when removing destination returns false', function () {
            var id = 'someId';

            switcher.invoke.onFirstCall().returns( false );

            rtpManager.removeRTPDestination( id, cb );

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_destination', [id] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id, 'remove', [config.nameComputer] );

            switcher.remove.should.have.been.calledOnce;
            switcher.remove.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( '' );
        } );

        it( 'should return error when removing httpsdpdec throws', function () {
            var id    = 'someId';
            var error = 'some error';

            switcher.invoke.returns( [true] );
            switcher.invoke.onSecondCall().throws( error );
            switcher.remove.returns( true );

            rtpManager.removeRTPDestination( id, cb );

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_destination', [id] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id, 'remove', [config.nameComputer] );

            switcher.remove.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should continue when removing httpsdpdec fails', function () {
            var id = 'someId';

            switcher.invoke.returns( [true] );
            switcher.invoke.onSecondCall().returns( false );
            switcher.remove.returns( true );

            rtpManager.removeRTPDestination( id, cb );

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_destination', [id] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id, 'remove', [config.nameComputer] );

            switcher.remove.should.have.been.calledOnce;
            switcher.remove.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch('');
        } );

        it( 'should return error when removing soap control client throws', function () {
            var id    = 'someId';
            var error = 'some error';

            switcher.invoke.returns( [true] );
            switcher.remove.throws( error );

            rtpManager.removeRTPDestination( id, cb );

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_destination', [id] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id, 'remove', [config.nameComputer] );

            switcher.remove.should.have.been.calledOnce;
            switcher.remove.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should continue when removing soap control client fails', function () {
            var id = 'someId';

            switcher.invoke.returns( [true] );
            switcher.remove.returns( false );

            rtpManager.removeRTPDestination( id, cb );

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_destination', [id] );
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id, 'remove', [config.nameComputer] );

            switcher.remove.should.have.been.calledOnce;
            switcher.remove.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch('');
        } );

    } );

    describe( 'Connecting RTP destination', function () {

        it( 'should follow protocol', function () {
            var path    = 'some path';
            var id      = 'some id';
            var port    = 9090;

            switcher.get_info.returns(  quiddities.shmdata_readers() );
            switcher.invoke.returns( [true] );
            switcher.has_quiddity.returns( true );
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            rtpManager.connectRTPDestination( path, id, port, cb );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( config.rtp.quiddName, '.shmdata.reader' );

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_data_stream', [path] );
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_udp_stream_to_dest', [path, id, port] );

            switcher.has_quiddity.should.have.been.calledOnce;
            switcher.has_quiddity.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            refresh.should.have.been.calledOnce;
            refresh.should.have.been.calledWith( id );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        } );

        it( 'should follow protocol when the connection already exists', function () {
            var path    = '/tmp/switcher_nodeserver_audiotestsrc0_audio';
            var id      = 'some id';
            var port    = 9090;

            switcher.get_info.returns( quiddities.shmdata_readers() );
            switcher.invoke.returns( [true] );
            switcher.has_quiddity.returns( true );
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            rtpManager.connectRTPDestination( path, id, port, cb );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( config.rtp.quiddName, '.shmdata.reader' );

            switcher.invoke.should.have.been.calledOnce;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_udp_stream_to_dest', [path, id, port] );

            switcher.has_quiddity.should.have.been.calledOnce;
            switcher.has_quiddity.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            refresh.should.have.been.calledOnce;
            refresh.should.have.been.calledWith( id );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        } );

        it( 'should follow protocol when there is no soap control client', function () {
            var path    = 'some path';
            var id      = 'some id';
            var port    = 9090;

            switcher.get_info.returns( quiddities.shmdata_readers() );
            switcher.invoke.returns( [true] );
            switcher.has_quiddity.returns( false );
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            rtpManager.connectRTPDestination( path, id, port, cb );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( config.rtp.quiddName, '.shmdata.reader' );

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_data_stream', [path] );
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_udp_stream_to_dest', [path, id, port] );

            switcher.has_quiddity.should.have.been.calledOnce;
            switcher.has_quiddity.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            refresh.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        } );

        it( 'should return error when path is missing', function () {
            var path    = null;
            var id      = 'some id';
            var port    = 9090;
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            rtpManager.connectRTPDestination( path, id, port, cb );

            switcher.get_info.should.not.have.been.called;
            switcher.invoke.should.not.have.been.called;
            switcher.has_quiddity.should.not.have.been.called;
            refresh.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( '' );
        } );

        it( 'should return error when path is empty', function () {
            var path    = '';
            var id      = 'some id';
            var port    = 9090;
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            rtpManager.connectRTPDestination( path, id, port, cb );

            switcher.get_info.should.not.have.been.called;
            switcher.invoke.should.not.have.been.called;
            switcher.has_quiddity.should.not.have.been.called;
            refresh.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( '' );
        } );

        it( 'should return error when id is missing', function () {
            var path    = 'path';
            var id      = null;
            var port    = 9090;
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            rtpManager.connectRTPDestination( path, id, port, cb );

            switcher.get_info.should.not.have.been.called;
            switcher.invoke.should.not.have.been.called;
            switcher.has_quiddity.should.not.have.been.called;
            refresh.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( '' );
        } );

        it( 'should return error when id is empty', function () {
            var path    = 'path';
            var id      = '';
            var port    = 9090;
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            rtpManager.connectRTPDestination( path, id, port, cb );

            switcher.get_info.should.not.have.been.called;
            switcher.invoke.should.not.have.been.called;
            switcher.has_quiddity.should.not.have.been.called;
            refresh.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( '' );
        } );

        it( 'should return error when port is missing', function () {
            var path    = 'path';
            var id      = 'some id';
            var port    = null;
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            rtpManager.connectRTPDestination( path, id, port, cb );

            switcher.get_info.should.not.have.been.called;
            switcher.invoke.should.not.have.been.called;
            switcher.has_quiddity.should.not.have.been.called;
            refresh.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( '' );
        } );

        it( 'should return error when port is empty', function () {
            var path    = '';
            var id      = 'some id';
            var port    = '';
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            rtpManager.connectRTPDestination( path, id, port, cb );

            switcher.get_info.should.not.have.been.called;
            switcher.invoke.should.not.have.been.called;
            switcher.has_quiddity.should.not.have.been.called;
            refresh.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( '' );
        } );

        it( 'should return error when port is invalid', function () {
            var path    = '';
            var id      = 'some id';
            var port    = 'not a number';
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            rtpManager.connectRTPDestination( path, id, port, cb );

            switcher.get_info.should.not.have.been.called;
            switcher.invoke.should.not.have.been.called;
            switcher.has_quiddity.should.not.have.been.called;
            refresh.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( '' );
        } );

        it( 'should return error when get_info throws', function () {
            var path    = 'some path';
            var id      = 'some id';
            var port    = 9090;
            var error   = 'some error';
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            switcher.get_info.throws( error );

            rtpManager.connectRTPDestination( path, id, port, cb );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( config.rtp.quiddName, '.shmdata.reader' );

            switcher.invoke.should.not.have.been.called;
            switcher.has_quiddity.should.not.have.been.called;
            refresh.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should return error when adding data stream throws', function () {
            var path    = 'some path';
            var id      = 'some id';
            var port    = 9090;
            var error   = 'some error';
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            switcher.get_info.returns(  quiddities.shmdata_readers() );
            switcher.invoke.throws( error );

            rtpManager.connectRTPDestination( path, id, port, cb );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( config.rtp.quiddName, '.shmdata.reader' );

            switcher.invoke.should.have.been.calledOnce;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_data_stream', [path] );

            switcher.has_quiddity.should.not.have.been.called;
            refresh.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should return error when adding data stream fails', function () {
            var path    = 'some path';
            var id      = 'some id';
            var port    = 9090;
            var error   = 'some error';
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            switcher.get_info.returns(  quiddities.shmdata_readers() );
            switcher.invoke.returns( false );

            rtpManager.connectRTPDestination( path, id, port, cb );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( config.rtp.quiddName, '.shmdata.reader' );

            switcher.invoke.should.have.been.calledOnce;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_data_stream', [path] );

            switcher.has_quiddity.should.not.have.been.called;
            refresh.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( '' );
        } );

        it( 'should return error when adding udp to destination throws', function () {
            var path    = 'some path';
            var id      = 'some id';
            var port    = 9090;
            var error   = 'some error';
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            switcher.get_info.returns(  quiddities.shmdata_readers() );
            switcher.invoke.returns( true );
            switcher.invoke.onSecondCall().throws( error );

            rtpManager.connectRTPDestination( path, id, port, cb );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( config.rtp.quiddName, '.shmdata.reader' );

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_data_stream', [path] );
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_udp_stream_to_dest', [path, id, port] );

            switcher.has_quiddity.should.not.have.been.called;
            refresh.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should return error when adding udp to destination fails', function () {
            var path    = 'some path';
            var id      = 'some id';
            var port    = 9090;
            var error   = 'some error';
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            switcher.get_info.returns(  quiddities.shmdata_readers() );
            switcher.invoke.returns( true );
            switcher.invoke.onSecondCall().returns( false );

            rtpManager.connectRTPDestination( path, id, port, cb );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( config.rtp.quiddName, '.shmdata.reader' );

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_data_stream', [path] );
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_udp_stream_to_dest', [path, id, port] );

            switcher.has_quiddity.should.not.have.been.called;
            refresh.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( '' );
        } );

        it( 'should return error when checking for soap control client throws', function () {
            var path    = 'some path';
            var id      = 'some id';
            var port    = 9090;
            var error   = 'some error';
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            switcher.get_info.returns(  quiddities.shmdata_readers() );
            switcher.invoke.returns( true );
            switcher.has_quiddity.throws( error );

            rtpManager.connectRTPDestination( path, id, port, cb );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( config.rtp.quiddName, '.shmdata.reader' );

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_data_stream', [path] );
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_udp_stream_to_dest', [path, id, port] );

            switcher.has_quiddity.should.have.been.calledOnce;
            switcher.has_quiddity.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            refresh.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );
    } );

    describe( 'Disconnecting RTP destination', function () {

        it( 'should follow protocol', function () {
            var path    = 'some path';
            var id      = 'some id';
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            switcher.invoke.returns( [true] );
            switcher.get_property_value.returns(  quiddities.destinations_json() );
            switcher.has_quiddity.returns( true );

            rtpManager.disconnectRTPDestination( path, id, cb );

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_udp_stream_to_dest', [path, id] );
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_data_stream', [path] );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.has_quiddity.should.have.been.calledOnce;
            switcher.has_quiddity.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            refresh.should.have.been.calledOnce;
            refresh.should.have.been.calledWith( id );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        } );

        it( 'should follow protocol when shmdata is still in use', function () {
            var path    = '/tmp/switcher_nodeserver_audiotestsrc1_audio';
            var id      = 'some id';
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            switcher.invoke.returns( [true] );
            switcher.get_property_value.returns(  quiddities.destinations_json() );
            switcher.has_quiddity.returns( true );

            rtpManager.disconnectRTPDestination( path, id, cb );

            switcher.invoke.should.have.been.calledOnce;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_udp_stream_to_dest', [path, id] );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.has_quiddity.should.have.been.calledOnce;
            switcher.has_quiddity.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            refresh.should.have.been.calledOnce;
            refresh.should.have.been.calledWith( id );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        } );

        it( 'should follow protocol when not getting json destinations', function () {
            var path    = 'some path';
            var id      = 'some id';
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            switcher.invoke.returns( [true] );
            switcher.get_property_value.returns(  {} );
            switcher.has_quiddity.returns( true );

            rtpManager.disconnectRTPDestination( path, id, cb );

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_udp_stream_to_dest', [path, id] );
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_data_stream', [path] );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.has_quiddity.should.have.been.calledOnce;
            switcher.has_quiddity.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            refresh.should.have.been.calledOnce;
            refresh.should.have.been.calledWith( id );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        } );

        it( 'should follow protocol when soap control client does not exists', function () {
            var path    = 'some path';
            var id      = 'some id';
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            switcher.invoke.returns( [true] );
            switcher.get_property_value.returns(  quiddities.destinations_json() );
            switcher.has_quiddity.returns( false );

            rtpManager.disconnectRTPDestination( path, id, cb );

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_udp_stream_to_dest', [path, id] );
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_data_stream', [path] );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.has_quiddity.should.have.been.calledOnce;
            switcher.has_quiddity.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            refresh.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        } );

        it( 'should return error when removing udp stream throws', function () {
            var path    = 'some path';
            var id      = 'some id';
            var error   = 'some error';
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            switcher.invoke.throws( error );

            rtpManager.disconnectRTPDestination( path, id, cb );

            switcher.invoke.should.have.been.calledOnce;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_udp_stream_to_dest', [path, id] );

            switcher.get_property_value.should.not.have.been.called;
            switcher.has_quiddity.should.not.have.been.calledOnce;
            refresh.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should return error when removing udp stream fails', function () {
            var path    = 'some path';
            var id      = 'some id';
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            switcher.invoke.returns( false );

            rtpManager.disconnectRTPDestination( path, id, cb );

            switcher.invoke.should.have.been.calledOnce;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_udp_stream_to_dest', [path, id] );

            switcher.get_property_value.should.not.have.been.called;
            switcher.has_quiddity.should.not.have.been.called;
            refresh.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( '' );
        } );

        it( 'should return error when get property value throws', function () {
            var path    = 'some path';
            var id      = 'some id';
            var error   = 'some error';
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            switcher.invoke.returns( [true] );
            switcher.get_property_value.throws( error );

            rtpManager.disconnectRTPDestination( path, id, cb );

            switcher.invoke.should.have.been.calledOnce;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_udp_stream_to_dest', [path, id] );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.has_quiddity.should.not.have.been.called;
            refresh.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should return error when removing data stream throws', function () {
            var path    = 'some path';
            var id      = 'some id';
            var error   = 'some error';
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            switcher.invoke.returns( [true] );
            switcher.invoke.onSecondCall().throws( error );
            switcher.get_property_value.returns(  quiddities.destinations_json() );

            rtpManager.disconnectRTPDestination( path, id, cb );

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_udp_stream_to_dest', [path, id] );
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_data_stream', [path] );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.has_quiddity.should.not.have.been.called;
            refresh.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
        } );

        it( 'should return error when removing data stream fails', function () {
            var path    = 'some path';
            var id      = 'some id';
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            switcher.invoke.returns( [true] );
            switcher.invoke.onSecondCall().returns( false );
            switcher.get_property_value.returns(  quiddities.destinations_json() );

            rtpManager.disconnectRTPDestination( path, id, cb );

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_udp_stream_to_dest', [path, id] );
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_data_stream', [path] );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.has_quiddity.should.not.have.been.called;
            refresh.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( '' );
        } );

        it( 'should return error when has quiddity throws', function () {
            var path    = 'some path';
            var id      = 'some id';
            var error   = 'some error';
            var refresh = sinon.stub( rtpManager, '_refreshHttpSdpDec' );

            switcher.invoke.returns( [true] );
            switcher.get_property_value.returns(  quiddities.destinations_json() );
            switcher.has_quiddity.throws( error );

            rtpManager.disconnectRTPDestination( path, id, cb );

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_udp_stream_to_dest', [path, id] );
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'remove_data_stream', [path] );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json' );

            switcher.has_quiddity.should.have.been.calledOnce;
            switcher.has_quiddity.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            refresh.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch( error );
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

            switcher.get_property_value.returns(  quiddities.destinations_json() );

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

            switcher.get_property_value.returns(  {} );

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

            switcher.get_property_value.returns(  quiddities.destinations_json() );

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

            switcher.get_property_value.returns(  quiddities.destinations_json() );

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

            switcher.get_property_value.returns(  quiddities.destinations_json() );

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