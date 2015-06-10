var chai      = require( "chai" );
var sinon     = require( "sinon" );
var sinonChai = require( "sinon-chai" );
var should    = chai.should();
chai.use( sinonChai );

describe( 'Configuration', function () {

    var config;

    beforeEach( function () {
        config = require( '../../src/settings/config' );
    } );
    afterEach( function () {
        config = null;
    } );

    // Hey, dummy test to get started
    it( 'should exist', function () {
        should.exist( config );
    } );

    it( 'should contain basic required fields', function () {
        should.exist( config.version );
        should.exist( config.lang );
        should.exist( config.host );

        should.exist( config.rtp );
        should.exist( config.rtp.quiddName );
        config.rtp.quiddName.should.be.a( 'string' );

        should.exist( config.systemUsage );
        should.exist( config.systemUsage.quiddName );
        config.systemUsage.quiddName.should.be.a( 'string' );
        should.exist( config.systemUsage.period );
        config.systemUsage.period.should.be.a( 'number' );

        should.exist( config.nameComputer );
        config.nameComputer.should.be.a( 'string' );

        should.exist( config.defaultPanelPage );
        config.defaultPanelPage.should.be.a( 'string' );

        should.exist( config.homePath );
        config.homePath.should.be.a( 'string' );

        should.exist( config.savePath );
        config.savePath.should.be.a( 'string' );

        should.exist( config.contactsPath );
        config.contactsPath.should.be.a( 'string' );

        should.exist( config.logPath );
        config.logPath.should.be.a( 'string' );
    } );

    it( 'should contain scenic configuration', function () {
        should.exist( config.scenic );
        should.exist( config.scenic.ports );
        should.exist( config.scenic.ports.min );
        config.scenic.ports.min.should.be.greaterThan( 1024 );
        should.exist( config.scenic.ports.max );
        config.scenic.ports.max.should.be.greaterThan( config.scenic.ports.min );
        should.not.exist( config.scenic.port ); // We auto-detect ports
    } );

    it( 'should contain soap configuration', function () {
        should.exist( config.soap );
        should.exist( config.soap.ports );
        should.exist( config.soap.ports.min );
        config.soap.ports.min.should.be.greaterThan( 1024 );
        should.exist( config.soap.ports.max );
        config.soap.ports.max.should.be.greaterThan( config.soap.ports.min );
        should.not.exist( config.soap.port ); // We auto-detect ports
    } );

    it( 'should contain sip configuration', function () {
        should.exist( config.sip );
        should.not.exist( config.sip.ports ); //Removed as SIP uses UDP ports
        //should.exist( config.sip.ports.min );
        //config.sip.ports.min.should.be.greaterThan( 1024 );
        //should.exist( config.sip.ports.max );
        //config.sip.ports.max.should.be.greaterThan( config.sip.ports.min );
        should.exist( config.sip.port ); // We auto-detect ports
        config.sip.port.should.equal(5060); //Auto dectection was not working with UDP ports

        should.exist( config.sip.quiddName );
        config.sip.quiddName.should.be.a( 'string' );

        should.exist( config.sip.server );
        config.sip.server.should.be.a( 'string' );
    } );
} );