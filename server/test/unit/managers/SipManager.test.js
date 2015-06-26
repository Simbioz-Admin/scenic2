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

describe( 'Sip Manager', function () {

    var switcher;
    var io;
    var config;
    var switcherController;
    var sipManager;

    beforeEach( function () {
        io      = {};
        io.emit = sinon.stub();
        config  = {
            sip: {
                quiddName: 'sip-quiddity-name',
                port:      null
            }
        };

        var SipManager = proxyquire( '../../../src/switcher/SipManager', {
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

        var SwitcherController = proxyquire( '../../../src/switcher/SwitcherController', {
            './SipManager': SipManager,
            'switcher':     switcherStub
        } );

        switcherController = new SwitcherController( config, io );
        switcher           = switcherController.switcher;
        sipManager         = switcherController.sipManager;
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

    describe( 'Private Methods', function () {

        describe( 'Loading contacts', function () {
            //TODO
        } );

        describe( 'Saving contacts', function () {
            //TODO
        } );

        describe( 'Reconnect', function () {

            var uri;
            var contacts;

            beforeEach( function () {
                uri      = 'uri1@server.com';
                contacts = [
                    {
                        id:          'uri1@server.com',
                        uri:         'uri1@server.com',
                        name:        'name1',
                        self:        false,
                        send_status: 'calling'
                    },
                    {
                        id:   'uri2@server.com',
                        uri:  'uri2@server.com',
                        name: 'name2',
                        self: false
                    },
                    {
                        id:   'myself@me.com',
                        uri:  'myself@me.com',
                        name: 'myself',
                        self: true
                    }
                ];
                sinon.stub( sipManager, 'getContacts' );
                sipManager.getContacts.returns( contacts );

                sinon.stub( sipManager, 'hangUpContact' );
                sipManager.hangUpContact.returns( true );

                sinon.stub( sipManager, 'callContact' );
                sipManager.callContact.returns( true );
            } );

            it( 'should follow protocol when on call', function () {

                var result = sipManager._reconnect( uri );

                sipManager.getContacts.should.have.been.calledOnce;
                sipManager.getContacts.should.have.been.calledWithExactly();

                sipManager.hangUpContact.should.have.been.calledOnce;
                sipManager.hangUpContact.should.have.been.calledWithExactly( uri );

                sipManager.callContact.should.have.been.calledOnce;
                sipManager.callContact.should.have.been.calledWithExactly( uri );

                should.exist( result );
                result.should.be.true;

            } );

            it( 'should follow protocol when not on call', function () {

                contacts[0].send_status = 'whatever else';

                var result = sipManager._reconnect( uri );

                sipManager.getContacts.should.have.been.calledOnce;
                sipManager.getContacts.should.have.been.calledWithExactly();
                sipManager.hangUpContact.should.not.have.been.called;
                sipManager.callContact.should.not.have.been.called;

                should.exist( result );
                result.should.be.true; // It is not a failure ;)
            } );

            it( 'should fail when no contacts can be found', function () {
                sipManager.getContacts.returns( null );
                var result = sipManager._reconnect( uri );
                sipManager.getContacts.should.have.been.calledOnce;
                sipManager.getContacts.should.have.been.calledWithExactly();
                sipManager.hangUpContact.should.not.have.been.called;
                sipManager.callContact.should.not.have.been.called;
                should.exist( result );
                result.should.be.false;
            } );

            it( 'should fail when no contacts are available', function () {
                sipManager.getContacts.returns( [] );
                var result = sipManager._reconnect( uri );
                sipManager.getContacts.should.have.been.calledOnce;
                sipManager.getContacts.should.have.been.calledWithExactly();
                sipManager.hangUpContact.should.not.have.been.called;
                sipManager.callContact.should.not.have.been.called;
                should.exist( result );
                result.should.be.false;
            } );

            it( 'should fail when contact is not in the list', function () {
                uri        = 'some@other.uri';
                var result = sipManager._reconnect( uri );
                sipManager.getContacts.should.have.been.calledOnce;
                sipManager.getContacts.should.have.been.calledWithExactly();
                sipManager.hangUpContact.should.not.have.been.called;
                sipManager.callContact.should.not.have.been.called;
                should.exist( result );
                result.should.be.false;
            } );

            it( 'should continue and succeed if hanging up failed but calling succeeded', function () {
                sipManager.hangUpContact.returns( false );
                var result = sipManager._reconnect( uri );
                sipManager.getContacts.should.have.been.calledOnce;
                sipManager.getContacts.should.have.been.calledWithExactly();
                sipManager.hangUpContact.should.have.been.calledOnce;
                sipManager.hangUpContact.should.have.been.calledWithExactly( uri );
                sipManager.callContact.should.have.been.calledOnce;
                sipManager.callContact.should.have.been.calledWithExactly( uri );
                should.exist( result );
                result.should.be.true;
            } );

            it( 'should fail if calling failed', function () {
                sipManager.callContact.returns( false );
                var result = sipManager._reconnect( uri );
                sipManager.getContacts.should.have.been.calledOnce;
                sipManager.getContacts.should.have.been.calledWithExactly();
                sipManager.hangUpContact.should.have.been.calledOnce;
                sipManager.hangUpContact.should.have.been.calledWithExactly( uri );
                sipManager.callContact.should.have.been.calledOnce;
                sipManager.callContact.should.have.been.calledWithExactly( uri );
                should.exist( result );
                result.should.be.false;
            } );

            it( 'should fail if both hanging up and calling failed', function () {
                sipManager.hangUpContact.returns( false );
                sipManager.callContact.returns( false );
                var result = sipManager._reconnect( uri );
                sipManager.getContacts.should.have.been.calledOnce;
                sipManager.getContacts.should.have.been.calledWithExactly();
                sipManager.hangUpContact.should.have.been.calledOnce;
                sipManager.hangUpContact.should.have.been.calledWithExactly( uri );
                sipManager.callContact.should.have.been.calledOnce;
                sipManager.callContact.should.have.been.calledWithExactly( uri );
                should.exist( result );
                result.should.be.false;
            } );

        } );

        describe( 'Get Self', function() {

            beforeEach(function() {
                sinon.stub(switcherController.quiddityManager, 'getTreeInfo');
            });

            it('should follow protocol', function() {
                switcherController.quiddityManager.getTreeInfo.returns({ self: 'me@myself.and.i' });
                var result = sipManager._getSelf();
                should.exist(result);
                result.should.equal('me@myself.and.i');
            });

            it('should return null if receiving an empty string', function() {
                switcherController.quiddityManager.getTreeInfo.returns({ self: '' });
                var result = sipManager._getSelf();
                should.not.exist(result);
            });

            it('should return null if self is null', function() {
                switcherController.quiddityManager.getTreeInfo.returns({ self: null });
                var result = sipManager._getSelf();
                should.not.exist(result);
            });

            it('should return null is self is undefined', function() {
                switcherController.quiddityManager.getTreeInfo.returns({  });
                var result = sipManager._getSelf();
                should.not.exist(result);
            });

            it('should return null if tree is not found', function() {
                switcherController.quiddityManager.getTreeInfo.returns(null);
                var result = sipManager._getSelf();
                should.not.exist(result);
            });

        });

    } );

    /*describe( 'Signal Events', function () {

        it( 'should emit contact info when buddy list gets grafted', function () {
            var id     = 'sip-quiddity-name';
            var signal = 'on-tree-grafted';
            var value  = ['.buddies.0.something'];

            switcher.get_info.returns( quiddities.contact() );

            sipManager.onSwitcherSignal( id, signal, value );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( id, '.buddies.0' );

            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWithExactly( 'sip.contact.info', quiddities.contact_parsed() );
        } );

        it( 'should emit contact info when buddy list gets pruned', function () {
            var id     = 'sip-quiddity-name';
            var signal = 'on-tree-pruned';
            var value  = ['.buddies.0.something'];

            switcher.get_info.returns( quiddities.contact() );

            sipManager.onSwitcherSignal( id, signal, value );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( id, '.buddies.0' );

            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWithExactly( 'sip.contact.info', quiddities.contact_parsed() );
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
            var value  = ['.buddies.0.something'];

            sipManager.onSwitcherSignal( id, signal, value );

            switcher.get_info.should.not.have.been.called;
            io.emit.should.not.have.been.called;
        } );

        it( 'should not emit contact info when get info throws', function () {
            var id     = 'sip-quiddity-name';
            var signal = 'on-tree-pruned';
            var value  = ['.buddies.0.something'];
            var error  = 'some error';

            switcher.get_info.throws( error );

            sipManager.onSwitcherSignal( id, signal, value );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( id, '.buddies.0' );

            io.emit.should.not.have.been.called;
        } );

        it( 'should not emit contact info when get info returns error', function () {
            var id     = 'sip-quiddity-name';
            var signal = 'on-tree-pruned';
            var value  = ['.buddies.0.something'];
            var error  = 'some error';

            switcher.get_info.returns( { error: error } );

            sipManager.onSwitcherSignal( id, signal, value );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( id, '.buddies.0' );

            io.emit.should.not.have.been.called;
        } );

        it( 'should not emit contact info when get info returns null', function () {
            var id     = 'sip-quiddity-name';
            var signal = 'on-tree-pruned';
            var value  = ['.buddies.0.something'];

            switcher.get_info.returns( null );

            sipManager.onSwitcherSignal( id, signal, value );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWithExactly( id, '.buddies.0' );

            io.emit.should.not.have.been.called;
        } );

    } );*/

    describe( 'Public Methods', function () {

        describe( 'Contacts', function () {

            var me;
            var uri;
            var name;

            beforeEach( function () {
                uri  = 'contact@server.com';
                name = 'Joe Blow';
                sinon.stub( switcherController.quiddityManager, 'invokeMethod' );
                switcherController.quiddityManager.invokeMethod.returns( true );
                me   = 'myself@me.com';
                sinon.stub( sipManager, '_saveContacts' );
                sinon.stub( sipManager, '_getSelf');
                sipManager._getSelf.returns(me);
            } );

            describe( 'Adding contact', function () {

                it( 'should follow protocol', function () {
                    var result = sipManager.addContact( uri, name );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'add_buddy', [uri] );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'name_buddy', [name, uri] );
                    sipManager._saveContacts.should.have.been.calledOnce;
                    should.exist( result );
                    result.should.be.true;
                    should.exist( sipManager.contacts );
                    should.exist( sipManager.contacts[me] );
                    should.exist( sipManager.contacts[me][uri] );
                    sipManager.contacts[me][uri].should.equal( name );
                } );

                it( 'should follow protocol without a name', function () {
                    var result = sipManager.addContact( uri );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'add_buddy', [uri] );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'name_buddy', [uri, uri] );
                    sipManager._saveContacts.should.have.been.calledOnce;
                    should.exist( result );
                    result.should.be.true;
                    should.exist( sipManager.contacts );
                    should.exist( sipManager.contacts[me] );
                    should.exist( sipManager.contacts[me][uri] );
                    sipManager.contacts[me][uri].should.equal( uri );
                } );

                it( 'should follow protocol without a selfURI', function () {
                    sipManager._getSelf.returns(null);
                    var result = sipManager.addContact( uri, name );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'add_buddy', [uri] );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'name_buddy', [name, uri] );
                    sipManager._saveContacts.should.not.have.been.called;
                    should.exist( result );
                    result.should.be.true;
                    should.exist( sipManager.contacts );
                    should.not.exist(sipManager.contacts[me]);
                } );

                it( 'should not save if we tell it not to', function () {
                    var result = sipManager.addContact( uri, name, true );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'add_buddy', [uri] );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'name_buddy', [name, uri] );
                    sipManager._saveContacts.should.not.have.been.calledOnce;
                    should.exist( result );
                    result.should.be.true;
                } );

                it( 'should return false when adding contact fails', function () {
                    switcherController.quiddityManager.invokeMethod.returns( false );
                    var result = sipManager.addContact( uri, name );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'add_buddy', [uri] );
                    sipManager._saveContacts.should.not.have.been.called;
                    should.exist( result );
                    result.should.be.false;
                } );

                it( 'should return false when naming contact fails', function () {
                    switcherController.quiddityManager.invokeMethod.onFirstCall().returns( true );
                    switcherController.quiddityManager.invokeMethod.onSecondCall().returns( false );
                    var result = sipManager.addContact( uri, name );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'add_buddy', [uri] );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'name_buddy', [name, uri] );
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
                    switcherController.quiddityManager.invokeMethod.reset();
                } );

                it( 'should follow protocol', function () {
                    var result = sipManager.removeContact( uri );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'del_buddy', [uri] );
                    sipManager._saveContacts.should.have.been.calledOnce;
                    should.exist( result );
                    result.should.be.true;
                    should.exist( sipManager.contacts );
                    should.exist( sipManager.contacts[me] );
                    should.not.exist( sipManager.contacts[me][uri] );
                } );

                it( 'should follow protocol without a selfURI', function () {
                    sipManager._getSelf.returns(null);
                    var result = sipManager.removeContact( uri );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'del_buddy', [uri] );
                    sipManager._saveContacts.should.not.have.been.called;
                    should.exist( result );
                    result.should.be.true;
                    should.exist( sipManager.contacts );
                    should.exist( sipManager.contacts[me] );
                    //Unfortunately this case doesn't get to remove the contact
                    should.exist( sipManager.contacts[me][uri] );
                } );

                it( 'should not save when told not to', function () {
                    var result = sipManager.removeContact( uri, true );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'del_buddy', [uri] );
                    sipManager._saveContacts.should.not.have.been.calledOnce;
                    should.exist( result );
                    result.should.be.true;
                    should.exist( sipManager.contacts );
                    should.exist( sipManager.contacts[me] );
                    should.not.exist( sipManager.contacts[me][uri] );
                } );

                it( 'should return error when removing contact fails', function () {
                    switcherController.quiddityManager.invokeMethod.returns( false );
                    var result = sipManager.removeContact( uri );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'del_buddy', [uri] );
                    sipManager._saveContacts.should.have.been.calledOnce;
                    should.exist( result );
                    result.should.be.false;
                } );

            } );

            describe( 'Updating contacts', function () {

                beforeEach( function () {
                    sinon.stub( switcherController.quiddityManager, 'setPropertyValue' );
                    sipManager.addContact( uri, name, true );
                    should.exist( sipManager.contacts );
                    should.exist( sipManager.contacts[me] );
                    should.exist( sipManager.contacts[me][uri] );
                    switcherController.quiddityManager.invokeMethod.reset();
                    switcherController.quiddityManager.invokeMethod.returns( true );
                    switcherController.quiddityManager.setPropertyValue.returns( true );
                } );

                it( 'should follow protocol', function () {
                    var info   = {
                        name:        'new name',
                        status:      'status',
                        status_text: 'message'
                    };
                    var result = sipManager.updateContact( uri, info );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'name_buddy', [info.name, uri] );
                    sipManager._saveContacts.should.have.been.calledOnce;
                    switcherController.quiddityManager.setPropertyValue.should.have.been.calledTwice;
                    switcherController.quiddityManager.setPropertyValue.should.have.been.calledWithExactly( config.sip.quiddName, 'status', info.status.toUpperCase() );
                    switcherController.quiddityManager.setPropertyValue.should.have.been.calledWithExactly( config.sip.quiddName, 'status-note', info.status_text );
                    should.exist( result );
                    result.should.be.true;

                    should.exist( sipManager.contacts );
                    should.exist( sipManager.contacts[me] );
                    should.exist( sipManager.contacts[me][uri] );
                    sipManager.contacts[me][uri].should.equal( info.name );
                } );

                it( 'should follow protocol without a self uri', function () {
                    var info   = {
                        name:        'new name',
                        status:      'status',
                        status_text: 'message'
                    };
                    sipManager._getSelf.returns(null);
                    var result = sipManager.updateContact( uri, info );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'name_buddy', [info.name, uri] );
                    sipManager._saveContacts.should.not.have.been.called;
                    switcherController.quiddityManager.setPropertyValue.should.have.been.calledTwice;
                    switcherController.quiddityManager.setPropertyValue.should.have.been.calledWithExactly( config.sip.quiddName, 'status', info.status.toUpperCase() );
                    switcherController.quiddityManager.setPropertyValue.should.have.been.calledWithExactly( config.sip.quiddName, 'status-note', info.status_text );
                    should.exist( result );
                    result.should.be.true;

                    should.exist( sipManager.contacts );
                    should.exist( sipManager.contacts[me] );
                    should.exist( sipManager.contacts[me][uri] );
                    // Unfortunately this case doesn't get to update the contact list
                    sipManager.contacts[me][uri].should.equal( name );
                } );

                it( 'should follow protocol with only name', function () {
                    var info   = {
                        name: 'new name'
                    };
                    var result = sipManager.updateContact( uri, info );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'name_buddy', [info.name, uri] );
                    sipManager._saveContacts.should.have.been.calledOnce;
                    switcherController.quiddityManager.setPropertyValue.should.not.have.been.called;
                    should.exist( result );
                    result.should.be.true;
                    sipManager.contacts[me][uri].should.equal( info.name );
                } );

                it( 'should follow protocol with only status', function () {
                    var info   = {
                        status: 'status'
                    };
                    var result = sipManager.updateContact( uri, info );
                    switcherController.quiddityManager.invokeMethod.should.not.have.been.called;
                    sipManager._saveContacts.should.not.have.been.called;
                    switcherController.quiddityManager.setPropertyValue.should.have.been.calledOnce;
                    switcherController.quiddityManager.setPropertyValue.should.have.been.calledWithExactly( config.sip.quiddName, 'status', info.status.toUpperCase() );
                    should.exist( result );
                    result.should.be.true;
                    sipManager.contacts[me][uri].should.equal( name );
                } );

                it( 'should follow protocol with only status message', function () {
                    var info   = {
                        status_text: 'message'
                    };
                    var result = sipManager.updateContact( uri, info );
                    switcherController.quiddityManager.invokeMethod.should.not.have.been.called;
                    sipManager._saveContacts.should.not.have.been.called;
                    switcherController.quiddityManager.setPropertyValue.should.have.been.calledOnce;
                    switcherController.quiddityManager.setPropertyValue.should.have.been.calledWithExactly( config.sip.quiddName, 'status-note', info.status_text );
                    should.exist( result );
                    result.should.be.true;
                    sipManager.contacts[me][uri].should.equal( name );
                } );

                it( 'should return false if name change fails', function () {
                    var info   = {
                        name:        'new name',
                        status:      'status',
                        status_text: 'message'
                    };
                    switcherController.quiddityManager.invokeMethod.returns( false );
                    var result = sipManager.updateContact( uri, info );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'name_buddy', [info.name, uri] );
                    sipManager._saveContacts.should.not.have.been.called;
                    should.exist( result );
                    result.should.be.false;
                    sipManager.contacts[me][uri].should.equal( name );
                } );

                it( 'should return false if status change fails', function () {
                    var info   = {
                        name:        'new name',
                        status:      'status',
                        status_text: 'message'
                    };
                    switcherController.quiddityManager.setPropertyValue.onFirstCall().returns( false );
                    var result = sipManager.updateContact( uri, info );
                    switcherController.quiddityManager.setPropertyValue.should.have.been.calledTwice;
                    switcherController.quiddityManager.setPropertyValue.should.have.been.calledWithExactly( config.sip.quiddName, 'status', info.status.toUpperCase() );
                    switcherController.quiddityManager.setPropertyValue.should.have.been.calledWithExactly( config.sip.quiddName, 'status-note', info.status_text );
                    should.exist( result );
                    result.should.be.false;
                } );

                it( 'should return false if status message change fails', function () {
                    var info   = {
                        name:        'new name',
                        status:      'status',
                        status_text: 'message'
                    };
                    switcherController.quiddityManager.setPropertyValue.onSecondCall().returns( false );
                    var result = sipManager.updateContact( uri, info );
                    switcherController.quiddityManager.setPropertyValue.should.have.been.calledTwice;
                    switcherController.quiddityManager.setPropertyValue.should.have.been.calledWithExactly( config.sip.quiddName, 'status', info.status.toUpperCase() );
                    switcherController.quiddityManager.setPropertyValue.should.have.been.calledWithExactly( config.sip.quiddName, 'status-note', info.status_text );
                    should.exist( result );
                    result.should.be.false;
                } );

            } );

            /*describe( 'Getting contact list', function () {

                var contacts;
                var contacts_parsed;

                beforeEach( function () {
                    contacts        = {
                        'uri1@server.com': {
                            uri:  'uri1@server.com',
                            name: 'name1'
                        },
                        'uri2@server.com': {
                            uri:  'uri2@server.com',
                            name: 'name2'
                        },
                        'myself@me.com':   {
                            uri:  'myself@me.com',
                            name: 'myself'
                        }
                    };

                    sinon.stub( switcherController.quiddityManager, 'exists' );
                    sinon.stub( switcherController.quiddityManager, 'getTreeInfo' );
                } );

                it( 'should follow protocol', function () {
                    switcherController.quiddityManager.exists.returns( true );
                    switcherController.quiddityManager.getTreeInfo.returns( contacts );
                    var result = sipManager.getContacts();
                    switcherController.quiddityManager.exists.should.have.been.calledOnce;
                    switcherController.quiddityManager.exists.should.have.been.calledWithExactly( config.sip.quiddName );
                    switcherController.quiddityManager.getTreeInfo.should.have.been.calledOnce;
                    switcherController.quiddityManager.getTreeInfo.should.have.been.calledWithExactly( config.sip.quiddName, '.buddies' );
                    should.exist( result );
                    result.should.eql( contacts_parsed );
                } );

                it( 'should throw when exists throws', function () {
                    switcherController.quiddityManager.exists.throws();
                    expect( sipManager.getContacts.bind( sipManager ) ).to.throw();
                    switcherController.quiddityManager.exists.should.have.been.calledOnce;
                    switcherController.quiddityManager.exists.should.have.been.calledWithExactly( config.sip.quiddName );
                    switcherController.quiddityManager.getTreeInfo.should.not.have.been.called;
                } );

                it( 'should throw when getTreeInfo throws', function () {
                    switcherController.quiddityManager.exists.returns( true );
                    switcherController.quiddityManager.getTreeInfo.throws();
                    expect( sipManager.getContacts.bind( sipManager ) ).to.throw();
                    switcherController.quiddityManager.exists.should.have.been.calledOnce;
                    switcherController.quiddityManager.exists.should.have.been.calledWithExactly( config.sip.quiddName );
                    switcherController.quiddityManager.getTreeInfo.should.have.been.calledOnce;
                    switcherController.quiddityManager.getTreeInfo.should.have.been.calledWithExactly( config.sip.quiddName, '.buddies' );
                } );

                it( 'should return null if quiddity was not found', function () {
                    switcherController.quiddityManager.exists.returns( false );
                    var result = sipManager.getContacts();
                    switcherController.quiddityManager.exists.should.have.been.calledOnce;
                    switcherController.quiddityManager.exists.should.have.been.calledWithExactly( config.sip.quiddName );
                    switcherController.quiddityManager.getTreeInfo.should.not.have.been.calledOnce;
                    should.not.exist( result );
                } );

                it( 'should return null if tree info was not found', function () {
                    switcherController.quiddityManager.exists.returns( true );
                    switcherController.quiddityManager.getTreeInfo.returns( null );
                    var result = sipManager.getContacts();
                    switcherController.quiddityManager.exists.should.have.been.calledOnce;
                    switcherController.quiddityManager.exists.should.have.been.calledWithExactly( config.sip.quiddName );
                    switcherController.quiddityManager.getTreeInfo.should.have.been.calledOnce;
                    switcherController.quiddityManager.getTreeInfo.should.have.been.calledWithExactly( config.sip.quiddName, '.buddies' );
                    should.not.exist( result );
                } );

            } );*/

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

                sinon.stub( switcherController.quiddityManager, 'exists' );
                switcherController.quiddityManager.exists.returns( false );
                sinon.stub( switcherController.quiddityManager, 'create' );
                switcherController.quiddityManager.create.returns( true );
                sinon.stub( switcherController.quiddityManager, 'setPropertyValue' );
                switcherController.quiddityManager.setPropertyValue.returns( true );
                sinon.stub( switcherController.quiddityManager, 'invokeMethod' );
                switcherController.quiddityManager.invokeMethod.returns( true );

                sinon.stub( sipManager, 'addContact' );
                sinon.stub( sipManager, '_saveContacts' );
            } );

            it( 'should follow protocol without a sip quiddity', function () {
                var result = sipManager.login( credentials );

                should.exist( config.sip.port );
                config.sip.port.should.equal( credentials.port );

                switcherController.quiddityManager.exists.should.have.been.calledOnce;
                switcherController.quiddityManager.exists.should.have.been.calledWithExactly( config.sip.quiddName );

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

                should.exist( result );
                result.should.be.true;
            } );

            it( 'should follow protocol with a sip quiddity', function () {
                switcherController.quiddityManager.exists.returns( true );
                var result = sipManager.login( credentials );

                should.exist( config.sip.port );
                config.sip.port.should.equal( credentials.port );

                switcherController.quiddityManager.exists.should.have.been.calledOnce;
                switcherController.quiddityManager.exists.should.have.been.calledWithExactly( config.sip.quiddName );

                switcherController.quiddityManager.create.should.not.have.been.called;

                switcherController.quiddityManager.setPropertyValue.should.have.been.calledOnce;
                switcherController.quiddityManager.setPropertyValue.should.have.been.calledWithExactly( config.sip.quiddName, 'port', credentials.port );

                switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'register', [uri, credentials.password] );

                sipManager.addContact.should.have.been.calledTwice;
                sipManager.addContact.should.have.been.calledWithExactly( uri, credentials.user, true );
                sipManager.addContact.should.have.been.calledWith( 'some@other.contact', 'some other contact', true );

                sipManager._saveContacts.should.have.been.calledOnce;

                should.exist( result );
                result.should.be.true;
            } );

            it( 'should follow protocol without contacts', function () {
                sipManager.contacts = {};
                var result          = sipManager.login( credentials );

                should.exist( config.sip.port );
                config.sip.port.should.equal( credentials.port );

                switcherController.quiddityManager.exists.should.have.been.calledOnce;
                switcherController.quiddityManager.exists.should.have.been.calledWithExactly( config.sip.quiddName );

                switcherController.quiddityManager.create.should.have.been.calledOnce;
                switcherController.quiddityManager.create.should.have.been.calledWithExactly( 'sip', config.sip.quiddName );

                switcherController.quiddityManager.setPropertyValue.should.have.been.calledOnce;
                switcherController.quiddityManager.setPropertyValue.should.have.been.calledWithExactly( config.sip.quiddName, 'port', credentials.port );

                switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'register', [uri, credentials.password] );

                sipManager.addContact.should.have.been.calledOnce;
                sipManager.addContact.should.have.been.calledWithExactly( uri, credentials.user, true );

                sipManager._saveContacts.should.have.been.calledOnce;

                should.exist( result );
                result.should.be.true;
            } );

            it( 'should fail if creating quiddity fails', function () {
                switcherController.quiddityManager.create.returns( null );

                var result = sipManager.login( credentials );

                should.exist( config.sip.port );
                config.sip.port.should.equal( credentials.port );

                switcherController.quiddityManager.exists.should.have.been.calledOnce;
                switcherController.quiddityManager.exists.should.have.been.calledWithExactly( config.sip.quiddName );

                switcherController.quiddityManager.create.should.have.been.calledOnce;
                switcherController.quiddityManager.create.should.have.been.calledWithExactly( 'sip', config.sip.quiddName );

                switcherController.quiddityManager.setPropertyValue.should.not.have.been.called;
                switcherController.quiddityManager.invokeMethod.should.not.have.been.called;
                sipManager.addContact.should.not.have.been.called;
                sipManager._saveContacts.should.not.have.been.called;

                should.exist( result );
                result.should.be.false;
            } );

            it( 'should fail if setting sip port fails', function () {
                switcherController.quiddityManager.setPropertyValue.returns( false );

                var result = sipManager.login( credentials );

                should.exist( config.sip.port );
                config.sip.port.should.equal( credentials.port );

                switcherController.quiddityManager.exists.should.have.been.calledOnce;
                switcherController.quiddityManager.exists.should.have.been.calledWithExactly( config.sip.quiddName );

                switcherController.quiddityManager.create.should.have.been.calledOnce;
                switcherController.quiddityManager.create.should.have.been.calledWithExactly( 'sip', config.sip.quiddName );

                switcherController.quiddityManager.setPropertyValue.should.have.been.calledOnce;
                switcherController.quiddityManager.setPropertyValue.should.have.been.calledWithExactly( config.sip.quiddName, 'port', credentials.port );

                switcherController.quiddityManager.invokeMethod.should.not.have.been.called;
                sipManager.addContact.should.not.have.been.called;
                sipManager._saveContacts.should.not.have.been.called;

                should.exist( result );
                result.should.be.false;
            } );

            it( 'should fail if registering fails', function () {
                switcherController.quiddityManager.invokeMethod.returns( false );

                var result = sipManager.login( credentials );

                should.exist( config.sip.port );
                config.sip.port.should.equal( credentials.port );

                switcherController.quiddityManager.exists.should.have.been.calledOnce;
                switcherController.quiddityManager.exists.should.have.been.calledWithExactly( config.sip.quiddName );

                switcherController.quiddityManager.create.should.have.been.calledOnce;
                switcherController.quiddityManager.create.should.have.been.calledWithExactly( 'sip', config.sip.quiddName );

                switcherController.quiddityManager.setPropertyValue.should.have.been.calledOnce;
                switcherController.quiddityManager.setPropertyValue.should.have.been.calledWithExactly( config.sip.quiddName, 'port', credentials.port );

                switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'register', [uri, credentials.password] );

                sipManager.addContact.should.not.have.been.called;
                sipManager._saveContacts.should.not.have.been.called;

                should.exist( result );
                result.should.be.false;
            } );

        } );

        describe( 'Logout', function () {

            var uri;

            beforeEach( function () {
                uri            = 'some.user@server.com';
                sinon.stub( switcherController.quiddityManager, 'invokeMethod' );
            } );

            it( 'should follow protocol', function () {
                switcherController.quiddityManager.invokeMethod.returns( true );
                var result = sipManager.logout();
                switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'unregister', [] );
                should.exist( result );
                result.should.be.true;
            } );

            it( 'should return false and not reset uri if unregister fails', function () {
                switcherController.quiddityManager.invokeMethod.returns( false );
                var result = sipManager.logout();
                switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'unregister', [] );
                should.exist( result );
                result.should.be.false;
            } );

        } );

        describe( 'Calls', function () {

            var uri;

            beforeEach( function () {
                uri = 'user@server.com';
                sinon.stub( switcherController.quiddityManager, 'invokeMethod' );
            } );

            describe( 'Calling', function () {

                it( 'should follow protocol', function () {
                    switcherController.quiddityManager.invokeMethod.returns( true );
                    var result = sipManager.callContact( uri );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'send', [uri] );
                    should.exist( result );
                    result.should.be.true;
                } );

                it( 'should return false if invoked method returns false', function () {
                    switcherController.quiddityManager.invokeMethod.returns( false );
                    var result = sipManager.callContact( uri );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'send', [uri] );
                    should.exist( result );
                    result.should.be.false;
                } );

            } );

            describe( 'Hanging up', function () {

                it( 'should follow protocol', function () {
                    switcherController.quiddityManager.invokeMethod.returns( true );
                    var result = sipManager.hangUpContact( uri );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'hang-up', [uri] );
                    should.exist( result );
                    result.should.be.true;
                } );

                it( 'should return false if invoked method returns false', function () {
                    switcherController.quiddityManager.invokeMethod.returns( false );
                    var result = sipManager.hangUpContact( uri );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'hang-up', [uri] );
                    should.exist( result );
                    result.should.be.false;
                } );

            } );

            describe( 'Disconnecting', function () {

                var contact;
                var connections;

                beforeEach( function () {
                    uri     = '1002@10.10.30.247';
                    contact = _.findWhere( quiddities.contacts_parsed(), { uri: uri } );
                    should.exist( contact );
                    sinon.stub( sipManager, 'getContacts' );
                    sinon.stub( sipManager, 'hangUpContact' );
                    sinon.stub( sipManager, 'detachShmdataFromContact' );
                } );

                it( 'should follow protocol', function () {
                    sipManager.getContacts.returns( quiddities.contacts_parsed() );
                    sipManager.hangUpContact.returns( true );
                    sipManager.detachShmdataFromContact.returns( true );

                    var result = sipManager.disconnectContact( uri );

                    sipManager.getContacts.should.have.been.calledOnce;
                    sipManager.getContacts.should.have.been.calledWithExactly();

                    sipManager.hangUpContact.should.have.been.calledOnce;
                    sipManager.hangUpContact.should.have.been.calledWithExactly( uri );

                    sipManager.detachShmdataFromContact.callCount.should.equal( contact.connections.length );
                    _.each( contact.connections, function ( path ) {
                        sipManager.detachShmdataFromContact.should.have.been.calledWithExactly( uri, path );
                    }, this );

                    should.exist( result );
                    result.should.be.true;
                } );

                it( 'should follow protocol when a call is not in progress', function () {
                    uri = '1003@10.10.30.247';
                    sipManager.getContacts.returns( quiddities.contacts_parsed() );
                    sipManager.detachShmdataFromContact.returns( true );

                    var result = sipManager.disconnectContact( uri );

                    sipManager.getContacts.should.have.been.calledOnce;
                    sipManager.getContacts.should.have.been.calledWithExactly();

                    sipManager.hangUpContact.should.not.have.been.called;

                    sipManager.detachShmdataFromContact.callCount.should.equal( contact.connections.length );
                    _.each( contact.connections, function ( path ) {
                        sipManager.detachShmdataFromContact.should.have.been.calledWithExactly( uri, path );
                    }, this );

                    should.exist( result );
                    result.should.be.true;
                } );

                it( 'should follow protocol when there is no shmdata to detach', function () {
                    uri = '1005@10.10.30.247';
                    sipManager.getContacts.returns( quiddities.contacts_parsed() );
                    sipManager.hangUpContact.returns( true );

                    var result = sipManager.disconnectContact( uri );

                    sipManager.getContacts.should.have.been.calledOnce;
                    sipManager.getContacts.should.have.been.calledWithExactly();

                    sipManager.hangUpContact.should.have.been.calledOnce;
                    sipManager.hangUpContact.should.have.been.calledWithExactly( uri );

                    sipManager.detachShmdataFromContact.should.not.have.been.called;

                    should.exist( result );
                    result.should.be.true;
                } );

                it( 'should follow protocol when there is no call in progress nor shmdata to detach', function () {
                    uri = '1006@10.10.30.247';
                    sipManager.getContacts.returns( quiddities.contacts_parsed() );

                    var result = sipManager.disconnectContact( uri );

                    sipManager.getContacts.should.have.been.calledOnce;
                    sipManager.getContacts.should.have.been.calledWithExactly();

                    sipManager.hangUpContact.should.not.have.been.calledOnce;
                    sipManager.detachShmdataFromContact.should.not.have.been.called;

                    should.exist( result );
                    result.should.be.true;
                } );

                it( 'should return false if a shmdata fails to detach', function () {
                    sipManager.getContacts.returns( quiddities.contacts_parsed() );
                    sipManager.hangUpContact.returns( true );
                    sipManager.detachShmdataFromContact.returns( true );
                    sipManager.detachShmdataFromContact.onSecondCall().returns( false );

                    var result = sipManager.disconnectContact( uri );

                    sipManager.getContacts.should.have.been.calledOnce;
                    sipManager.getContacts.should.have.been.calledWithExactly();

                    sipManager.hangUpContact.should.have.been.calledOnce;
                    sipManager.hangUpContact.should.have.been.calledWithExactly( uri );

                    sipManager.detachShmdataFromContact.callCount.should.equal( contact.connections.length );
                    _.each( contact.connections, function ( path ) {
                        sipManager.detachShmdataFromContact.should.have.been.calledWithExactly( uri, path );
                    }, this );

                    should.exist( result );
                    result.should.be.false;
                } );

                it( 'should return false if hanging up fails', function () {
                    sipManager.getContacts.returns( quiddities.contacts_parsed() );
                    sipManager.hangUpContact.returns( false );

                    var result = sipManager.disconnectContact( uri );

                    sipManager.getContacts.should.have.been.calledOnce;
                    sipManager.getContacts.should.have.been.calledWithExactly();

                    sipManager.hangUpContact.should.have.been.calledOnce;
                    sipManager.hangUpContact.should.have.been.calledWithExactly( uri );

                    sipManager.detachShmdataFromContact.should.not.have.been.called;

                    should.exist( result );
                    result.should.be.false;
                } );

                it( 'should return false if contact is not found', function () {
                    uri = 'not@in.the.list';
                    sipManager.getContacts.returns( quiddities.contacts_parsed() );

                    var result = sipManager.disconnectContact( uri );

                    sipManager.getContacts.should.have.been.calledOnce;
                    sipManager.getContacts.should.have.been.calledWithExactly();

                    sipManager.hangUpContact.should.not.have.been.called;
                    sipManager.detachShmdataFromContact.should.not.have.been.called;

                    should.exist( result );
                    result.should.be.false;
                } );

                it( 'should return false if contacts are not found', function () {
                    uri = 'not@in.the.list';
                    sipManager.getContacts.returns( null );

                    var result = sipManager.disconnectContact( uri );

                    sipManager.getContacts.should.have.been.calledOnce;
                    sipManager.getContacts.should.have.been.calledWithExactly();

                    sipManager.hangUpContact.should.not.have.been.called;
                    sipManager.detachShmdataFromContact.should.not.have.been.called;

                    should.exist( result );
                    result.should.be.false;
                } );

            } );

        } );

        describe( 'Shmdatas', function () {

            var uri;
            var path;

            beforeEach( function () {
                uri  = 'user@server.com';
                path = '/tmp/some_shmdata';
                sinon.stub( switcherController.quiddityManager, 'invokeMethod' );
                sinon.stub( sipManager, '_reconnect' );
            } );

            describe( 'Attaching', function () {

                it( 'should follow protocol', function () {
                    switcherController.quiddityManager.invokeMethod.returns( true );
                    sipManager._reconnect.returns( true );
                    var result = sipManager.attachShmdataToContact( uri, path );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'attach_shmdata_to_contact', [path, uri, 'true'] );
                    sipManager._reconnect.should.have.been.calledOnce;
                    sipManager._reconnect.should.have.been.calledWithExactly( uri );
                    should.exist( result );
                    result.should.be.true;
                } );

                it( 'should return false when attaching fails', function () {
                    switcherController.quiddityManager.invokeMethod.returns( false );
                    sipManager._reconnect.returns( true );
                    var result = sipManager.attachShmdataToContact( uri, path );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'attach_shmdata_to_contact', [path, uri, 'true'] );
                    sipManager._reconnect.should.not.have.been.called;
                    should.exist( result );
                    result.should.be.false;
                } );

                it( 'should return false when reconnecting fails', function () {
                    switcherController.quiddityManager.invokeMethod.returns( true );
                    sipManager._reconnect.returns( false );
                    var result = sipManager.attachShmdataToContact( uri, path );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'attach_shmdata_to_contact', [path, uri, 'true'] );
                    sipManager._reconnect.should.have.been.calledOnce;
                    sipManager._reconnect.should.have.been.calledWithExactly( uri );
                    should.exist( result );
                    result.should.be.false;
                } );

            } );

            describe( 'Detaching', function () {

                it( 'should follow protocol', function () {
                    switcherController.quiddityManager.invokeMethod.returns( true );
                    sipManager._reconnect.returns( true );
                    var result = sipManager.detachShmdataFromContact( uri, path );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'attach_shmdata_to_contact', [path, uri, 'false'] );
                    sipManager._reconnect.should.have.been.calledOnce;
                    sipManager._reconnect.should.have.been.calledWithExactly( uri );
                    should.exist( result );
                    result.should.be.true;
                } );

                it( 'should return false when detaching fails', function () {
                    switcherController.quiddityManager.invokeMethod.returns( false );
                    sipManager._reconnect.returns( true );
                    var result = sipManager.detachShmdataFromContact( uri, path );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'attach_shmdata_to_contact', [path, uri, 'false'] );
                    sipManager._reconnect.should.not.have.been.called;
                    should.exist( result );
                    result.should.be.false;
                } );

                it( 'should return false when reconnecting fails', function () {
                    switcherController.quiddityManager.invokeMethod.returns( true );
                    sipManager._reconnect.returns( false );
                    var result = sipManager.detachShmdataFromContact( uri, path );
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
                    switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( config.sip.quiddName, 'attach_shmdata_to_contact', [path, uri, 'false'] );
                    sipManager._reconnect.should.have.been.calledOnce;
                    sipManager._reconnect.should.have.been.calledWithExactly( uri );
                    should.exist( result );
                    result.should.be.false;
                } );

            } );

        } );

    } );

} )
;