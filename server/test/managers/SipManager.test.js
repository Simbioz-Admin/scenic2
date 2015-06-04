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
            },
            'crypto-js': {
                AES: {
                    decrypt: function( string, secret ) {
                        return {
                            toString: function( endoding ) {
                                return string;
                            }
                        }
                    }
                },
                enc: {
                    Utf8: 'utf-8'
                }
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

            socket.on.callCount.should.equal( 10 );
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
        } );
    } );

    describe( 'Parsers', function () {

        it( 'should parse contacts', function () {
            sipManager._parseContact( quiddities.contact() ).should.eql( quiddities.contact_parsed() );
        } );

    } );

    describe( 'Internals', function () {
        //TODO
    } );

    describe( 'Methods', function () {

        describe( 'Adding contact', function () {

            var uri;
            var name;

            beforeEach(function() {
                uri = 'contact@server.com';
                name = 'Joe Blow';
                switcher.invoke.returns(true);
                sinon.stub( sipManager, '_updateSavedContact' );
                sipManager._updateSavedContact.yields();
            });

            afterEach(function() {
                cb.should.have.been.calledOnce;
            });

            it( 'should follow protocol', function () {
                sipManager.addContact( uri, name, cb );

                switcher.invoke.should.have.been.calledTwice;
                switcher.invoke.should.have.been.calledWithExactly( config.sip.quiddName, 'add_buddy', [uri]);
                switcher.invoke.should.have.been.calledWithExactly( config.sip.quiddName, 'name_buddy', [name, uri]);

                sipManager._updateSavedContact.should.have.been.calledOnce;
                sipManager._updateSavedContact.should.have.been.calledWith( uri, name );

                cb.should.have.been.calledWithExactly();
            } );

            it( 'should return error when missing a uri', function () {
                uri = null;

                sipManager.addContact( uri, name, cb );

                switcher.invoke.should.not.have.been.called;
                sipManager._updateSavedContact.should.not.have.been.called;

                cb.should.have.been.calledWithMatch('');
            } );

            it( 'should return error when missing a name', function () {
                name = null;

                sipManager.addContact( uri, name, cb );

                switcher.invoke.should.not.have.been.called;
                sipManager._updateSavedContact.should.not.have.been.called;

                cb.should.have.been.calledWithMatch('');
            } );

            it( 'should return error when adding contact fails', function () {
                switcher.invoke.returns(false);

                sipManager.addContact( uri, name, cb );

                switcher.invoke.should.have.been.calledOnce;
                switcher.invoke.should.have.been.calledWithExactly( config.sip.quiddName, 'add_buddy', [uri]);

                sipManager._updateSavedContact.should.not.have.been.called;

                cb.should.have.been.calledWithMatch('');
            } );

            it( 'should return error when naming contact fails', function () {
                switcher.invoke.onFirstCall().returns(true);
                switcher.invoke.onSecondCall().returns(false);

                sipManager.addContact( uri, name, cb );

                switcher.invoke.should.have.been.calledTwice;
                switcher.invoke.should.have.been.calledWithExactly( config.sip.quiddName, 'add_buddy', [uri]);
                switcher.invoke.should.have.been.calledWithExactly( config.sip.quiddName, 'name_buddy', [name, uri]);

                sipManager._updateSavedContact.should.not.have.been.called;

                cb.should.have.been.calledWithMatch('');
            } );

        } );

        describe('Removing contact', function() {

            var uri;

            beforeEach(function() {
                uri = 'contact@server.com';
                switcher.invoke.returns(true);
                sinon.stub( sipManager, '_removeSavedContact' );
                sipManager._removeSavedContact.yields();
            });

            afterEach(function() {
                cb.should.have.been.calledOnce;
            });

            it('should follow protocol', function() {
                sipManager.removeContact( uri, cb );

                switcher.invoke.should.have.been.calledOnce;
                switcher.invoke.should.have.been.calledWithExactly( config.sip.quiddName, 'del_buddy', [uri]);

                cb.should.have.been.calledWithExactly();
            });

            it('should return error when uri is missing', function() {
                uri = null;
                sipManager.removeContact( uri, cb );

                switcher.invoke.should.not.have.been.called;

                cb.should.have.been.calledWithMatch('');
            });

            it('should return error when removing contact fails', function() {
                switcher.invoke.returns(false);

                sipManager.removeContact( uri, cb );

                switcher.invoke.should.have.been.calledOnce;
                switcher.invoke.should.have.been.calledWithExactly( config.sip.quiddName, 'del_buddy', [uri]);

                cb.should.have.been.calledWithMatch('');
            });

        });

        describe('Loading contacts', function() {
            //TODO
        });

        describe('Saving contacts', function() {
            //TODO
        });

        describe('Updating contacts', function() {
            //TODO
        });

        describe('Removing saved contact', function() {
            //TODO
        });

    } );

    describe( 'Signal Events', function () {

        it( 'should emit contact info when buddy list gets grafted', function () {
            var id     = 'sip-quiddity-name';
            var signal = 'on-tree-grafted';
            var value  = ['.buddy.0.something'];

            switcher.get_info.returns( quiddities.contact() );

            sipManager.onSwitcherSignal( id, signal, value );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( id, '.buddy.0' );

            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWithExactly( 'contactInfo', quiddities.contact_parsed() );
        } );

        it( 'should emit contact info when buddy list gets pruned', function () {
            var id     = 'sip-quiddity-name';
            var signal = 'on-tree-pruned';
            var value  = ['.buddy.0.something'];

            switcher.get_info.returns( quiddities.contact() );

            sipManager.onSwitcherSignal( id, signal, value );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( id, '.buddy.0' );

            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWithExactly( 'contactInfo', quiddities.contact_parsed() );
        } );

        it( 'should not emit contact info when it doesn\'t relate to a buddy', function () {
            var id     = 'sip-quiddity-name';
            var signal = 'on-tree-pruned';
            var value  = ['.not.a.buddy'];

            sipManager.onSwitcherSignal( id, signal, value );

            switcher.get_info.should.not.have.been.called;
            io.emit.should.not.have.been.called;
        } );

        it( 'should not emit contact info when quiddity id does not match', function () {
            var id     = 'not-the-sip-quiddity';
            var signal = 'on-tree-pruned';
            var value  = ['.buddy.0.something'];

            sipManager.onSwitcherSignal( id, signal, value );

            switcher.get_info.should.not.have.been.called;
            io.emit.should.not.have.been.called;
        } );

        it( 'should not emit contact info when get info throws', function () {
            var id     = 'sip-quiddity-name';
            var signal = 'on-tree-pruned';
            var value  = ['.buddy.0.something'];
            var error  = 'some error';

            switcher.get_info.throws( error );

            sipManager.onSwitcherSignal( id, signal, value );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( id, '.buddy.0' );

            io.emit.should.not.have.been.called;
        } );

        it( 'should not emit contact info when get info returns error', function () {
            var id     = 'sip-quiddity-name';
            var signal = 'on-tree-pruned';
            var value  = ['.buddy.0.something'];
            var error  = 'some error';

            switcher.get_info.returns( {error: error} );

            sipManager.onSwitcherSignal( id, signal, value );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( id, '.buddy.0' );

            io.emit.should.not.have.been.called;
        } );

        it( 'should not emit contact info when get info returns null', function () {
            var id     = 'sip-quiddity-name';
            var signal = 'on-tree-pruned';
            var value  = ['.buddy.0.something'];

            switcher.get_info.returns( null );

            sipManager.onSwitcherSignal( id, signal, value );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( id, '.buddy.0' );

            io.emit.should.not.have.been.called;
        } );

    } );

    describe('Network callbacks', function() {

        describe('Login', function() {

            var credentials;
            var uri;

            beforeEach(function() {
                credentials = {
                    server: 'sip.server.com',
                    user: 'username',
                    port: 666,
                    password: 'some encrypted password'
                };
                contacts = {
                    'username@sip.server.com': {
                        'some@other.contact':'some other contact'
                    }
                };
                uri = credentials.user + '@' + credentials.server;
                sinon.stub( sipManager, 'addContact' );
                sipManager.addContact.yields();
                sinon.stub( sipManager, '_loadContacts' );
                sipManager._loadContacts.yields(null, contacts);

                switcher.has_quiddity.returns(false);
                switcher.create.returns(true);
                switcher.set_property_value.returns(true);
                switcher.invoke.returns(true);
            });

            afterEach(function() {
                cb.should.have.been.calledOnce;
            });

            it('should follow protocol without a sip quiddity', function() {
                sipManager.login( credentials, cb );

                should.exist( sipManager.uri );
                sipManager.uri.should.equal( uri );

                should.exist( config.sip.port );
                config.sip.port.should.equal(credentials.port);

                switcher.has_quiddity.should.have.been.calledOnce;
                switcher.has_quiddity.should.have.been.calledWithExactly(config.sip.quiddName);

                switcher.create.should.have.been.calledOnce;
                switcher.create.should.have.been.calledWithExactly( 'sip', config.sip.quiddName );

                switcher.set_property_value.should.have.been.calledOnce;
                switcher.set_property_value.should.have.been.calledWithExactly( config.sip.quiddName, 'port', String(credentials.port) );

                sipManager.addContact.should.have.been.calledTwice;
                sipManager.addContact.should.have.been.calledWith( uri, credentials.user );
                sipManager.addContact.should.have.been.calledWith( 'some@other.contact', 'some other contact' );


                switcher.invoke.should.have.been.calledOnce;
                switcher.invoke.should.have.been.calledWithExactly( config.sip.quiddName, 'register', [uri,credentials.password] );

                cb.should.have.been.calledWithExactly();
            });

        });

    });

} );