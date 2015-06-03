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

describe( 'Sip Manager', function () {

    var switcher;
    var config;
    var io;
    var sipManager;
    var cb;

    before( function ( done ) {
        var i18n = require( '../../src/lib/i18n' );
        i18n.initialize( done );
    } );

    beforeEach( function () {
        switcher           = new switcherStub.Switcher();
        config             = {
            sip: {
                quiddName: 'sip-quiddity-name'
            }
        };
        io                 = {};
        io.emit            = sinon.spy();
        var SipManager     = proxyquire( '../../src/switcher/SipManager', {
            'switcher':         switcher,
            '../lib/logger':    logStub(),
            '../utils/logback': function ( e, c ) {
                c( e );
            }
        } );
        sipManager         = new SipManager( config, switcher, io );
        sipManager.logback = sinon.stub();
        sipManager.logback.yields();
        cb                 = sinon.stub();
    } );

    afterEach( function () {
        switcher   = null;
        config     = null;
        io         = null;
        sipManager = null;
        cb         = null;
    } );

    // Hey, dummy test to get started
    it( 'should exist', function () {
        should.exist( sipManager );
    } );

    describe( 'Initialization', function () {

        it( 'should have been instanciated correctly', function () {
            should.exist( sipManager.config );
            sipManager.config.should.equal( config );

            should.exist( sipManager.switcher );
            sipManager.switcher.should.equal( switcher );

            should.exist( sipManager.io );
            sipManager.io.should.equal( io );
        } );

        it( 'should bind to clients', function () {
            var socket = {on: sinon.spy()};

            sipManager.bindClient( socket );

            socket.on.callCount.should.equal( 11 );
            socket.on.should.have.been.calledWith( 'sipLogin' );
            socket.on.should.have.been.calledWith( 'sipLogout' );
            socket.on.should.have.been.calledWith( 'getContacts' );
            socket.on.should.have.been.calledWith( 'addContact' );
            socket.on.should.have.been.calledWith( 'removeContact' );
            socket.on.should.have.been.calledWith( 'attachShmdataToContact' );
            socket.on.should.have.been.calledWith( 'detachShmdataFromContact' );
            socket.on.should.have.been.calledWith( 'callContact' );
            socket.on.should.have.been.calledWith( 'hangUpContact' );
            socket.on.should.have.been.calledWith( 'updateContact' );
            socket.on.should.have.been.calledWith( 'getListStatus' );
        } );
    } );

    describe( 'Parsers', function () {

        it( 'should parse contacts', function () {
            sipManager._parseContact( quiddities.contact() ).should.eql( quiddities.contact_parsed() );
        } );

    });

    describe( 'Internals', function () {
        //TODO
    });

    describe( 'Signals Events', function () {

        it('should emit contact info when buddy list gets grafted', function() {
            var id = 'sip-quiddity-name';
            var signal = 'on-tree-grafted';
            var value = ['.buddy.0.something'];

            switcher.get_info.returns(quiddities.contact());

            sipManager.onSwitcherSignal( id, signal, value );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( id, '.buddy.0');

            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWithExactly('contactInfo', quiddities.contact_parsed());
        });

        it('should emit contact info when buddy list gets pruned', function() {
            var id = 'sip-quiddity-name';
            var signal = 'on-tree-pruned';
            var value = ['.buddy.0.something'];

            switcher.get_info.returns(quiddities.contact());

            sipManager.onSwitcherSignal( id, signal, value );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( id, '.buddy.0');

            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWithExactly('contactInfo', quiddities.contact_parsed());
        });

        it('should not emit contact info when it doesn\'t relate to a buddy', function() {
            var id = 'sip-quiddity-name';
            var signal = 'on-tree-pruned';
            var value = ['.not.a.buddy'];

            sipManager.onSwitcherSignal( id, signal, value );

            switcher.get_info.should.not.have.been.called;
            io.emit.should.not.have.been.called;
        });

        it('should not emit contact info when quiddity id does not match', function() {
            var id = 'not-the-sip-quiddity';
            var signal = 'on-tree-pruned';
            var value = ['.buddy.0.something'];

            sipManager.onSwitcherSignal( id, signal, value );

            switcher.get_info.should.not.have.been.called;
            io.emit.should.not.have.been.called;
        });

        it('should not emit contact info when get info throws', function() {
            var id = 'sip-quiddity-name';
            var signal = 'on-tree-pruned';
            var value = ['.buddy.0.something'];
            var error = 'some error';

            switcher.get_info.throws(error);

            sipManager.onSwitcherSignal( id, signal, value );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( id, '.buddy.0');

            io.emit.should.not.have.been.called;
        });

        it('should not emit contact info when get info returns error', function() {
            var id = 'sip-quiddity-name';
            var signal = 'on-tree-pruned';
            var value = ['.buddy.0.something'];
            var error = 'some error';

            switcher.get_info.returns({error:error});

            sipManager.onSwitcherSignal( id, signal, value );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( id, '.buddy.0');

            io.emit.should.not.have.been.called;
        });

        it('should not emit contact info when get info returns null', function() {
            var id = 'sip-quiddity-name';
            var signal = 'on-tree-pruned';
            var value = ['.buddy.0.something'];

            switcher.get_info.returns(null);

            sipManager.onSwitcherSignal( id, signal, value );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( id, '.buddy.0');

            io.emit.should.not.have.been.called;
        });

    });

} );