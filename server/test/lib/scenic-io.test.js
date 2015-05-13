var chai      = require( "chai" );
var sinon     = require( "sinon" );
var sinonChai = require( "sinon-chai" );
var should    = chai.should();
chai.use( sinonChai );

describe( 'Scenic Io', function () {

    var config;
    var io;
    var switcher;
    var scenicIo;

    beforeEach( function () {
        config = {};
        io = {};
        switcher = {};
        scenicIo = require( '../../src/lib/scenic-io' );
    } );
    afterEach( function () {
        config = null;
        io = null;
        switcher = null;
        scenicIo = null;
    } );

    // Hey, dummy test to get started
    it( 'should exist', function () {
        should.exist( scenicIo );
    } );

    it( 'should bind to connection when initializing', function() {
        var mockOn = sinon.spy();
        io.on = mockOn;
        scenicIo.initialize( config, io, switcher );
        mockOn.should.have.been.calledOnce;
        mockOn.should.have.been.calledWith( 'connection' );
    });

    it( 'should receive connections', function() {
        var mockOn = sinon.spy();
        io.on = mockOn;

        switcher.bindClient = sinon.spy();

        scenicIo.initialize( config, io, switcher );

        var mockSocket = sinon.spy();
        mockSocket.on = sinon.spy();

        mockOn.args[0][1]( mockSocket );

        switcher.bindClient.should.have.been.calledOnce;
        switcher.bindClient.should.have.been.calledWith( mockSocket );

        mockSocket.on.should.have.been.calledTwice;
        mockSocket.on.should.have.been.calledWith( 'getConfig' );
        mockSocket.on.should.have.been.calledWith( 'disconnect' );
    });
});