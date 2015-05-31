var _          = require( 'underscore' );
var proxyquire = require( 'proxyquire' ).noCallThru();
var chai       = require( "chai" );
var sinon      = require( "sinon" );
var sinonChai  = require( "sinon-chai" );
var should     = chai.should();
chai.use( sinonChai );

var logStub      = require( '../fixtures/log' );
var switcherStub = require( '../fixtures/switcher' );
var quiddities   = require( '../fixtures/quiddities' );

describe( 'RTP Manager', function () {

    var switcher;
    var config;
    var io;
    var rtpManager;

    before( function ( done ) {
        var i18n = require( '../../src/lib/i18n' );
        i18n.initialize( done );
    } );

    beforeEach( function () {
        switcher                = switcherStub();
        config                  = {
            nameComputer: 'computer-name',
            rtp: {
                quiddName: 'rtp-quiddity-name'
            },
            soap: {
                soapControlClientPrefix: 'soap-control-client-prefix'
            }
        };
        io                      = {};
        io.emit                 = sinon.spy();
        var RtpManager     = proxyquire( '../../src/switcher/RtpManager', {
            'switcher':         switcher,
            '../lib/logger':    logStub(),
            '../utils/logback': function ( e, c ) {
                c( e );
            }
        } );
        rtpManager         = new RtpManager( config, switcher, io );
        rtpManager.logback = sinon.stub();
        rtpManager.logback.yields();
    } );

    afterEach( function () {
        switcher        = null;
        config          = null;
        io              = null;
        rtpManager = null;
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

    describe( 'Creating RTP destination', function() {

        it('should follow protocol', function() {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;
            var cb = sinon.stub();

            switcher.get_property_value.returns( JSON.stringify(quiddities.destinations_json()));
            switcher.invoke.returns([ true ]);
            switcher.create.returns([ config.soap.controlClientPrefix + name ]);

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json');

            switcher.invoke.should.have.been.calledThrice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host]);
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port]);
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'create', ['httpsdpdec', config.nameComputer]);

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        });

        it('should follow protocol with a host with protocol', function() {
            var name = 'some name';
            var host = 'http://some.host';
            var host_parsed = 'some.host';
            var port = 9090;
            var cb = sinon.stub();

            switcher.get_property_value.returns( JSON.stringify(quiddities.destinations_json()));
            switcher.invoke.returns([ true ]);
            switcher.create.returns([ config.soap.controlClientPrefix + name ]);

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json');

            switcher.invoke.should.have.been.calledThrice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host_parsed]);
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host_parsed + ':' + port]);
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'create', ['httpsdpdec', config.nameComputer]);

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        });

        it('should follow protocol with a string port', function() {
            var name = 'some name';
            var host = 'some.host';
            var port = '9090';
            var cb = sinon.stub();

            switcher.get_property_value.returns( JSON.stringify(quiddities.destinations_json()));
            switcher.invoke.returns([ true ]);
            switcher.create.returns([ config.soap.controlClientPrefix + name ]);

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json');

            switcher.invoke.should.have.been.calledThrice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host]);
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port]);
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'create', ['httpsdpdec', config.nameComputer]);

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        });

        it('should follow protocol without a port', function() {
            var name = 'some name';
            var host = 'some.host';
            var port = null;
            var cb = sinon.stub();

            switcher.get_property_value.returns( JSON.stringify(quiddities.destinations_json()));
            switcher.invoke.returns([ true ]);
            switcher.create.returns([ config.soap.controlClientPrefix + name ]);

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json');

            switcher.invoke.should.have.been.calledOnce;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host]);

            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        });

        it('should follow protocol without an empty port', function() {
            var name = 'some name';
            var host = 'some.host';
            var port = '';
            var cb = sinon.stub();

            switcher.get_property_value.returns( JSON.stringify(quiddities.destinations_json()));
            switcher.invoke.returns([ true ]);
            switcher.create.returns([ config.soap.controlClientPrefix + name ]);

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json');

            switcher.invoke.should.have.been.calledOnce;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host]);

            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        });

        it('should follow protocol without destinations', function() {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;
            var cb = sinon.stub();

            switcher.get_property_value.returns( JSON.stringify({}));
            switcher.invoke.returns([ true ]);
            switcher.create.returns([ config.soap.controlClientPrefix + name ]);

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json');

            switcher.invoke.should.have.been.calledThrice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host]);
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port]);
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'create', ['httpsdpdec', config.nameComputer]);

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        });

        it('should follow protocol with empty destinations', function() {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;
            var cb = sinon.stub();

            switcher.get_property_value.returns( JSON.stringify({destinations:[]}));
            switcher.invoke.returns([ true ]);
            switcher.create.returns([ config.soap.controlClientPrefix + name ]);

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json');

            switcher.invoke.should.have.been.calledThrice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host]);
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port]);
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'create', ['httpsdpdec', config.nameComputer]);

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        });

        it('should follow protocol with null destinations', function() {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;
            var cb = sinon.stub();

            switcher.get_property_value.returns( JSON.stringify({destinations:null}));
            switcher.invoke.returns([ true ]);
            switcher.create.returns([ config.soap.controlClientPrefix + name ]);

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json');

            switcher.invoke.should.have.been.calledThrice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host]);
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port]);
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'create', ['httpsdpdec', config.nameComputer]);

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        });

        it('should follow protocol with invalid destinations', function() {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;
            var cb = sinon.stub();

            switcher.get_property_value.returns( JSON.stringify({destinations:{not:'an array'}}));
            switcher.invoke.returns([ true ]);
            switcher.create.returns([ config.soap.controlClientPrefix + name ]);

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json');

            switcher.invoke.should.have.been.calledThrice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host]);
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port]);
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'create', ['httpsdpdec', config.nameComputer]);

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        });

        it('should return error with no name', function() {
            var name = null;
            var host = 'some.host';
            var port = 9090;
            var cb = sinon.stub();

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.not.have.been.called;
            switcher.invoke.should.not.have.been.called;
            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch('');
        });

        it('should return error with empty name', function() {
            var name = '';
            var host = 'some.host';
            var port = 9090;
            var cb = sinon.stub();

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.not.have.been.called;
            switcher.invoke.should.not.have.been.called;
            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch('');
        });

        it('should return error with no host', function() {
            var name = 'some name';
            var host = null;
            var port = 9090;
            var cb = sinon.stub();

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.not.have.been.called;
            switcher.invoke.should.not.have.been.called;
            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch('');
        });

        it('should return error with empty host', function() {
            var name = 'some name';
            var host = '';
            var port = 9090;
            var cb = sinon.stub();

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.not.have.been.called;
            switcher.invoke.should.not.have.been.called;
            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch('');
        });

        it('should return error with invalid port', function() {
            var name = 'some name';
            var host = 'some.host';
            var port = 'this is not a port';
            var cb = sinon.stub();

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.not.have.been.called;
            switcher.invoke.should.not.have.been.called;
            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch('');
        });

        it('should return error when get_property_value throws', function() {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;
            var error = 'some error';
            var cb = sinon.stub();

            switcher.get_property_value.throws( error );

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json');

            switcher.invoke.should.not.have.been.called;
            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch(error);
        });

        it('should return error when get_property_value returns an error', function() {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;
            var error = 'some error';
            var cb = sinon.stub();

            switcher.get_property_value.returns( JSON.stringify({error:error}) );

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json');

            switcher.invoke.should.not.have.been.called;
            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch(error);
        });

        it('should return error when get_property_value destination name already exists', function() {
            var name = 'destination name';
            var host = 'some.host';
            var port = 9090;
            var cb = sinon.stub();

            switcher.get_property_value.returns( JSON.stringify(quiddities.destinations_json()));

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json');

            switcher.invoke.should.not.have.been.called;
            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch(name);
        });

        it('should return error when first invoke throws', function() {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;
            var error = 'some error';
            var cb = sinon.stub();

            switcher.get_property_value.returns( JSON.stringify(quiddities.destinations_json()));
            switcher.invoke.onFirstCall().throws(error);

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json');

            switcher.invoke.should.have.been.calledOnce;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host]);
            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch(error);
        });

        it('should return error when first invoke returns null', function() {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;
            var cb = sinon.stub();

            switcher.get_property_value.returns( JSON.stringify(quiddities.destinations_json()));
            switcher.invoke.onFirstCall().returns(null);

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json');

            switcher.invoke.should.have.been.calledOnce;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host]);
            switcher.create.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch('');
        });

        it('should return error when create throws', function() {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;
            var error = 'some error';
            var cb = sinon.stub();

            switcher.get_property_value.returns( JSON.stringify(quiddities.destinations_json()));
            switcher.invoke.returns([ true ]);
            switcher.create.throws(error);

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json');

            switcher.invoke.should.have.been.calledOnce;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host]);

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch(error);
        });

        it('should return error when create returns null', function() {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;
            var cb = sinon.stub();

            switcher.get_property_value.returns( JSON.stringify(quiddities.destinations_json()));
            switcher.invoke.returns([ true ]);
            switcher.create.returns(null);

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json');

            switcher.invoke.should.have.been.calledOnce;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host]);

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch('');
        });

        it('should return error when second invoke throws', function() {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;
            var error = 'some error';
            var cb = sinon.stub();

            switcher.get_property_value.returns( JSON.stringify(quiddities.destinations_json()));
            switcher.invoke.returns([ true ]);
            switcher.create.returns([ config.soap.controlClientPrefix + name ]);
            switcher.invoke.onSecondCall().throws(error);

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json');

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host]);
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port]);

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch(error);
        });

        it('should return error when second invoke returns null', function() {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;
            var cb = sinon.stub();

            switcher.get_property_value.returns( JSON.stringify(quiddities.destinations_json()));
            switcher.invoke.returns([ true ]);
            switcher.create.returns([ config.soap.controlClientPrefix + name ]);
            switcher.invoke.onSecondCall().returns(null);

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json');

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host]);
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port]);

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch('');
        });

        it('should return error when third invoke throws', function() {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;
            var error = 'some error';
            var cb = sinon.stub();

            switcher.get_property_value.returns( JSON.stringify(quiddities.destinations_json()));
            switcher.invoke.returns([ true ]);
            switcher.create.returns([ config.soap.controlClientPrefix + name ]);
            switcher.invoke.onThirdCall().throws(error);

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json');

            switcher.invoke.should.have.been.calledThrice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host]);
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port]);
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'create', ['httpsdpdec', config.nameComputer]);

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch(error);
        });

        it('should return error when third invoke returns null', function() {
            var name = 'some name';
            var host = 'some.host';
            var port = 9090;
            var cb = sinon.stub();

            switcher.get_property_value.returns( JSON.stringify(quiddities.destinations_json()));
            switcher.invoke.returns([ true ]);
            switcher.create.returns([ config.soap.controlClientPrefix + name ]);
            switcher.invoke.onThirdCall().returns(null);

            rtpManager.createRTPDestination( name, host, port, cb );

            switcher.get_property_value.should.have.been.calledOnce;
            switcher.get_property_value.should.have.been.calledWithExactly( config.rtp.quiddName, 'destinations-json');

            switcher.invoke.should.have.been.calledThrice;
            switcher.invoke.should.have.been.calledWithExactly( config.rtp.quiddName, 'add_destination', [name, host]);
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'set_remote_url_retry', ['http://' + host + ':' + port]);
            switcher.invoke.should.have.been.calledWithExactly( config.soap.controlClientPrefix + name, 'create', ['httpsdpdec', config.nameComputer]);

            switcher.create.should.have.been.calledOnce;
            switcher.create.should.have.been.calledWithExactly( 'SOAPcontrolClient', config.soap.controlClientPrefix + name);

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch('');
        });

    });

    describe( 'Removing RTP destinations', function() {

        it('should follow protocol', function() {
            var id = 'someId';
            var cb = sinon.stub();

            switcher.invoke.returns([true]);
            switcher.remove.returns(true);

            rtpManager.removeRTPDestination(id, cb);

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly(config.rtp.quiddName, 'remove_destination', [id]);
            switcher.invoke.should.have.been.calledWithExactly(config.soap.controlClientPrefix + id, 'remove', [config.nameComputer]);

            switcher.remove.should.have.been.calledOnce;
            switcher.remove.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        });

        it('should return error when removing destination throws', function() {
            var id = 'someId';
            var error = 'some error';
            var cb = sinon.stub();

            switcher.invoke.onFirstCall().throws(error);

            rtpManager.removeRTPDestination(id, cb);

            switcher.invoke.should.have.been.calledOnce;
            switcher.invoke.should.have.been.calledWithExactly(config.rtp.quiddName, 'remove_destination', [id]);

            switcher.remove.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch(error);
        });

        it('should return error when removing destination returns false', function() {
            var id = 'someId';
            var cb = sinon.stub();

            switcher.invoke.onFirstCall().returns(false);

            rtpManager.removeRTPDestination(id, cb);

            switcher.invoke.should.have.been.calledOnce;
            switcher.invoke.should.have.been.calledWithExactly(config.rtp.quiddName, 'remove_destination', [id]);

            switcher.remove.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch('');
        });

        it('should return error when removing httpsdpdec throws', function() {
            var id = 'someId';
            var error = 'some error';
            var cb = sinon.stub();

            switcher.invoke.returns([true]);
            switcher.invoke.onSecondCall().throws(error);
            switcher.remove.returns(true);

            rtpManager.removeRTPDestination(id, cb);

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly(config.rtp.quiddName, 'remove_destination', [id]);
            switcher.invoke.should.have.been.calledWithExactly(config.soap.controlClientPrefix + id, 'remove', [config.nameComputer]);

            switcher.remove.should.not.have.been.called;

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch(error);
        });

        it('should continue when removing httpsdpdec fails', function() {
            var id = 'someId';
            var cb = sinon.stub();

            switcher.invoke.returns([true]);
            switcher.invoke.onSecondCall().returns(false);
            switcher.remove.returns(true);

            rtpManager.removeRTPDestination(id, cb);

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly(config.rtp.quiddName, 'remove_destination', [id]);
            switcher.invoke.should.have.been.calledWithExactly(config.soap.controlClientPrefix + id, 'remove', [config.nameComputer]);

            switcher.remove.should.have.been.calledOnce;
            switcher.remove.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        });

        it('should return error when removing soap control client throws', function() {
            var id = 'someId';
            var error = 'some error';
            var cb = sinon.stub();

            switcher.invoke.returns([true]);
            switcher.remove.throws(error);

            rtpManager.removeRTPDestination(id, cb);

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly(config.rtp.quiddName, 'remove_destination', [id]);
            switcher.invoke.should.have.been.calledWithExactly(config.soap.controlClientPrefix + id, 'remove', [config.nameComputer]);

            switcher.remove.should.have.been.calledOnce;
            switcher.remove.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithMatch(error);
        });

        it('should continue when removing soap control client fails', function() {
            var id = 'someId';
            var cb = sinon.stub();

            switcher.invoke.returns([true]);
            switcher.remove.returns(false);

            rtpManager.removeRTPDestination(id, cb);

            switcher.invoke.should.have.been.calledTwice;
            switcher.invoke.should.have.been.calledWithExactly(config.rtp.quiddName, 'remove_destination', [id]);
            switcher.invoke.should.have.been.calledWithExactly(config.soap.controlClientPrefix + id, 'remove', [config.nameComputer]);

            switcher.remove.should.have.been.calledOnce;
            switcher.remove.should.have.been.calledWithExactly( config.soap.controlClientPrefix + id );

            cb.should.have.been.calledOnce;
            cb.should.have.been.calledWithExactly();
        });

    });

    describe('Connecting RTP destination', function() {

    });
});