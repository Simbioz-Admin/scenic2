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

    before( function ( done ) {
        var i18n = require( '../../src/lib/i18n' );
        i18n.initialize( done );
    } );

    beforeEach( function () {
        switcher                = switcherStub();
        config                  = {};
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
    } );

    afterEach( function () {
        switcher        = null;
        config          = null;
        io              = null;
        quiddityManager = null;
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

            should.exist( quiddityManager.vuMeters );
            quiddityManager.vuMeters.should.be.an( 'array' );

            should.exist( quiddityManager.privateQuiddities );
            quiddityManager.privateQuiddities.should.be.an( 'array' );
        } );

        it( 'should bind to clients', function () {
            var socket = {on: sinon.spy()};

            quiddityManager.bindClient( socket );

            socket.on.callCount.should.equal( 12 );
            socket.on.should.have.been.calledWith( 'getQuiddityClasses' );
            socket.on.should.have.been.calledWith( 'getQuiddities' );
            socket.on.should.have.been.calledWith( 'getInfo' );
            socket.on.should.have.been.calledWith( 'getProperties' );
            socket.on.should.have.been.calledWith( 'getPropertyByClass' );
            socket.on.should.have.been.calledWith( 'getPropertyDescription' );
            socket.on.should.have.been.calledWith( 'setPropertyValue' );
            socket.on.should.have.been.calledWith( 'getMethods' );
            socket.on.should.have.been.calledWith( 'getMethodDescription' );
            socket.on.should.have.been.calledWith( 'invokeMethod' );
            socket.on.should.have.been.calledWith( 'create' );
            socket.on.should.have.been.calledWith( 'remove' );
        } );
    } );

    describe( 'Parsers', function () {

        it( 'should parse classes', function () {
            quiddityManager._parseClass( _.clone( quiddities.audiotestsrc_class ) ).should.eql( quiddities.audiotestsrc_class_parsed );
        } );

        it( 'should parse quiddities', function () {
            quiddityManager._parseQuiddity( _.clone( quiddities.audiotestsrc ) ).should.eql( quiddities.audiotestsrc_parsed );
        } );

        it( 'should parse double property', function () {
            quiddityManager._parseProperty( _.clone( quiddities.property_double ) ).should.eql( quiddities.property_double_parsed );
        } );

        it( 'should parse float property', function () {
            quiddityManager._parseProperty( _.clone( quiddities.property_float ) ).should.eql( quiddities.property_float_parsed );
        } );

        it( 'should parse int property', function () {
            quiddityManager._parseProperty( _.clone( quiddities.property_int ) ).should.eql( quiddities.property_int_parsed );
        } );

        it( 'should parse uint property', function () {
            quiddityManager._parseProperty( _.clone( quiddities.property_uint ) ).should.eql( quiddities.property_uint_parsed );
        } );

        it( 'should parse json string property', function () {
            quiddityManager._parseProperty( _.clone( quiddities.property_string_json ) ).should.eql( quiddities.property_string_json_parsed );
        } );

        it( 'should parse string property', function () {
            quiddityManager._parseProperty( _.clone( quiddities.property_string ) ).should.eql( quiddities.property_string_parsed );
        } );

        it( 'should parse enum property', function () {
            quiddityManager._parseProperty( _.clone( quiddities.property_enum ) ).should.eql( quiddities.property_enum_parsed );
        } );

        it( 'should parse method', function () {
            quiddityManager._parseMethod( _.clone( quiddities.method ) ).should.eql( quiddities.method_parsed );
        } );
    } );

    describe( 'Internals', function () {

        it( 'should register added quiddity correctly', function () {
            var id = 'someId';

            var quiddityClass = quiddityManager._parseQuiddity( _.clone( quiddities.audiotestsrc_class ) );

            switcher.get_quiddity_description.returns( JSON.stringify( _.clone( quiddities.audiotestsrc_class ) ) );
            switcher.get_properties_description.returns( JSON.stringify( _.clone( quiddities.audiotestsrc_properties ) ) );

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

            switcher.subscribe_to_property.callCount.should.eql( quiddities.audiotestsrc_properties.properties.length );
            quiddities.audiotestsrc_properties.properties.forEach( function ( property ) {
                switcher.subscribe_to_property.should.have.been.calledWith( id, property.name );
            } );

            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWith( 'create', quiddityClass );
        } );

        it( 'should stop when registering added private quiddity', function () {
            var id = 'someId';
            switcher.get_quiddity_description.returns( JSON.stringify( _.clone( quiddities.systemusage ) ) );

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
            switcher.get_quiddity_description.returns( JSON.stringify( {error: error} ) );

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

            var removeVuMeters = sinon.stub( quiddityManager, 'removeVuMeters' );

            quiddityManager._onRemoved( id );

            removeVuMeters.should.have.been.calledOnce;
            removeVuMeters.should.have.been.calledWith( id );

            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWith( 'remove', id );
        } );

    } );

    describe( 'Properties', function () {

        it( 'should follow protocol for changed property values', function () {
            var quiddity = 'quidd';
            var property = 'prop';
            var value    = 'val';

            switcher.get_property_description.returns( JSON.stringify( _.clone( quiddities.property_double ) ) );

            quiddityManager.onSwitcherProperty( quiddity, property, value );

            switcher.get_property_description.should.have.been.calledOnce;
            switcher.get_property_description.should.have.been.calledWith( quiddity, property );

            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWith( 'propertyChanged', quiddity, property, quiddities.property_double_parsed.value );
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

            switcher.get_property_description.returns( JSON.stringify( {error: error} ) );

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

    describe( 'Signals', function () {

        it( 'should notify clients and cleanup when quiddity is removed', function () {
            var quiddityRemoveVUMetersStub = sinon.stub( quiddityManager, 'removeVuMeters' );
            quiddityManager.onSwitcherSignal( 'irrelevant', 'on-quiddity-removed', ['anything'] );
            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWith( 'remove', 'anything' );
            quiddityRemoveVUMetersStub.calledOnce;
            quiddityRemoveVUMetersStub.calledWith( 'anything' );
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

            switcher.get_info.returns(JSON.stringify( _.clone( quiddities.shmdata_writer)));

            quiddityManager.onSwitcherSignal( id, signal, [val] );

            switcher.get_info.should.have.been.calledTwice;
            switcher.get_info.should.have.been.calledWith( id, val );
            //Skipped second call, relevant to deprecated vu meters

            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWith( 'addShmdata', id, _.extend( _.clone( quiddities.shmdata_writer), {path: shm, type: type} ) );
        } );

        //TODO: Error cases

        it( 'should add shmdata readers', function () {
            var id     = 'irrelevant';
            var signal = 'on-tree-grafted';
            var type   = 'reader';
            var shm    = 'something';
            var val    = '.shmdata.' + type + '.' + shm;

            switcher.get_info.returns(JSON.stringify( _.clone( quiddities.shmdata_reader)));

            quiddityManager.onSwitcherSignal( id, signal, [val] );

            switcher.get_info.should.have.been.calledOnce;
            switcher.get_info.should.have.been.calledWith( id, val );

            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWith( 'addShmdata', id, _.extend( _.clone( quiddities.shmdata_writer), {path: shm, type: type} ) );
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

} );