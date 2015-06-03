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

describe( 'Quiddity Manager', function () {

    var switcher;
    var config;
    var io;
    var quiddityManager;
    var cb;

    before( function ( done ) {
        var i18n = require( '../../src/lib/i18n' );
        i18n.initialize( done );
    } );

    beforeEach( function () {
        switcher                = new switcherStub.Switcher();
        config                  = {
            systemUsage: {
                quiddName: 'systemusage'
            }
        };
        io                      = {};
        io.emit                 = sinon.spy();
        var QuiddityManager     = proxyquire( '../../src/switcher/QuiddityManager', {
            'switcher':         switcher,
            '../lib/logger':    logStub(),
            '../utils/logback': function ( e, c ) {
                c( e );
            }
        } );
        quiddityManager         = new QuiddityManager( config, switcher, io );
        quiddityManager.logback = sinon.stub();
        quiddityManager.logback.yields();
        cb                      = sinon.stub();
    } );

    afterEach( function () {
        switcher        = null;
        config          = null;
        io              = null;
        quiddityManager = null;
        cb              = null;
    } );

    // Hey, dummy test to get started
    it( 'should exist', function () {
        should.exist( quiddityManager );
    } );

    describe( 'Initialization', function () {

        it( 'should have been instanciated correctly', function () {
            should.exist( quiddityManager.config );
            quiddityManager.config.should.equal( config );

            should.exist( quiddityManager.switcher );
            quiddityManager.switcher.should.equal( switcher );

            should.exist( quiddityManager.io );
            quiddityManager.io.should.equal( io );

            should.exist( quiddityManager.quidditySocketMap );
            quiddityManager.quidditySocketMap.should.be.an( 'object' );

            should.exist( quiddityManager.privateQuiddities );
            quiddityManager.privateQuiddities.should.be.an( 'array' );


            should.exist( quiddityManager.shmdataTypes );
            quiddityManager.shmdataTypes.should.be.an( 'array' );
        } );

        it( 'should bind to clients', function () {
            var socket = {on: sinon.spy()};

            quiddityManager.bindClient( socket );

            socket.on.callCount.should.equal( 11 );
            socket.on.should.have.been.calledWith( 'create' );
            socket.on.should.have.been.calledWith( 'remove' );
            socket.on.should.have.been.calledWith( 'getQuiddityClasses' );
            socket.on.should.have.been.calledWith( 'getQuiddities' );
            socket.on.should.have.been.calledWith( 'getTreeInfo' );
            socket.on.should.have.been.calledWith( 'getProperties' );
            socket.on.should.have.been.calledWith( 'getPropertyDescription' );
            socket.on.should.have.been.calledWith( 'setPropertyValue' );
            socket.on.should.have.been.calledWith( 'getMethods' );
            socket.on.should.have.been.calledWith( 'getMethodDescription' );
            socket.on.should.have.been.calledWith( 'invokeMethod' );
        } );
    } );

    describe( 'Parsers', function () {

        it( 'should parse classes', function () {
            quiddityManager._parseClass( quiddities.class() ).should.eql( quiddities.class_parsed() );
        } );

        it( 'should parse quiddities', function () {
            quiddityManager._parseQuiddity( quiddities.quiddity() ).should.eql( quiddities.quiddity_parsed() );
        } );

        it( 'should parse boolean property', function () {
            quiddityManager._parseProperty( quiddities.property_bool() ).should.eql( quiddities.property_bool_parsed() );
        } );

        it( 'should parse double property', function () {
            quiddityManager._parseProperty( quiddities.property_double() ).should.eql( quiddities.property_double_parsed() );
        } );

        it( 'should parse float property', function () {
            quiddityManager._parseProperty( quiddities.property_float() ).should.eql( quiddities.property_float_parsed() );
        } );

        it( 'should parse int property', function () {
            quiddityManager._parseProperty( quiddities.property_int() ).should.eql( quiddities.property_int_parsed() );
        } );

        it( 'should parse uint property', function () {
            quiddityManager._parseProperty( quiddities.property_uint() ).should.eql( quiddities.property_uint_parsed() );
        } );

        it( 'should parse json string property', function () {
            quiddityManager._parseProperty( quiddities.property_string_json() ).should.eql( quiddities.property_string_json_parsed() );
        } );

        it( 'should parse string property', function () {
            quiddityManager._parseProperty( quiddities.property_string() ).should.eql( quiddities.property_string_parsed() );
        } );

        it( 'should parse enum property', function () {
            quiddityManager._parseProperty( quiddities.property_enum() ).should.eql( quiddities.property_enum_parsed() );
        } );

        it( 'should parse method', function () {
            quiddityManager._parseMethod( quiddities.method() ).should.eql( quiddities.method_parsed() );
        } );
    } );

    describe( 'Internals', function () {

        it( 'should register added quiddity correctly', function () {
            var id = 'someId';

            var quiddityClass = quiddityManager._parseQuiddity( quiddities.class() );

            switcher.get_quiddity_description.returns( quiddities.class() );
            switcher.get_properties_description.returns( quiddities.properties() );

            quiddityManager._onAdded( id );

            switcher.get_quiddity_description.should.have.been.calledOnce;
            switcher.get_quiddity_description.should.have.been.calledWith( id );

            switcher.subscribe_to_signal.callCount.should.equal( 6 );
            switcher.subscribe_to_signal.should.have.been.calledWith( id, 'on-property-added' );
            switcher.subscribe_to_signal.should.have.been.calledWith( id, 'on-property-removed' );
            switcher.subscribe_to_signal.should.have.been.calledWith( id, 'on-method-added' );
            switcher.subscribe_to_signal.should.have.been.calledWith( id, 'on-method-removed' );
            switcher.subscribe_to_signal.should.have.been.calledWith( id, 'on-tree-grafted' );
            switcher.subscribe_to_signal.should.have.been.calledWith( id, 'on-tree-pruned' );

            switcher.get_properties_description.should.have.been.calledOnce;
            switcher.get_properties_description.should.have.been.calledWith( id );

            switcher.subscribe_to_property.callCount.should.eql( quiddities.properties().properties.length );
            quiddities.properties().properties.forEach( function ( property ) {
                switcher.subscribe_to_property.should.have.been.calledWith( id, property.name );
            } );

            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWith( 'create', quiddityClass );
        } );

        it( 'should stop when registering added private quiddity', function () {
            var id = 'someId';
            switcher.get_quiddity_description.returns( quiddities.quiddity_private() );

            quiddityManager._onAdded( id );

            switcher.get_quiddity_description.should.have.been.calledOnce;
            switcher.get_quiddity_description.should.have.been.calledWith( id );

            switcher.get_properties_description.should.not.have.been.called;
            switcher.subscribe_to_signal.should.not.have.been.called;
            switcher.subscribe_to_property.should.not.have.been.called;
            io.emit.should.not.have.been.called;
        } );

        it( 'should stop when registering added quiddity throws', function () {
            var error = 'some error';
            switcher.get_quiddity_description.throws( error );

            quiddityManager._onAdded( 0 );

            switcher.get_quiddity_description.should.have.been.calledOnce;
            switcher.get_quiddity_description.should.have.been.calledWith( 0 );

            switcher.get_properties_description.should.not.have.been.called;
            switcher.subscribe_to_signal.should.not.have.been.called;
            switcher.subscribe_to_property.should.not.have.been.called;
            io.emit.should.not.have.been.called;
        } );

        it( 'should stop when registering added quiddity returns error', function () {
            var error = 'some error';
            switcher.get_quiddity_description.returns( {error: error} );

            quiddityManager._onAdded( 0 );

            switcher.get_quiddity_description.should.have.been.calledOnce;
            switcher.get_quiddity_description.should.have.been.calledWith( 0 );

            switcher.get_properties_description.should.not.have.been.called;
            switcher.subscribe_to_signal.should.not.have.been.called;
            switcher.subscribe_to_property.should.not.have.been.called;
            io.emit.should.not.have.been.called;
        } );

        it( 'should stop when registering added quiddity returns null', function () {
            var error = 'some error';
            switcher.get_quiddity_description.returns( null );

            quiddityManager._onAdded( 0 );

            switcher.get_quiddity_description.should.have.been.calledOnce;
            switcher.get_quiddity_description.should.have.been.calledWith( 0 );

            switcher.get_properties_description.should.not.have.been.called;
            switcher.subscribe_to_signal.should.not.have.been.called;
            switcher.subscribe_to_property.should.not.have.been.called;
            io.emit.should.not.have.been.called;
        } );

        it( 'should cleanup when quiddity is removed', function () {
            var id = 'someId';

            quiddityManager._onRemoved( id );

            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWith( 'remove', id );
        } );

    } );

    describe( 'Properties Events', function () {

        it( 'should follow protocol for changed property values', function () {
            var quiddity = 'quidd';
            var property = 'prop';
            var value    = 'val';

            switcher.get_property_description.returns( quiddities.property_double() );

            quiddityManager.onSwitcherProperty( quiddity, property, value );

            switcher.get_property_description.should.have.been.calledOnce;
            switcher.get_property_description.should.have.been.calledWith( quiddity, property );

            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWith( 'propertyChanged', quiddity, property, quiddities.property_double_parsed().value );
        } );

        it( 'should bail for changed property when throwing', function () {
            var quiddity = 'quidd';
            var property = 'prop';
            var value    = 'val';
            var error    = 'some error';

            switcher.get_property_description.throws( error );

            quiddityManager.onSwitcherProperty( quiddity, property, value );

            switcher.get_property_description.should.have.been.calledOnce;
            switcher.get_property_description.should.have.been.calledWith( quiddity, property );

            io.emit.should.not.have.been.called;
        } );

        it( 'should bail for changed property when returning error', function () {
            var quiddity = 'quidd';
            var property = 'prop';
            var value    = 'val';
            var error    = 'some error';

            switcher.get_property_description.returns( {error: error} );

            quiddityManager.onSwitcherProperty( quiddity, property, value );

            switcher.get_property_description.should.have.been.calledOnce;
            switcher.get_property_description.should.have.been.calledWith( quiddity, property );

            io.emit.should.not.have.been.called;
        } );

        it( 'should bail for changed property when returning null', function () {
            var quiddity = 'quidd';
            var property = 'prop';
            var value    = 'val';
            var error    = 'some error';

            switcher.get_property_description.returns( null );

            quiddityManager.onSwitcherProperty( quiddity, property, value );

            switcher.get_property_description.should.have.been.calledOnce;
            switcher.get_property_description.should.have.been.calledWith( quiddity, property );

            io.emit.should.not.have.been.called;
        } );

        it( 'should bail for changed property when returning garbage', function () {
            var quiddity = 'quidd';
            var property = 'prop';
            var value    = 'val';
            var error    = 'some error';

            switcher.get_property_description.returns( 'salkjhflak' );

            quiddityManager.onSwitcherProperty( quiddity, property, value );

            switcher.get_property_description.should.have.been.calledOnce;
            switcher.get_property_description.should.have.been.calledWith( quiddity, property );

            io.emit.should.not.have.been.called;
        } );
    } );

    describe( 'Signals Events', function () {

        it( 'should notify clients and cleanup when quiddity is removed', function () {
            quiddityManager.onSwitcherSignal( 'irrelevant', 'on-quiddity-removed', ['anything'] );
            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWith( 'remove', 'anything' );
        } );

        it( 'should internally add quiddity on quiddity created', function () {
            var id      = 'quiddity';
            var onAdded = sinon.stub( quiddityManager, '_onAdded' );
            quiddityManager.onSwitcherSignal( 'irrelevant', 'on-quiddity-created', [id] );
            onAdded.should.have.been.calledOnce;
            onAdded.should.have.been.calledWith( id );
        } );

        it( 'should internally remove quiddity on quiddity removed', function () {
            var id        = 'quiddity';
            var onRemoved = sinon.stub( quiddityManager, '_onRemoved' );
            quiddityManager.onSwitcherSignal( 'irrelevant', 'on-quiddity-removed', [id] );
            onRemoved.should.have.been.calledOnce;
            onRemoved.should.have.been.calledWith( id );
        } );

        it( 'should subscribe to property when property is added', function () {
            quiddityManager.onSwitcherSignal( 'irrelevant', 'on-property-added', ['anything'] );
            switcher.subscribe_to_property.should.have.been.calledOnce;
            switcher.subscribe_to_property.should.have.been.calledWith( 'irrelevant', 'anything' );
        } );

        it( 'should pass along property added to clients', function () {
            var id     = 'quiddity';
            var signal = 'on-property-added';
            var val    = 'smtng';
            quiddityManager.onSwitcherSignal( id, signal, [val] );
            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWith( 'onSignal', id, signal, val );
        } );

        it( 'should pass along property removed to clients', function () {
            var id     = 'quiddity';
            var signal = 'on-property-removed';
            var val    = 'smtng';
            quiddityManager.onSwitcherSignal( id, signal, [val] );
            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWith( 'onSignal', id, signal, val );
        } );

        it( 'should pass along method added to clients', function () {
            var id     = 'quiddity';
            var signal = 'on-method-added';
            var val    = 'smtng';
            quiddityManager.onSwitcherSignal( id, signal, [val] );
            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWith( 'onSignal', id, signal, val );
        } );

        it( 'should pass along method removed to clients', function () {
            var id     = 'quiddity';
            var signal = 'on-method-removed';
            var val    = 'smtng';
            quiddityManager.onSwitcherSignal( id, signal, [val] );
            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWith( 'onSignal', id, signal, val );
        } );

        it( 'should not pass along garbage to clients', function () {
            var id     = 'quiddity';
            var signal = 'some-fake-signal';
            var val    = 'smtng';
            quiddityManager.onSwitcherSignal( id, signal, [val] );
            io.emit.should.not.have.been.called;
        } );

        it( 'should pass along system usage grafts', function () {
            var id     = 'systemusage';
            var signal = 'on-tree-grafted';
            var val    = 'smtng';
            var ret    = 'sysinfo';
            switcher.get_info.returns( ret );
            quiddityManager.onSwitcherSignal( id, signal, [val] );
            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWith( id, val );
            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWith( 'systemusage', ret );
        } );

        it( 'should not pass along system usage prunes', function () {
            var id     = 'systemusage';
            var signal = 'on-tree-pruned';
            var val    = 'smtng';
            quiddityManager.onSwitcherSignal( id, signal, [val] );
            io.emit.should.not.have.been.called;
        } );

        it( 'should add shmdata writers', function () {
            var id     = 'irrelevant';
            var signal = 'on-tree-grafted';
            var type   = 'writer';
            var shm    = 'something';
            var val    = '.shmdata.' + type + '.' + shm;

            switcher.get_info.returns( quiddities.shmdata_writer() );

            quiddityManager.onSwitcherSignal( id, signal, [val] );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWith( id, val );
            //Skipped second call, relevant to deprecated vu meters

            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWith( 'addShmdata', id, _.extend( quiddities.shmdata_writer(), {
                path: shm,
                type: type
            } ) );
        } );

        it( 'should not add shmdata writers when it throws', function () {
            var id     = 'irrelevant';
            var signal = 'on-tree-grafted';
            var type   = 'writer';
            var shm    = 'something';
            var val    = '.shmdata.' + type + '.' + shm;
            var error  = 'some error';

            switcher.get_info.throws( error );

            quiddityManager.onSwitcherSignal( id, signal, [val] );

            switcher.get_info.should.have.been.calledOnce;
            io.emit.should.not.have.been.called;
        } );

        it( 'should not add shmdata writers when it returns null', function () {
            var id     = 'irrelevant';
            var signal = 'on-tree-grafted';
            var type   = 'writer';
            var shm    = 'something';
            var val    = '.shmdata.' + type + '.' + shm;

            switcher.get_info.returns( null );

            quiddityManager.onSwitcherSignal( id, signal, [val] );

            switcher.get_info.should.have.been.calledOnce;
            io.emit.should.not.have.been.called;
        } );

        it( 'should not add shmdata writers when it returns an error', function () {
            var id     = 'irrelevant';
            var signal = 'on-tree-grafted';
            var type   = 'writer';
            var shm    = 'something';
            var val    = '.shmdata.' + type + '.' + shm;
            var error  = 'some error';

            switcher.get_info.returns( {error: error} );

            quiddityManager.onSwitcherSignal( id, signal, [val] );

            switcher.get_info.should.have.been.calledOnce;
            io.emit.should.not.have.been.called;
        } );

        it( 'should not add shmdata writers when it returns garbage', function () {
            var id     = 'irrelevant';
            var signal = 'on-tree-grafted';
            var type   = 'writer';
            var shm    = 'something';
            var val    = '.shmdata.' + type + '.' + shm;

            switcher.get_info.returns( 'pouet' );

            quiddityManager.onSwitcherSignal( id, signal, [val] );

            switcher.get_info.should.have.been.calledOnce;
            io.emit.should.not.have.been.called;
        } );

        it( 'should add shmdata readers', function () {
            var id     = 'irrelevant';
            var signal = 'on-tree-grafted';
            var type   = 'reader';
            var shm    = 'something';
            var val    = '.shmdata.' + type + '.' + shm;

            switcher.get_info.returns( quiddities.shmdata_reader() );

            quiddityManager.onSwitcherSignal( id, signal, [val] );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWith( id, val );

            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWith( 'addShmdata', id, _.extend( quiddities.shmdata_writer(), {
                path: shm,
                type: type
            } ) );
        } );

        it( 'should not add shmdata readers when it throws', function () {
            var id     = 'irrelevant';
            var signal = 'on-tree-grafted';
            var type   = 'reader';
            var shm    = 'something';
            var val    = '.shmdata.' + type + '.' + shm;
            var error  = 'some error';

            switcher.get_info.throws( error );

            quiddityManager.onSwitcherSignal( id, signal, [val] );

            switcher.get_info.should.have.been.calledOnce;
            io.emit.should.not.have.been.called;
        } );

        it( 'should not add shmdata readers when it returns null', function () {
            var id     = 'irrelevant';
            var signal = 'on-tree-grafted';
            var type   = 'reader';
            var shm    = 'something';
            var val    = '.shmdata.' + type + '.' + shm;

            switcher.get_info.returns( null );

            quiddityManager.onSwitcherSignal( id, signal, [val] );

            switcher.get_info.should.have.been.calledOnce;
            io.emit.should.not.have.been.called;
        } );

        it( 'should not add shmdata readers when it returns an error', function () {
            var id     = 'irrelevant';
            var signal = 'on-tree-grafted';
            var type   = 'reader';
            var shm    = 'something';
            var val    = '.shmdata.' + type + '.' + shm;
            var error  = 'some error';

            switcher.get_info.returns( {error: error} );

            quiddityManager.onSwitcherSignal( id, signal, [val] );

            switcher.get_info.should.have.been.calledOnce;
            io.emit.should.not.have.been.called;
        } );

        it( 'should not add shmdata readers when it returns garbage', function () {
            var id     = 'irrelevant';
            var signal = 'on-tree-grafted';
            var type   = 'reader';
            var shm    = 'something';
            var val    = '.shmdata.' + type + '.' + shm;

            switcher.get_info.returns( 'pouet' );

            quiddityManager.onSwitcherSignal( id, signal, [val] );

            switcher.get_info.should.have.been.calledOnce;
            io.emit.should.not.have.been.called;
        } );
        //TODO: Error cases

        it( 'should remove shmdata writers', function () {
            var id     = 'irrelevant';
            var signal = 'on-tree-pruned';
            var type   = 'writer';
            var shm    = 'something';
            var val    = '.shmdata.' + type + '.' + shm;
            quiddityManager.onSwitcherSignal( id, signal, [val] );
            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWith( 'removeShmdata', id, {path: shm, type: type} );
        } );

        it( 'should not remove when no shmdata writers 1', function () {
            var id     = 'irrelevant';
            var signal = 'on-tree-pruned';
            var type   = 'writer';
            var shm    = '';
            var val    = '.shmdata.' + type + '.' + shm;
            quiddityManager.onSwitcherSignal( id, signal, [val] );
            io.emit.should.not.have.been.called;
        } );

        it( 'should not remove when no shmdata writers 2', function () {
            var id     = 'irrelevant';
            var signal = 'on-tree-pruned';
            var type   = 'something';
            var shm    = 'else';
            var val    = '.shmdata.' + type + '.' + shm;
            quiddityManager.onSwitcherSignal( id, signal, [val] );
            io.emit.should.not.have.been.called;
        } );

        it( 'should remove shmdata readers', function () {
            var id     = 'irrelevant';
            var signal = 'on-tree-pruned';
            var type   = 'reader';
            var shm    = 'something';
            var val    = '.shmdata.' + type + '.' + shm;
            quiddityManager.onSwitcherSignal( id, signal, [val] );
            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWith( 'removeShmdata', id, {path: shm, type: type} );
        } );

        it( 'should not remove when no shmdata readers 1', function () {
            var id     = 'irrelevant';
            var signal = 'on-tree-pruned';
            var type   = 'reader';
            var shm    = '';
            var val    = '.shmdata.' + type + '.' + shm;
            quiddityManager.onSwitcherSignal( id, signal, [val] );
            io.emit.should.not.have.been.called;
        } );

        it( 'should not remove when no shmdata readers 2', function () {
            var id     = 'irrelevant';
            var signal = 'on-tree-pruned';
            var type   = 'something';
            var shm    = 'else';
            var val    = '.shmdata.' + type + '.' + shm;
            quiddityManager.onSwitcherSignal( id, signal, [val] );
            io.emit.should.not.have.been.called;
        } );
    } );

    describe( 'Client Socket Callbacks', function () {

        describe( 'Quiddity Classes', function () {

            it( 'should follow protocol', function () {

                // Make a list of parsed public classes, _parseClass is already tested so trust it
                var public_classes = _.clone( quiddities.classes_doc_public() ).classes;
                _.each( public_classes, quiddityManager._parseClass, quiddityManager );

                switcher.get_classes_doc.returns( quiddities.classes_doc() );

                quiddityManager.getQuiddityClasses( cb );

                switcher.get_classes_doc.should.have.been.calledOnce;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWith( null, public_classes );
            } );

            it( 'should follow protocol with empty classes', function () {

                switcher.get_classes_doc.returns( {classes: []}  );

                quiddityManager.getQuiddityClasses( cb );

                switcher.get_classes_doc.should.have.been.calledOnce;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWith( null, [] );
            } );

            it( 'should return error when switcher throws', function () {
                var error = 'some error';

                switcher.get_classes_doc.throws( error );

                quiddityManager.getQuiddityClasses( cb );

                switcher.get_classes_doc.should.have.been.calledOnce;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
            } );

            it( 'should return error when switcher returns error', function () {
                var error = 'some error';

                switcher.get_classes_doc.returns( {error: error} );

                quiddityManager.getQuiddityClasses( cb );

                switcher.get_classes_doc.should.have.been.calledOnce;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
            } );

            it( 'should return error when switcher returns null', function () {

                switcher.get_classes_doc.returns( null );

                quiddityManager.getQuiddityClasses( cb );

                switcher.get_classes_doc.should.have.been.calledOnce;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' ); //Assume a string...
            } );

            it( 'should return error when switcher returns null classes', function () {

                switcher.get_classes_doc.returns( {classes: null} );

                quiddityManager.getQuiddityClasses( cb );

                switcher.get_classes_doc.should.have.been.calledOnce;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' ); //Assume a string...
            } );

            it( 'should return error when switcher returns garbage classes 1', function () {

                switcher.get_classes_doc.returns(  {classes: 'not an array'} );

                quiddityManager.getQuiddityClasses( cb );

                switcher.get_classes_doc.should.have.been.calledOnce;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' ); //Assume a string...
            } );

            it( 'should return error when switcher returns garbage classes 2', function () {

                switcher.get_classes_doc.returns(  {classes: {not: 'an array'}} );

                quiddityManager.getQuiddityClasses( cb );

                switcher.get_classes_doc.should.have.been.calledOnce;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' ); //Assume a string...
            } );

            it( 'should return error when switcher returns without classes', function () {

                switcher.get_classes_doc.returns(  {} );

                quiddityManager.getQuiddityClasses( cb );

                switcher.get_classes_doc.should.have.been.calledOnce;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' ); //Assume a string...
            } );

        } );

        describe( 'Quiddities', function () {

            it( 'should follow protocol', function () {

                // Make a list of parsed public quiddities, _parseQuiddity is already tested so trust it
                var public_quiddities = _.clone( quiddities.quiddities_public() ).quiddities;
                _.each( public_quiddities, quiddityManager._parseQuiddity, quiddityManager );

                switcher.get_quiddities_description.returns(  quiddities.quiddities() );

                quiddityManager.getQuiddities( cb );

                switcher.get_quiddities_description.should.have.been.calledOnce;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWith( null, public_quiddities );
            } );

            it( 'should follow protocol with empty quiddities', function () {

                switcher.get_quiddities_description.returns(  {quiddities: []} );

                quiddityManager.getQuiddities( cb );

                switcher.get_quiddities_description.should.have.been.calledOnce;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWith( null, [] );
            } );

            it( 'should return error when switcher throws', function () {
                var error = 'some error';

                switcher.get_quiddities_description.throws( error );

                quiddityManager.getQuiddities( cb );

                switcher.get_quiddities_description.should.have.been.calledOnce;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
            } );

            it( 'should return error when switcher returns error', function () {
                var error = 'some error';

                switcher.get_quiddities_description.returns(  {error: error} );

                quiddityManager.getQuiddities( cb );

                switcher.get_quiddities_description.should.have.been.calledOnce;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
            } );

            it( 'should return error when switcher returns null', function () {

                switcher.get_quiddities_description.returns( null );

                quiddityManager.getQuiddities( cb );

                switcher.get_quiddities_description.should.have.been.calledOnce;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' ); //Assume a string...
            } );

            it( 'should return error when switcher returns null classes', function () {

                switcher.get_quiddities_description.returns(  {quiddities: null} );

                quiddityManager.getQuiddities( cb );

                switcher.get_quiddities_description.should.have.been.calledOnce;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' ); //Assume a string...
            } );

            it( 'should return error when switcher returns garbage quiddities 1', function () {

                switcher.get_quiddities_description.returns(  {quiddities: 'not an array'} );

                quiddityManager.getQuiddities( cb );

                switcher.get_quiddities_description.should.have.been.calledOnce;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' ); //Assume a string...
            } );

            it( 'should return error when switcher returns garbage quiddities 2', function () {

                switcher.get_quiddities_description.returns(  {quiddities: {not: 'an array'}} );

                quiddityManager.getQuiddities( cb );

                switcher.get_quiddities_description.should.have.been.calledOnce;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' ); //Assume a string...
            } );

            it( 'should return error when switcher returns without quiddities', function () {

                switcher.get_quiddities_description.returns(  {} );

                quiddityManager.getQuiddities( cb );

                switcher.get_quiddities_description.should.have.been.calledOnce;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' ); //Assume a string...
            } );

        } );

        describe( 'Tree', function () {

            it( 'should follow protocol', function () {
                var id   = 'someId';
                var path = '.some.path';

                switcher.get_info.returns(  quiddities.tree() );

                quiddityManager.getTreeInfo( id, path, cb );

                switcher.get_info.should.have.been.calledOnce;
                switcher.get_info.should.have.been.calledWith( id, path );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWith( null, quiddities.tree() );
            } );

            it( 'should follow protocol with empty tree', function () {
                var id   = 'someId';
                var path = '.some.path';

                switcher.get_info.returns(  {} );

                quiddityManager.getTreeInfo( id, path, cb );

                switcher.get_info.should.have.been.calledOnce;
                switcher.get_info.should.have.been.calledWith( id, path );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWith( null, {} );
            } );

            it( 'should return error when switcher throws', function () {
                var id    = 'someId';
                var path  = '.some.path';
                var error = 'some error';

                switcher.get_info.throws( error );

                quiddityManager.getTreeInfo( id, path, cb );

                switcher.get_info.should.have.been.calledOnce;
                switcher.get_info.should.have.been.calledWith( id, path );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
            } );

            it( 'should return error when switcher returns error', function () {
                var id    = 'someId';
                var path  = '.some.path';
                var error = 'some error';

                switcher.get_info.returns(  {error: error} );

                quiddityManager.getTreeInfo( id, path, cb );

                switcher.get_info.should.have.been.calledOnce;
                switcher.get_info.should.have.been.calledWith( id, path );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
            } );

            it( 'should return null when switcher returns null', function () {
                var id   = 'someId';
                var path = '.some.path';

                switcher.get_info.returns( null );

                quiddityManager.getTreeInfo( id, path, cb );

                switcher.get_info.should.have.been.calledOnce;
                switcher.get_info.should.have.been.calledWith( id, path );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithExactly( null, null ); // Assume any string
            } );

            it( 'should return error when switcher des not return an object', function () {
                var id   = 'someId';
                var path = '.some.path';

                switcher.get_info.returns( 'null' );

                quiddityManager.getTreeInfo( id, path, cb );

                switcher.get_info.should.have.been.calledOnce;
                switcher.get_info.should.have.been.calledWith( id, path );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' ); // Assume any string
            } );

            it( 'should return error when switcher returns garbage', function () {
                var id   = 'someId';
                var path = '.some.path';

                switcher.get_info.returns( 'this is not an object' );

                quiddityManager.getTreeInfo( id, path, cb );

                switcher.get_info.should.have.been.calledOnce;
                switcher.get_info.should.have.been.calledWith( id, path );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' ); // Assume any string
            } );

        } );

        describe( 'Properties', function () {

            it( 'should follow protocol', function () {
                var id = 'someId';

                // Make a list of parsed public quiddities, _parseProperty is already tested so trust it
                var properties = _.clone( quiddities.properties() ).properties;
                _.each( properties, quiddityManager._parseProperty, quiddityManager );

                switcher.get_properties_description.returns(  quiddities.properties() );

                quiddityManager.getProperties( id, cb );

                switcher.get_properties_description.should.have.been.calledOnce;
                switcher.get_properties_description.should.have.been.calledWith( id );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWith( null, properties );
            } );

            it( 'should follow protocol with empty properties', function () {
                var id = 'someId';

                switcher.get_properties_description.returns(  {properties: []} );

                quiddityManager.getProperties( id, cb );

                switcher.get_properties_description.should.have.been.calledOnce;
                switcher.get_properties_description.should.have.been.calledWith( id );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWith( null, [] );
            } );

            it( 'should return error when switcher throws', function () {
                var id    = 'someId';
                var error = 'some error';

                switcher.get_properties_description.throws( error );

                quiddityManager.getProperties( id, cb );

                switcher.get_properties_description.should.have.been.calledOnce;
                switcher.get_properties_description.should.have.been.calledWith( id );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
            } );

            it( 'should return error when switcher returns error', function () {
                var id    = 'someId';
                var error = 'some error';

                switcher.get_properties_description.returns(  {error: error} );

                quiddityManager.getProperties( id, cb );

                switcher.get_properties_description.should.have.been.calledOnce;
                switcher.get_properties_description.should.have.been.calledWith( id );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
            } );

            it( 'should return error when switcher returns null', function () {
                var id = 'someId';

                switcher.get_properties_description.returns( null );

                quiddityManager.getProperties( id, cb );

                switcher.get_properties_description.should.have.been.calledOnce;
                switcher.get_properties_description.should.have.been.calledWith( id );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when switcher returns null properties', function () {
                var id = 'someId';

                switcher.get_properties_description.returns(  {properties: null} );

                quiddityManager.getProperties( id, cb );

                switcher.get_properties_description.should.have.been.calledOnce;
                switcher.get_properties_description.should.have.been.calledWith( id );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when switcher returns garbage properties 1', function () {
                var id = 'someId';

                switcher.get_properties_description.returns(  {properties: 'not an array'} );

                quiddityManager.getProperties( id, cb );

                switcher.get_properties_description.should.have.been.calledOnce;
                switcher.get_properties_description.should.have.been.calledWith( id );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when switcher returns garbage properties 2', function () {
                var id = 'someId';

                switcher.get_properties_description.returns(  {properties: {not: 'an array'}} );

                quiddityManager.getProperties( id, cb );

                switcher.get_properties_description.should.have.been.calledOnce;
                switcher.get_properties_description.should.have.been.calledWith( id );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when switcher returns without properties', function () {
                var id = 'someId';

                switcher.get_properties_description.returns(  {} );

                quiddityManager.getProperties( id, cb );

                switcher.get_properties_description.should.have.been.calledOnce;
                switcher.get_properties_description.should.have.been.calledWith( id );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

        } );

        describe( 'Getting Property', function () {

            it( 'should follow protocol', function () {
                var id       = 'someId';
                var property = 'prop';

                switcher.get_property_description.returns(  quiddities.property_double() );

                quiddityManager.getPropertyDescription( id, property, cb );

                switcher.get_property_description.should.have.been.calledOnce;
                switcher.get_property_description.should.have.been.calledWith( id, property );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWith( null, quiddities.property_double_parsed() );
            } );

            it( 'should return error with empty property', function () {
                var id       = 'someId';
                var property = 'prop';

                switcher.get_property_description.returns(  {} );

                quiddityManager.getPropertyDescription( id, property, cb );

                switcher.get_property_description.should.have.been.calledOnce;
                switcher.get_property_description.should.have.been.calledWith( id, property );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when switcher throws', function () {
                var error    = 'some error';
                var id       = 'someId';
                var property = 'prop';

                switcher.get_property_description.throws( error );

                quiddityManager.getPropertyDescription( id, property, cb );

                switcher.get_property_description.should.have.been.calledOnce;
                switcher.get_property_description.should.have.been.calledWith( id, property );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
            } );

            it( 'should return error when switcher returns error', function () {
                var error    = 'some error';
                var id       = 'someId';
                var property = 'prop';

                switcher.get_property_description.returns(  {error: error} );

                quiddityManager.getPropertyDescription( id, property, cb );

                switcher.get_property_description.should.have.been.calledOnce;
                switcher.get_property_description.should.have.been.calledWith( id, property );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
            } );

            it( 'should return error when switcher returns null', function () {
                var id       = 'someId';
                var property = 'prop';

                switcher.get_property_description.returns( null );

                quiddityManager.getPropertyDescription( id, property, cb );

                switcher.get_property_description.should.have.been.calledOnce;
                switcher.get_property_description.should.have.been.calledWith( id, property );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when switcher returns garbage property 1', function () {
                var id       = 'someId';
                var property = 'prop';

                switcher.get_property_description.returns( 'not a property' );

                quiddityManager.getPropertyDescription( id, property, cb );

                switcher.get_property_description.should.have.been.calledOnce;
                switcher.get_property_description.should.have.been.calledWith( id, property );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when switcher returns garbage property 2', function () {
                var id       = 'someId';
                var property = 'prop';

                switcher.get_property_description.returns(  [{not: 'a property'}] );

                quiddityManager.getPropertyDescription( id, property, cb );

                switcher.get_property_description.should.have.been.calledOnce;
                switcher.get_property_description.should.have.been.calledWith( id, property );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

        } );

        describe( 'Setting Property', function () {

            it( 'should follow protocol', function () {
                var id       = 'someId';
                var property = 'prop';
                var value    = 'val';

                switcher.set_property_value.returns( true );

                quiddityManager.setPropertyValue( id, property, value, cb );

                switcher.set_property_value.should.have.been.calledOnce;
                switcher.set_property_value.should.have.been.calledWith( id, property, String( value ) );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithExactly();
            } );

            it( 'should return error when missing quiddity', function () {
                var id       = null;
                var property = 'prop';
                var value    = 'val';

                quiddityManager.setPropertyValue( id, property, value, cb );

                switcher.set_property_value.should.not.have.been.called;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when missing property', function () {
                var id       = 'someId';
                var property = null;
                var value    = 'val';

                quiddityManager.setPropertyValue( id, property, value, cb );

                switcher.set_property_value.should.not.have.been.called;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when missing value', function () {
                var id       = 'someId';
                var property = 'prop';
                var value    = null;

                quiddityManager.setPropertyValue( id, property, value, cb );

                switcher.set_property_value.should.not.have.been.called;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when switcher throws', function () {
                var error    = 'some error';
                var id       = 'someId';
                var property = 'prop';
                var value    = 'val';

                switcher.set_property_value.throws( error );

                quiddityManager.setPropertyValue( id, property, value, cb );

                switcher.set_property_value.should.have.been.calledOnce;
                switcher.set_property_value.should.have.been.calledWith( id, property, String( value ) );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
            } );

            it( 'should return error when switcher returns false', function () {
                var error    = 'some error';
                var id       = 'someId';
                var property = 'prop';
                var value    = 'val';

                switcher.set_property_value.returns( false );

                quiddityManager.setPropertyValue( id, property, value, cb );

                switcher.set_property_value.should.have.been.calledOnce;
                switcher.set_property_value.should.have.been.calledWith( id, property, String( value ) );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

        } );

        describe( 'Methods', function () {

            it( 'should follow protocol', function () {
                var id = 'someId';

                // Make a list of parsed public quiddities, _parseMethod is already tested so trust it
                var methods = _.clone( quiddities.methods() ).methods;
                _.each( methods, quiddityManager._parseMethod, quiddityManager );

                switcher.get_methods_description.returns(  quiddities.methods() );

                quiddityManager.getMethods( id, cb );

                switcher.get_methods_description.should.have.been.calledOnce;
                switcher.get_methods_description.should.have.been.calledWith( id );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWith( null, methods );
            } );

            it( 'should follow protocol with empty methods', function () {
                var id = 'someId';

                switcher.get_methods_description.returns(  {methods: []} );

                quiddityManager.getMethods( id, cb );

                switcher.get_methods_description.should.have.been.calledOnce;
                switcher.get_methods_description.should.have.been.calledWith( id );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWith( null, [] );
            } );

            it( 'should return error when switcher throws', function () {
                var id    = 'someId';
                var error = 'some error';

                switcher.get_methods_description.throws( error );

                quiddityManager.getMethods( id, cb );

                switcher.get_methods_description.should.have.been.calledOnce;
                switcher.get_methods_description.should.have.been.calledWith( id );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
            } );

            it( 'should return error when switcher returns error', function () {
                var id    = 'someId';
                var error = 'some error';

                switcher.get_methods_description.returns(  {error: error} );

                quiddityManager.getMethods( id, cb );

                switcher.get_methods_description.should.have.been.calledOnce;
                switcher.get_methods_description.should.have.been.calledWith( id );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
            } );

            it( 'should return error when switcher returns null', function () {
                var id = 'someId';

                switcher.get_methods_description.returns( null );

                quiddityManager.getMethods( id, cb );

                switcher.get_methods_description.should.have.been.calledOnce;
                switcher.get_methods_description.should.have.been.calledWith( id );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when switcher returns null methods', function () {
                var id = 'someId';

                switcher.get_methods_description.returns(  {methods: null} );

                quiddityManager.getMethods( id, cb );

                switcher.get_methods_description.should.have.been.calledOnce;
                switcher.get_methods_description.should.have.been.calledWith( id );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when switcher returns garbage methods 1', function () {
                var id = 'someId';

                switcher.get_methods_description.returns(  {methods: 'not an array'} );

                quiddityManager.getMethods( id, cb );

                switcher.get_methods_description.should.have.been.calledOnce;
                switcher.get_methods_description.should.have.been.calledWith( id );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when switcher returns garbage methods 2', function () {
                var id = 'someId';

                switcher.get_methods_description.returns(  {methods: {not: 'an array'}} );

                quiddityManager.getMethods( id, cb );

                switcher.get_methods_description.should.have.been.calledOnce;
                switcher.get_methods_description.should.have.been.calledWith( id );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when switcher returns without methods', function () {
                var id = 'someId';

                switcher.get_methods_description.returns(  {} );

                quiddityManager.getMethods( id, cb );

                switcher.get_methods_description.should.have.been.calledOnce;
                switcher.get_methods_description.should.have.been.calledWith( id );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

        } );

        describe( 'Getting Method', function () {

            it( 'should follow protocol', function () {
                var id     = 'someId';
                var method = 'prop';

                switcher.get_method_description.returns(  quiddities.method() );

                quiddityManager.getMethodDescription( id, method, cb );

                switcher.get_method_description.should.have.been.calledOnce;
                switcher.get_method_description.should.have.been.calledWith( id, method );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWith( null, quiddities.method_parsed() );
            } );

            it( 'should return error with empty method', function () {
                var id     = 'someId';
                var method = 'prop';

                switcher.get_method_description.returns(  {} );

                quiddityManager.getMethodDescription( id, method, cb );

                switcher.get_method_description.should.have.been.calledOnce;
                switcher.get_method_description.should.have.been.calledWith( id, method );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when switcher throws', function () {
                var error  = 'some error';
                var id     = 'someId';
                var method = 'prop';

                switcher.get_method_description.throws( error );

                quiddityManager.getMethodDescription( id, method, cb );

                switcher.get_method_description.should.have.been.calledOnce;
                switcher.get_method_description.should.have.been.calledWith( id, method );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
            } );

            it( 'should return error when switcher returns error', function () {
                var error  = 'some error';
                var id     = 'someId';
                var method = 'prop';

                switcher.get_method_description.returns(  {error: error} );

                quiddityManager.getMethodDescription( id, method, cb );

                switcher.get_method_description.should.have.been.calledOnce;
                switcher.get_method_description.should.have.been.calledWith( id, method );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
            } );

            it( 'should return error when switcher returns null', function () {
                var id     = 'someId';
                var method = 'prop';

                switcher.get_method_description.returns( null );

                quiddityManager.getMethodDescription( id, method, cb );

                switcher.get_method_description.should.have.been.calledOnce;
                switcher.get_method_description.should.have.been.calledWith( id, method );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when switcher returns garbage method 1', function () {
                var id     = 'someId';
                var method = 'prop';

                switcher.get_method_description.returns( 'not a method' );

                quiddityManager.getMethodDescription( id, method, cb );

                switcher.get_method_description.should.have.been.calledOnce;
                switcher.get_method_description.should.have.been.calledWith( id, method );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when switcher returns garbage method 2', function () {
                var id     = 'someId';
                var method = 'prop';

                switcher.get_method_description.returns(  [{not: 'a method'}] );

                quiddityManager.getMethodDescription( id, method, cb );

                switcher.get_method_description.should.have.been.calledOnce;
                switcher.get_method_description.should.have.been.calledWith( id, method );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

        } );

        describe( 'Invoking Method', function () {

            it( 'should follow protocol', function () {
                var id     = 'someId';
                var method = 'prop';
                var args   = ['arg1', 'arg2'];

                switcher.invoke.returns( true );

                quiddityManager.invokeMethod( id, method, args, cb );

                switcher.invoke.should.have.been.calledOnce;
                switcher.invoke.should.have.been.calledWith( id, method, args );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWith( null, true );
            } );

            it( 'should return error when missing quiddity', function () {
                var id     = null;
                var method = 'prop';
                var args   = ['arg1', 'arg2'];

                switcher.invoke.returns( true );

                quiddityManager.invokeMethod( id, method, args, cb );

                switcher.invoke.should.not.have.been.called;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when missing method', function () {
                var id     = 'someId';
                var method = null;
                var args   = ['arg1', 'arg2'];

                switcher.invoke.returns( true );

                quiddityManager.invokeMethod( id, method, args, cb );

                switcher.invoke.should.not.have.been.called;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when missing arguments', function () {
                var id     = 'someId';
                var method = 'prop';
                var args   = null;

                switcher.invoke.returns( true );

                quiddityManager.invokeMethod( id, method, args, cb );

                switcher.invoke.should.not.have.been.called;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when arguments is not an array', function () {
                var id     = 'someId';
                var method = 'prop';
                var args   = {not: 'an array'};

                switcher.invoke.returns( true );

                quiddityManager.invokeMethod( id, method, args, cb );

                switcher.invoke.should.not.have.been.called;
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when switcher throws', function () {
                var id     = 'someId';
                var method = 'prop';
                var args   = ['arg1', 'arg2'];
                var error  = 'some error';

                switcher.invoke.throws( error );

                quiddityManager.invokeMethod( id, method, args, cb );

                switcher.invoke.should.have.been.calledOnce;
                switcher.invoke.should.have.been.calledWith( id, method, args );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
            } );

            it( 'should return error when switcher returns null', function () {
                var id     = 'someId';
                var method = 'prop';
                var args   = ['arg1', 'arg2'];

                switcher.invoke.returns( null );

                quiddityManager.invokeMethod( id, method, args, cb );

                switcher.invoke.should.have.been.calledOnce;
                switcher.invoke.should.have.been.calledWith( id, method, args );
                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            //TODO: Cover other cases when return values are better defined

        } );

        describe( 'Creating Quiddities', function () {

            it( 'should follow protocol', function () {
                var type     = 'some type';
                var name     = 'some name';
                var socketId = 'some socket id';

                switcher.create.returns( name );
                switcher.get_quiddity_description.returns(  quiddities.quiddity() );

                quiddityManager.create( type, name, socketId, cb );

                switcher.create.should.have.been.calledOnce;
                switcher.create.should.have.been.calledWithExactly( type, name );

                switcher.get_quiddity_description.should.have.been.calledOnce;
                switcher.get_quiddity_description.should.have.been.calledWithExactly( name );

                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithExactly( null, quiddities.quiddity_parsed() );
            } );

            it( 'should follow protocol without a name', function () {
                var type     = 'some type';
                var name     = 'some name';
                var socketId = 'some socket id';

                switcher.create.returns( name );
                switcher.get_quiddity_description.returns(  quiddities.quiddity() );

                quiddityManager.create( type, null, socketId, cb );

                switcher.create.should.have.been.calledOnce;
                switcher.create.should.have.been.calledWithExactly( type );

                switcher.get_quiddity_description.should.have.been.calledOnce;
                switcher.get_quiddity_description.should.have.been.calledWithExactly( name );

                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithExactly( null, quiddities.quiddity_parsed() );
            } );

            it( 'should follow protocol with an empty name', function () {
                var type     = 'some type';
                var name     = 'some name';
                var socketId = 'some socket id';

                switcher.create.returns( name );
                switcher.get_quiddity_description.returns(  quiddities.quiddity() );

                quiddityManager.create( type, '', socketId, cb );

                switcher.create.should.have.been.calledOnce;
                switcher.create.should.have.been.calledWithExactly( type );

                switcher.get_quiddity_description.should.have.been.calledOnce;
                switcher.get_quiddity_description.should.have.been.calledWithExactly( name );

                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithExactly( null, quiddities.quiddity_parsed() );
            } );

            it( 'should return error when switcher throws at create', function () {
                var type     = 'some type';
                var name     = 'some name';
                var socketId = 'some socket id';
                var error    = 'some error';

                switcher.create.throws( error );

                quiddityManager.create( type, name, socketId, cb );

                switcher.create.should.have.been.calledOnce;
                switcher.create.should.have.been.calledWithExactly( type, name );

                switcher.get_quiddity_description.should.not.have.been.called;

                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
            } );

            it( 'should return error when switcher returns null at create', function () {
                var type     = 'some type';
                var name     = 'some name';
                var socketId = 'some socket id';
                var error    = 'some error';

                switcher.create.returns( null );

                quiddityManager.create( type, name, socketId, cb );

                switcher.create.should.have.been.calledOnce;
                switcher.create.should.have.been.calledWithExactly( type, name );

                switcher.get_quiddity_description.should.not.have.been.called;

                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when switcher throws at quiddity description', function () {
                var type     = 'some type';
                var name     = 'some name';
                var socketId = 'some socket id';
                var error    = 'some error';

                switcher.create.returns( name );
                switcher.get_quiddity_description.throws( error );

                quiddityManager.create( type, name, socketId, cb );

                switcher.create.should.have.been.calledOnce;
                switcher.create.should.have.been.calledWithExactly( type, name );

                switcher.get_quiddity_description.should.have.been.calledOnce;
                switcher.get_quiddity_description.should.have.been.calledWithExactly( name );

                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithExactly( error );
            } );

            it( 'should return error when switcher returns error at quiddity description', function () {
                var type     = 'some type';
                var name     = 'some name';
                var socketId = 'some socket id';
                var error    = 'some error';

                switcher.create.returns( name );
                switcher.get_quiddity_description.returns(  {error: error} );

                quiddityManager.create( type, name, socketId, cb );

                switcher.create.should.have.been.calledOnce;
                switcher.create.should.have.been.calledWithExactly( type, name );

                switcher.get_quiddity_description.should.have.been.calledOnce;
                switcher.get_quiddity_description.should.have.been.calledWithExactly( name );

                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
            } );

            it( 'should return error when switcher returns null at quiddity description', function () {
                var type     = 'some type';
                var name     = 'some name';
                var socketId = 'some socket id';

                switcher.create.returns( name );
                switcher.get_quiddity_description.returns( null );

                quiddityManager.create( type, name, socketId, cb );

                switcher.create.should.have.been.calledOnce;
                switcher.create.should.have.been.calledWithExactly( type, name );

                switcher.get_quiddity_description.should.have.been.calledOnce;
                switcher.get_quiddity_description.should.have.been.calledWithExactly( name );

                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );

            it( 'should return error when switcher returns garbage at quiddity description', function () {
                var type     = 'some type';
                var name     = 'some name';
                var socketId = 'some socket id';

                switcher.create.returns( name );
                switcher.get_quiddity_description.returns( 'pouet' );

                quiddityManager.create( type, name, socketId, cb );

                switcher.create.should.have.been.calledOnce;
                switcher.create.should.have.been.calledWithExactly( type, name );

                switcher.get_quiddity_description.should.have.been.calledOnce;
                switcher.get_quiddity_description.should.have.been.calledWithExactly( name );

                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );
        } );

        describe( 'Removeing Quiddities', function () {

            it( 'should follow protocol', function () {
                var id = 'someId';

                switcher.remove.returns( true );

                quiddityManager.remove( id, cb );

                switcher.remove.should.have.been.calledOnce;
                switcher.remove.should.have.been.calledWithExactly( id );

                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithExactly();
            } );

            it( 'should return error when switcher throws', function () {
                var id    = 'someId';
                var error = 'some error';

                switcher.remove.throws( error );

                quiddityManager.remove( id, cb );

                switcher.remove.should.have.been.calledOnce;
                switcher.remove.should.have.been.calledWithExactly( id );

                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( error );
            } );

            it( 'should return error when switcher returns false', function () {
                var id = 'someId';

                switcher.remove.returns( false );

                quiddityManager.remove( id, cb );

                switcher.remove.should.have.been.calledOnce;
                switcher.remove.should.have.been.calledWithExactly( id );

                cb.should.have.been.calledOnce;
                cb.should.have.been.calledWithMatch( '' );
            } );
        } );
    } )

} );