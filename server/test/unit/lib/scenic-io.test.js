var chai      = require( "chai" );
var sinon     = require( "sinon" );
var sinonChai = require( "sinon-chai" );
var should    = chai.should();
chai.use( sinonChai );
var proxyquire = require( 'proxyquire' ).noCallThru();

describe( 'Scenic Io', function () {

    var config;
    var io;
    var switcher;
    var MockScenicClient;
    var scenicIo;

    beforeEach( function () {
        config = {};
        io = {};
        switcher = {};
        MockScenicClient = sinon.stub();
        scenicIo     = proxyquire( '../../../src/lib/scenic-io', {
            '../net/ScenicClient': MockScenicClient
        } );
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

        scenicIo.initialize( config, io, switcher );

        var mockSocket = sinon.spy();
        mockSocket.on = sinon.spy();

        mockOn.args[0][1]( mockSocket );

        MockScenicClient.should.have.been.calledWithNew;
        MockScenicClient.should.have.been.calledWithExactly( switcher, config, mockSocket );
    });
});