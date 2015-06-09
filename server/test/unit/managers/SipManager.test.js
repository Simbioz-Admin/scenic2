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

describe( 'Sip Manager', function () {

    var switcher;
    var io;
    var config;
    var switcherController;
    var sipManager;

    beforeEach( function () {
        switcher = new switcherStub.Switcher();
        io = {};
        io.emit = sinon.stub();
        config = {
            sip: {
                quiddName: 'sip-quiddity-name',
                port:      null
            }
        };

        switcherController = {
            switcher: switcher,
            config:   config,
            io:       io
        };

        var SipManager     = proxyquire( '../../../src/switcher/SipManager', {
            'switcher':      switcher,
            '../lib/logger': logStub(),
            'crypto-js':     {
                AES: {
                    decrypt: function ( string, secret ) {
                        return {
                            toString: function ( endoding ) {
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

        sipManager         = new SipManager( switcherController );
    } );

    afterEach( function () {
        switcher   = null;
        config     = null;
        io         = null;
        sipManager = null;
    } );

    // Hey, dummy test to get started
    it( 'should exist', function () {
        should.exist( sipManager );
    } );

    describe( 'Initialization', function () {

        it( 'should have been instantiated correctly', function () {
            should.exist( sipManager.config );
            sipManager.config.should.equal( config );

            should.exist( sipManager.switcher );
            sipManager.switcher.should.equal( switcher );

            should.exist( sipManager.io );
            sipManager.io.should.equal( io );

            should.exist( sipManager.contacts );
            sipManager.contacts.should.be.an( 'object' );
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

    describe( 'Private Methods', function () {

        describe( 'Loading contacts', function () {
            //TODO
        } );

        describe( 'Saving contacts', function () {
            //TODO
        } );

        describe( 'Updating contacts', function () {
            //TODO
        } );

        describe( 'Removing saved contact', function () {
            //TODO
        } );

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

    describe( 'Public Methods', function () {

        describe( 'Contacts', function () {

            var me;
            var uri;
            var name;

            beforeEach( function () {
                uri  = 'contact@server.com';
                name = 'Joe Blow';
                switcher.invoke.returns( true );
                me   = sipManager.uri = 'myself@me.com';
                sinon.stub( sipManager, '_saveContacts' );
            } );

            describe( 'Adding contact', function () {

                it( 'should follow protocol', function () {
                    var result = sipManager.addContact( uri, name );
                    switcher.invoke.should.have.been.calledTwice;
                    switcher.invoke.should.have.been.calledWithExactly( config.sip.quiddName, 'add_buddy', [uri] );
                    switcher.invoke.should.have.been.calledWithExactly( config.sip.quiddName, 'name_buddy', [name, uri] );
                    sipManager._saveContacts.should.have.been.calledOnce;
                    should.exist( result );
                    result.should.be.true;
                    should.exist( sipManager.contacts );
                    should.exist( sipManager.contacts[me] );
                    should.exist( sipManager.contacts[me][uri] );
                    sipManager.contacts[me][uri].should.equal( name );
                } );

                it( 'should not save if we tell it not to', function () {
                    var result = sipManager.addContact( uri, name, true );
                    switcher.invoke.should.have.been.calledTwice;
                    switcher.invoke.should.have.been.calledWithExactly( config.sip.quiddName, 'add_buddy', [uri] );
                    switcher.invoke.should.have.been.calledWithExactly( config.sip.quiddName, 'name_buddy', [name, uri] );
                    sipManager._saveContacts.should.not.have.been.calledOnce;
                    should.exist( result );
                    result.should.be.true;
                } );

                it( 'should return false when adding contact fails', function () {
                    switcher.invoke.returns( false );
                    var result = sipManager.addContact( uri, name );
                    switcher.invoke.should.have.been.calledOnce;
                    switcher.invoke.should.have.been.calledWithExactly( config.sip.quiddName, 'add_buddy', [uri] );
                    sipManager._saveContacts.should.not.have.been.called;
                    should.exist( result );
                    result.should.be.false;
                } );

                it( 'should return false when naming contact fails', function () {
                    switcher.invoke.onFirstCall().returns( true );
                    switcher.invoke.onSecondCall().returns( false );
                    var result = sipManager.addContact( uri, name );
                    switcher.invoke.should.have.been.calledTwice;
                    switcher.invoke.should.have.been.calledWithExactly( config.sip.quiddName, 'add_buddy', [uri] );
                    switcher.invoke.should.have.been.calledWithExactly( config.sip.quiddName, 'name_buddy', [name, uri] );
                    sipManager._saveContacts.should.not.have.been.called;
                    should.exist( result );
                    result.should.be.false;
                } );

            } );

            describe( 'Removing contact', function () {

                beforeEach( function () {
                    sipManager.addContact( uri, name, true );
                    should.exist( sipManager.contacts );
                    should.exist( sipManager.contacts[me] );
                    should.exist( sipManager.contacts[me][uri] );
                    switcher.invoke.reset();
                } );

                it( 'should follow protocol', function () {
                    var result = sipManager.removeContact( uri );
                    switcher.invoke.should.have.been.calledOnce;
                    switcher.invoke.should.have.been.calledWithExactly( config.sip.quiddName, 'del_buddy', [uri] );
                    sipManager._saveContacts.should.have.been.calledOnce;
                    should.exist( result );
                    result.should.be.true;
                    should.exist( sipManager.contacts );
                    should.exist( sipManager.contacts[me] );
                    should.not.exist( sipManager.contacts[me][uri] );
                } );

                it( 'should not save when told not to', function () {
                    var result = sipManager.removeContact( uri, true );
                    switcher.invoke.should.have.been.calledOnce;
                    switcher.invoke.should.have.been.calledWithExactly( config.sip.quiddName, 'del_buddy', [uri] );
                    sipManager._saveContacts.should.not.have.been.calledOnce;
                    should.exist( result );
                    result.should.be.true;
                    should.exist( sipManager.contacts );
                    should.exist( sipManager.contacts[me] );
                    should.not.exist( sipManager.contacts[me][uri] );
                } );

                it( 'should return error when removing contact fails', function () {
                    switcher.invoke.returns( false );
                    var result = sipManager.removeContact( uri );
                    switcher.invoke.should.have.been.calledOnce;
                    switcher.invoke.should.have.been.calledWithExactly( config.sip.quiddName, 'del_buddy', [uri] );
                    sipManager._saveContacts.should.have.been.calledOnce;
                    should.exist( result );
                    result.should.be.false;
                } );

            } );

        } );

        describe( 'Login', function () {

            var credentials;
            var uri;

            beforeEach( function () {
                credentials = {
                    server:   'sip.server.com',
                    user:     'username',
                    port:     666,
                    password: 'some encrypted password'
                };
                uri         = credentials.user + '@' + credentials.server;

                sipManager.contacts = {
                    'username@sip.server.com': {
                        'some@other.contact': 'some other contact'
                    }
                };

                switcherController.quiddityManager                  = {};
                switcherController.quiddityManager.create           = sinon.stub();
                switcherController.quiddityManager.create.returns( true );
                switcherController.quiddityManager.setPropertyValue = sinon.stub();
                switcherController.quiddityManager.setPropertyValue.returns( true );
                switcherController.quiddityManager.invokeMethod = sinon.stub();
                switcherController.quiddityManager.invokeMethod.returns( true );

                sinon.stub( sipManager, 'addContact' );
                sinon.stub( sipManager, '_saveContacts' );

                switcher.has_quiddity.returns( false );
                switcher.invoke.returns( true );
            } );

            it( 'should follow protocol without a sip quiddity', function () {
                var result = sipManager.login( credentials );

                should.exist( sipManager.uri );
                sipManager.uri.should.equal( uri );

                should.exist( config.sip.port );
                config.sip.port.should.equal( credentials.port );

                switcher.has_quiddity.should.have.been.calledOnce;
                switcher.has_quiddity.should.have.been.calledWithExactly( config.sip.quiddName );

                switcherController.quiddityManager.create.should.have.been.calledOnce;
                switcherController.quiddityManager.create.should.have.been.calledWithExactly( 'sip', config.sip.quiddName );

                switcherController.quiddityManager.setPropertyValue.should.have.been.calledOnce;
                switcherController.quiddityManager.setPropertyValue.should.have.been.calledWithExactly( config.sip.quiddName, 'port', credentials.port );

                switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'register', [uri, credentials.password] );

                sipManager.addContact.should.have.been.calledTwice;
                sipManager.addContact.should.have.been.calledWithExactly( uri, credentials.user, true );
                sipManager.addContact.should.have.been.calledWith( 'some@other.contact', 'some other contact', true );

                sipManager._saveContacts.should.have.been.calledOnce;

                should.exist(result);
                result.should.be.true;
            } );

            it( 'should follow protocol with a sip quiddity', function () {
                switcher.has_quiddity.returns( true );
                var result = sipManager.login( credentials );

                should.exist( sipManager.uri );
                sipManager.uri.should.equal( uri );

                should.exist( config.sip.port );
                config.sip.port.should.equal( credentials.port );

                switcher.has_quiddity.should.have.been.calledOnce;
                switcher.has_quiddity.should.have.been.calledWithExactly( config.sip.quiddName );

                switcherController.quiddityManager.create.should.not.have.been.called;

                switcherController.quiddityManager.setPropertyValue.should.have.been.calledOnce;
                switcherController.quiddityManager.setPropertyValue.should.have.been.calledWithExactly( config.sip.quiddName, 'port', credentials.port );

                switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'register', [uri, credentials.password] );

                sipManager.addContact.should.have.been.calledTwice;
                sipManager.addContact.should.have.been.calledWithExactly( uri, credentials.user, true );
                sipManager.addContact.should.have.been.calledWith( 'some@other.contact', 'some other contact', true );

                sipManager._saveContacts.should.have.been.calledOnce;

                should.exist(result);
                result.should.be.true;
            } );

            it( 'should follow protocol without contacts', function () {
                sipManager.contacts = {};
                var result = sipManager.login( credentials );

                should.exist( sipManager.uri );
                sipManager.uri.should.equal( uri );

                should.exist( config.sip.port );
                config.sip.port.should.equal( credentials.port );

                switcher.has_quiddity.should.have.been.calledOnce;
                switcher.has_quiddity.should.have.been.calledWithExactly( config.sip.quiddName );

                switcherController.quiddityManager.create.should.have.been.calledOnce;
                switcherController.quiddityManager.create.should.have.been.calledWithExactly( 'sip', config.sip.quiddName );

                switcherController.quiddityManager.setPropertyValue.should.have.been.calledOnce;
                switcherController.quiddityManager.setPropertyValue.should.have.been.calledWithExactly( config.sip.quiddName, 'port', credentials.port );

                switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'register', [uri, credentials.password] );

                sipManager.addContact.should.have.been.calledOnce;
                sipManager.addContact.should.have.been.calledWithExactly( uri, credentials.user, true );

                sipManager._saveContacts.should.have.been.calledOnce;

                should.exist(result);
                result.should.be.true;
            } );

            it( 'should fail if creating quiddity fails', function () {
                switcherController.quiddityManager.create.returns(null);

                var result = sipManager.login( credentials );

                should.not.exist( sipManager.uri );

                should.exist( config.sip.port );
                config.sip.port.should.equal( credentials.port );

                switcher.has_quiddity.should.have.been.calledOnce;
                switcher.has_quiddity.should.have.been.calledWithExactly( config.sip.quiddName );

                switcherController.quiddityManager.create.should.have.been.calledOnce;
                switcherController.quiddityManager.create.should.have.been.calledWithExactly( 'sip', config.sip.quiddName );

                switcherController.quiddityManager.setPropertyValue.should.not.have.been.called;
                switcherController.quiddityManager.invokeMethod.should.not.have.been.called;
                sipManager.addContact.should.not.have.been.called;
                sipManager._saveContacts.should.not.have.been.called;

                should.exist(result);
                result.should.be.false;
            } );

            it( 'should fail if setting sip port fails', function () {
                switcherController.quiddityManager.setPropertyValue.returns(false);

                var result = sipManager.login( credentials );

                should.not.exist( sipManager.uri );

                should.exist( config.sip.port );
                config.sip.port.should.equal( credentials.port );

                switcher.has_quiddity.should.have.been.calledOnce;
                switcher.has_quiddity.should.have.been.calledWithExactly( config.sip.quiddName );

                switcherController.quiddityManager.create.should.have.been.calledOnce;
                switcherController.quiddityManager.create.should.have.been.calledWithExactly( 'sip', config.sip.quiddName );

                switcherController.quiddityManager.setPropertyValue.should.have.been.calledOnce;
                switcherController.quiddityManager.setPropertyValue.should.have.been.calledWithExactly( config.sip.quiddName, 'port', credentials.port );

                switcherController.quiddityManager.invokeMethod.should.not.have.been.called;
                sipManager.addContact.should.not.have.been.called;
                sipManager._saveContacts.should.not.have.been.called;

                should.exist(result);
                result.should.be.false;
            } );

            it( 'should fail if registering fails', function () {
                switcherController.quiddityManager.invokeMethod.returns(false);

                var result = sipManager.login( credentials );

                should.not.exist( sipManager.uri );

                should.exist( config.sip.port );
                config.sip.port.should.equal( credentials.port );

                switcher.has_quiddity.should.have.been.calledOnce;
                switcher.has_quiddity.should.have.been.calledWithExactly( config.sip.quiddName );

                switcherController.quiddityManager.create.should.have.been.calledOnce;
                switcherController.quiddityManager.create.should.have.been.calledWithExactly( 'sip', config.sip.quiddName );

                switcherController.quiddityManager.setPropertyValue.should.have.been.calledOnce;
                switcherController.quiddityManager.setPropertyValue.should.have.been.calledWithExactly( config.sip.quiddName, 'port', credentials.port );

                switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'register', [uri, credentials.password] );

                sipManager.addContact.should.not.have.been.called;
                sipManager._saveContacts.should.not.have.been.called;

                should.exist(result);
                result.should.be.false;
            } );

        } );

        describe('Logout', function() {

            var uri;

            beforeEach(function() {
                uri = 'some.user@server.com';
                sipManager.uri = uri;
            });

            it('should follow protocol', function() {
                switcher.invoke.returns(true);
                var result = sipManager.logout();
                switcher.invoke.should.have.been.calledOnce;
                switcher.invoke.should.have.been.calledWithExactly( config.sip.quiddName, 'unregister', [] );
                should.exist( result );
                result.should.be.true;
                should.not.exist(sipManager.uri);
            });

            it('should return false and not reset uri if unregister fails', function() {
                switcher.invoke.returns(false);
                var result = sipManager.logout();
                switcher.invoke.should.have.been.calledOnce;
                switcher.invoke.should.have.been.calledWithExactly( config.sip.quiddName, 'unregister', [] );
                should.exist( result );
                result.should.be.false;
                should.exist(sipManager.uri);
                sipManager.uri.should.equal(uri);
            });

        });

    } );

} )
;