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

describe( 'Quiddity Manager', function () {

    var switcher;
    var config;
    var io;
    var switcherController;
    var quiddityManager;

    beforeEach( function () {
        switcher                = new switcherStub.Switcher();
        config                  = {
            systemUsage: {
                quiddName: 'systemusage'
            }
        };
        io                      = {};
        io.emit                 = sinon.spy();

        switcherController = {
            switcher: switcher,
            config:   config,
            io:       io
        };

        var QuiddityManager     = proxyquire( '../../../src/switcher/QuiddityManager', {
            'switcher':         switcher,
            '../lib/logger':    logStub()
        } );
        quiddityManager         = new QuiddityManager( switcherController );
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

            should.exist( quiddityManager.privateQuiddities );
            quiddityManager.privateQuiddities.should.be.an( 'array' );


            should.exist( quiddityManager.shmdataTypes );
            quiddityManager.shmdataTypes.should.be.an( 'array' );
        } );

    } );

    describe( 'Parsers', function () {

        it( 'should parse shmdatas', function () {
            quiddityManager._parseShmdata( quiddities.shmdata_writer() ).should.eql( quiddities.shmdata_writer_parsed() );
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

            switcher.get_quiddity_description.returns( quiddities.class() );
            switcher.get_properties_description.returns( quiddities.properties() );

            quiddityManager._onCreated( id );

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
            io.emit.should.have.been.calledWith( 'create', quiddities.class() );
        } );

        it( 'should stop when registering added private quiddity', function () {
            var id = 'someId';
            switcher.get_quiddity_description.returns( quiddities.quiddity_private() );

            quiddityManager._onCreated( id );

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

            quiddityManager._onCreated( 0 );

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

            quiddityManager._onCreated( 0 );

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

            quiddityManager._onCreated( 0 );

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
            var onAdded = sinon.stub( quiddityManager, '_onCreated' );
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
            io.emit.should.have.been.calledWith( 'updateShmdata', id, _.extend( quiddities.shmdata_writer_parsed(), {
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
            io.emit.should.have.been.calledWith( 'updateShmdata', id, _.extend( quiddities.shmdata_reader(), {
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

    describe( 'Methods', function () {

        describe( 'Quiddity Classes', function () {

            it( 'should follow protocol', function () {
                switcher.get_classes_doc.returns( quiddities.classes_doc() );
                var result         = quiddityManager.getQuiddityClasses();
                switcher.get_classes_doc.should.have.been.calledOnce;
                should.exist( result );
                result.should.eql( quiddities.classes_doc_public().classes );
            } );

            it( 'should follow protocol with empty classes', function () {
                switcher.get_classes_doc.returns( {classes: []} );
                var result = quiddityManager.getQuiddityClasses();
                switcher.get_classes_doc.should.have.been.calledOnce;
                should.exist( result );
                result.should.eql( [] );
            } );

            it( 'should throw error when switcher throws', function () {
                var error = 'some error';
                switcher.get_classes_doc.throws( new Error( error ) );
                expect( quiddityManager.getQuiddityClasses.bind( quiddityManager ) ).to.throw( error );
                switcher.get_classes_doc.should.have.been.calledOnce;
            } );

            it( 'should throw error when switcher returns error', function () {
                var error = 'some error';
                switcher.get_classes_doc.returns( {error: error} );
                expect( quiddityManager.getQuiddityClasses.bind( quiddityManager ) ).to.throw( error );
                switcher.get_classes_doc.should.have.been.calledOnce;
            } );

            it( 'should return empty array when switcher returns null', function () {
                switcher.get_classes_doc.returns( null );
                var result = quiddityManager.getQuiddityClasses();
                switcher.get_classes_doc.should.have.been.calledOnce;
                should.exist( result );
                result.should.eql( [] );
            } );

            it( 'should return empty array when switcher returns null classes', function () {
                switcher.get_classes_doc.returns( {classes: null} );
                var result = quiddityManager.getQuiddityClasses();
                switcher.get_classes_doc.should.have.been.calledOnce;
                should.exist( result );
                result.should.eql( [] );
            } );

            it( 'should return emptu array when switcher returns garbage classes 1', function () {
                switcher.get_classes_doc.returns( {classes: 'not an array'} );
                var result = quiddityManager.getQuiddityClasses();
                switcher.get_classes_doc.should.have.been.calledOnce;
                should.exist( result );
                result.should.eql( [] );
            } );

            it( 'should return empty array when switcher returns garbage classes 2', function () {
                switcher.get_classes_doc.returns( {classes: {not: 'an array'}} );
                var result = quiddityManager.getQuiddityClasses();
                switcher.get_classes_doc.should.have.been.calledOnce;
                should.exist( result );
                result.should.eql( [] );
            } );

            it( 'should return empty array when switcher returns without classes', function () {
                switcher.get_classes_doc.returns( {} );
                var result = quiddityManager.getQuiddityClasses();
                switcher.get_classes_doc.should.have.been.calledOnce;
                should.exist( result );
                result.should.eql( [] );
            } );

        } );

        describe( 'Quiddities', function () {

            it( 'should follow protocol', function () {
                switcher.get_quiddities_description.returns( quiddities.quiddities() );
                var result            = quiddityManager.getQuiddities();
                switcher.get_quiddities_description.should.have.been.calledOnce;
                should.exist( result );
                result.should.eql( quiddities.quiddities_public().quiddities );
            } );

            it( 'should follow protocol with empty quiddities', function () {
                switcher.get_quiddities_description.returns( {quiddities: []} );
                var result = quiddityManager.getQuiddities();
                switcher.get_quiddities_description.should.have.been.calledOnce;
                should.exist( result );
                result.should.eql( [] );
            } );

            it( 'should throw error when switcher throws', function () {
                var error = 'some error';
                switcher.get_quiddities_description.throws( new Error( error ) );
                expect( quiddityManager.getQuiddities.bind( quiddityManager ) ).to.throw( error );
                switcher.get_quiddities_description.should.have.been.calledOnce;
            } );

            it( 'should throw error when switcher returns error', function () {
                var error = 'some error';
                switcher.get_quiddities_description.returns( {error: error} );
                expect( quiddityManager.getQuiddities.bind( quiddityManager ) ).to.throw( error );
                switcher.get_quiddities_description.should.have.been.calledOnce;
            } );

            it( 'should return empty array when switcher returns null', function () {
                switcher.get_quiddities_description.returns( null );
                var result = quiddityManager.getQuiddities();
                switcher.get_quiddities_description.should.have.been.calledOnce;
                should.exist( result );
                result.should.eql( [] );
            } );

            it( 'should return empty array when switcher returns null quiddities', function () {
                switcher.get_quiddities_description.returns( {quiddities: null} );
                var result = quiddityManager.getQuiddities();
                switcher.get_quiddities_description.should.have.been.calledOnce;
                should.exist( result );
                result.should.eql( [] );
            } );

            it( 'should return empty array when switcher returns garbage quiddities 1', function () {
                switcher.get_quiddities_description.returns( {quiddities: 'not an array'} );
                var result = quiddityManager.getQuiddities();
                switcher.get_quiddities_description.should.have.been.calledOnce;
                should.exist( result );
                result.should.eql( [] );
            } );

            it( 'should return empty array when switcher returns garbage quiddities 2', function () {
                switcher.get_quiddities_description.returns( {quiddities: {not: 'an array'}} );
                var result = quiddityManager.getQuiddities();
                switcher.get_quiddities_description.should.have.been.calledOnce;
                should.exist( result );
                result.should.eql( [] );
            } );

            it( 'should return empty array when switcher returns without quiddities', function () {
                switcher.get_quiddities_description.returns( {} );
                var result = quiddityManager.getQuiddities();
                switcher.get_quiddities_description.should.have.been.calledOnce;
                should.exist( result );
                result.should.eql( [] );
            } );

        } );

        describe( 'Quiddity Description', function () {

            it( 'should follow protocol', function () {
                var id       = 'someId';
                switcher.get_quiddity_description.returns( quiddities.quiddity() );
                var result   = quiddityManager.getQuiddityDescription( id );
                switcher.get_quiddity_description.should.have.been.calledOnce;
                switcher.get_quiddity_description.should.have.been.calledWith( id );
                should.exist( result );
                result.should.eql( quiddities.quiddity() );
            } );

            it( 'should return empty object with empty quiddity', function () {
                var id       = 'someId';
                switcher.get_quiddity_description.returns( {} );
                var result   = quiddityManager.getQuiddityDescription( id );
                switcher.get_quiddity_description.should.have.been.calledOnce;
                switcher.get_quiddity_description.should.have.been.calledWith( id );
                should.exist( result );
                result.should.eql( {} );
            } );

            it( 'should throw error when switcher throws', function () {
                var error    = 'some error';
                var id       = 'someId';
                switcher.get_quiddity_description.throws( new Error( error ) );
                expect( quiddityManager.getQuiddityDescription.bind( quiddityManager, id ) ).to.throw( error );
                switcher.get_quiddity_description.should.have.been.calledOnce;
                switcher.get_quiddity_description.should.have.been.calledWith( id );
            } );

            it( 'should throw error when switcher returns error', function () {
                var error    = 'some error';
                var id       = 'someId';
                switcher.get_quiddity_description.returns( {error: error} );
                expect( quiddityManager.getQuiddityDescription.bind( quiddityManager, id ) ).to.throw( error );
                switcher.get_quiddity_description.should.have.been.calledOnce;
                switcher.get_quiddity_description.should.have.been.calledWith( id );
            } );

            it( 'should return empty object when switcher returns null', function () {
                var id       = 'someId';
                switcher.get_quiddity_description.returns( null );
                var result   = quiddityManager.getQuiddityDescription( id );
                switcher.get_quiddity_description.should.have.been.calledOnce;
                switcher.get_quiddity_description.should.have.been.calledWith( id );
                should.exist( result );
                result.should.eql( {} );
            } );

            it( 'should return empty object when switcher returns garbage quiddity 1', function () {
                var id       = 'someId';
                switcher.get_quiddity_description.returns( 'not a quiddity' );
                var result   = quiddityManager.getQuiddityDescription( id );
                switcher.get_quiddity_description.should.have.been.calledOnce;
                switcher.get_quiddity_description.should.have.been.calledWith( id );
                should.exist( result );
                result.should.eql( {} );
            } );

            it( 'should return empty object when switcher returns garbage quiddity 2', function () {
                var id       = 'someId';
                switcher.get_quiddity_description.returns( [{not: 'a quiddity'}] );
                var result   = quiddityManager.getQuiddityDescription( id );
                switcher.get_quiddity_description.should.have.been.calledOnce;
                switcher.get_quiddity_description.should.have.been.calledWith( id );
                should.exist( result );
                result.should.eql( {} );
            } );

        } );
        
        describe( 'Tree', function () {

            it( 'should follow protocol', function () {
                var id     = 'someId';
                var path   = '.some.path';
                switcher.get_info.returns( quiddities.tree() );
                var result = quiddityManager.getTreeInfo( id, path );
                switcher.get_info.should.have.been.calledOnce;
                switcher.get_info.should.have.been.calledWith( id, path );
                should.exist( result );
                result.should.eql( quiddities.tree() );
            } );

            it( 'should follow protocol with empty tree', function () {
                var id     = 'someId';
                var path   = '.some.path';
                switcher.get_info.returns( {} );
                var result = quiddityManager.getTreeInfo( id, path );
                switcher.get_info.should.have.been.calledOnce;
                switcher.get_info.should.have.been.calledWith( id, path );
                should.exist( result );
                result.should.eql( {} );
            } );

            it( 'should return error when switcher throws', function () {
                var id    = 'someId';
                var path  = '.some.path';
                var error = 'some error';
                switcher.get_info.throws( new Error( error ) );
                expect( quiddityManager.getTreeInfo.bind( quiddityManager, id, path ) ).to.throw( error );
                switcher.get_info.should.have.been.calledOnce;
                switcher.get_info.should.have.been.calledWith( id, path );
            } );

            it( 'should throw error when switcher returns error', function () {
                var id    = 'someId';
                var path  = '.some.path';
                var error = 'some error';
                switcher.get_info.returns( {error: error} );
                expect( quiddityManager.getTreeInfo.bind( quiddityManager, id, path ) ).to.throw( error );
                switcher.get_info.should.have.been.calledOnce;
                switcher.get_info.should.have.been.calledWith( id, path );
            } );

            it( 'should return null when switcher returns null', function () {
                var id     = 'someId';
                var path   = '.some.path';
                switcher.get_info.returns( null );
                var result = quiddityManager.getTreeInfo( id, path );
                switcher.get_info.should.have.been.calledOnce;
                switcher.get_info.should.have.been.calledWith( id, path );
                should.not.exist( result );
            } );

            it( 'should return null when switcher des not return an object', function () {
                var id     = 'someId';
                var path   = '.some.path';
                switcher.get_info.returns( 'null' );
                var result = quiddityManager.getTreeInfo( id, path );
                switcher.get_info.should.have.been.calledOnce;
                switcher.get_info.should.have.been.calledWith( id, path );
                should.not.exist( result );
            } );

            it( 'should return null when switcher returns garbage', function () {
                var id     = 'someId';
                var path   = '.some.path';
                switcher.get_info.returns( 'this is not an object' );
                var result = quiddityManager.getTreeInfo( id, path );
                switcher.get_info.should.have.been.calledOnce;
                switcher.get_info.should.have.been.calledWith( id, path );
                should.not.exist( result );
            } );

        } );

        describe( 'Properties', function () {

            it( 'should follow protocol', function () {
                var id = 'someId';
                // Make a list of parsed public quiddities, _parseProperty is already tested so trust it
                var properties = _.clone( quiddities.properties() ).properties;
                _.each( properties, quiddityManager._parseProperty, quiddityManager );
                switcher.get_properties_description.returns( quiddities.properties() );
                var result     = quiddityManager.getProperties( id );
                switcher.get_properties_description.should.have.been.calledOnce;
                switcher.get_properties_description.should.have.been.calledWith( id );
                should.exist( result );
                result.should.eql( properties );
            } );

            it( 'should follow protocol with empty properties', function () {
                var id     = 'someId';
                switcher.get_properties_description.returns( {properties: []} );
                var result = quiddityManager.getProperties( id );
                switcher.get_properties_description.should.have.been.calledOnce;
                switcher.get_properties_description.should.have.been.calledWith( id );
                should.exist( result );
                result.should.eql( [] );
            } );

            it( 'should throw error when switcher throws', function () {
                var id    = 'someId';
                var error = 'some error';
                switcher.get_properties_description.throws( new Error( error ) );
                expect( quiddityManager.getProperties.bind( quiddityManager, id ) ).to.throw( error );
                switcher.get_properties_description.should.have.been.calledOnce;
                switcher.get_properties_description.should.have.been.calledWith( id );
            } );

            it( 'should throw error when switcher returns error', function () {
                var id    = 'someId';
                var error = 'some error';
                switcher.get_properties_description.returns( {error: error} );
                expect( quiddityManager.getProperties.bind( quiddityManager, id ) ).to.throw( error );
                switcher.get_properties_description.should.have.been.calledOnce;
                switcher.get_properties_description.should.have.been.calledWith( id );
            } );

            it( 'should return empty array when switcher returns null', function () {
                var id     = 'someId';
                switcher.get_properties_description.returns( null );
                var result = quiddityManager.getProperties( id );
                switcher.get_properties_description.should.have.been.calledOnce;
                switcher.get_properties_description.should.have.been.calledWith( id );
                should.exist( result );
                result.should.eql( [] );
            } );

            it( 'should return mpety array when switcher returns null properties', function () {
                var id     = 'someId';
                switcher.get_properties_description.returns( {properties: null} );
                var result = quiddityManager.getProperties( id );
                switcher.get_properties_description.should.have.been.calledOnce;
                switcher.get_properties_description.should.have.been.calledWith( id );
                should.exist( result );
                result.should.eql( [] );
            } );

            it( 'should return empty array when switcher returns garbage properties 1', function () {
                var id     = 'someId';
                switcher.get_properties_description.returns( {properties: 'not an array'} );
                var result = quiddityManager.getProperties( id );
                switcher.get_properties_description.should.have.been.calledOnce;
                switcher.get_properties_description.should.have.been.calledWith( id );
                should.exist( result );
                result.should.eql( [] );
            } );

            it( 'should return empty array when switcher returns garbage properties 2', function () {
                var id     = 'someId';
                switcher.get_properties_description.returns( {properties: {not: 'an array'}} );
                var result = quiddityManager.getProperties( id );
                switcher.get_properties_description.should.have.been.calledOnce;
                switcher.get_properties_description.should.have.been.calledWith( id );
                should.exist( result );
                result.should.eql( [] );
            } );

            it( 'should return empty array when switcher returns without properties', function () {
                var id     = 'someId';
                switcher.get_properties_description.returns( {} );
                var result = quiddityManager.getProperties( id );
                switcher.get_properties_description.should.have.been.calledOnce;
                switcher.get_properties_description.should.have.been.calledWith( id );
                should.exist( result );
                result.should.eql( [] );
            } );

        } );

        describe( 'Property Description', function () {

            it( 'should follow protocol', function () {
                var id       = 'someId';
                var property = 'prop';
                switcher.get_property_description.returns( quiddities.property_double() );
                var result   = quiddityManager.getPropertyDescription( id, property );
                switcher.get_property_description.should.have.been.calledOnce;
                switcher.get_property_description.should.have.been.calledWith( id, property );
                should.exist( result );
                result.should.eql( quiddities.property_double_parsed() );
            } );

            it( 'should return empty object with empty property', function () {
                var id       = 'someId';
                var property = 'prop';
                switcher.get_property_description.returns( {} );
                var result   = quiddityManager.getPropertyDescription( id, property );
                switcher.get_property_description.should.have.been.calledOnce;
                switcher.get_property_description.should.have.been.calledWith( id, property );
                should.exist( result );
                result.should.eql( {} );
            } );

            it( 'should throw error when switcher throws', function () {
                var error    = 'some error';
                var id       = 'someId';
                var property = 'prop';
                switcher.get_property_description.throws( new Error( error ) );
                expect( quiddityManager.getPropertyDescription.bind( quiddityManager, id, property ) ).to.throw( error );
                switcher.get_property_description.should.have.been.calledOnce;
                switcher.get_property_description.should.have.been.calledWith( id, property );
            } );

            it( 'should throw error when switcher returns error', function () {
                var error    = 'some error';
                var id       = 'someId';
                var property = 'prop';
                switcher.get_property_description.returns( {error: error} );
                expect( quiddityManager.getPropertyDescription.bind( quiddityManager, id, property ) ).to.throw( error );
                switcher.get_property_description.should.have.been.calledOnce;
                switcher.get_property_description.should.have.been.calledWith( id, property );
            } );

            it( 'should return empty object when switcher returns null', function () {
                var id       = 'someId';
                var property = 'prop';
                switcher.get_property_description.returns( null );
                var result   = quiddityManager.getPropertyDescription( id, property );
                switcher.get_property_description.should.have.been.calledOnce;
                switcher.get_property_description.should.have.been.calledWith( id, property );
                should.exist( result );
                result.should.eql( {} );
            } );

            it( 'should return empty object when switcher returns garbage property 1', function () {
                var id       = 'someId';
                var property = 'prop';
                switcher.get_property_description.returns( 'not a property' );
                var result   = quiddityManager.getPropertyDescription( id, property );
                switcher.get_property_description.should.have.been.calledOnce;
                switcher.get_property_description.should.have.been.calledWith( id, property );
                should.exist( result );
                result.should.eql( {} );
            } );

            it( 'should return empty object when switcher returns garbage property 2', function () {
                var id       = 'someId';
                var property = 'prop';
                switcher.get_property_description.returns( [{not: 'a property'}] );
                var result   = quiddityManager.getPropertyDescription( id, property );
                switcher.get_property_description.should.have.been.calledOnce;
                switcher.get_property_description.should.have.been.calledWith( id, property );
                should.exist( result );
                result.should.eql( {} );
            } );

        } );

        describe( 'Setting Property', function () {

            it( 'should follow protocol', function () {
                var id       = 'someId';
                var property = 'prop';
                var value    = 'val';
                switcher.set_property_value.returns( true );
                var result   = quiddityManager.setPropertyValue( id, property, value );
                switcher.set_property_value.should.have.been.calledOnce;
                switcher.set_property_value.should.have.been.calledWith( id, property, String( value ) );
                should.exist( result );
                result.should.be.true;
            } );

            it( 'should convert number values to string before calling switcher', function () {
                var id       = 'someId';
                var property = 'prop';
                switcher.set_property_value.returns( true );
                var result   = quiddityManager.setPropertyValue( id, property, 666 );
                switcher.set_property_value.should.have.been.calledOnce;
                switcher.set_property_value.should.have.been.calledWith( id, property, '666' );
                should.exist( result );
                result.should.be.true;
            } );

            it( 'should convert null values to string before calling switcher', function () {
                var id       = 'someId';
                var property = 'prop';
                switcher.set_property_value.returns( true );
                var result   = quiddityManager.setPropertyValue( id, property, null );
                switcher.set_property_value.should.have.been.calledOnce;
                switcher.set_property_value.should.have.been.calledWith( id, property, 'null' );
                should.exist( result );
                result.should.be.true;
            } );

            it( 'should convert boolean values to string before calling switcher', function () {
                var id       = 'someId';
                var property = 'prop';
                switcher.set_property_value.returns( true );
                var result   = quiddityManager.setPropertyValue( id, property, false );
                switcher.set_property_value.should.have.been.calledOnce;
                switcher.set_property_value.should.have.been.calledWith( id, property, 'false' );
                should.exist( result );
                result.should.be.true;
            } );

            it( 'should throw error when switcher throws', function () {
                var error    = 'some error';
                var id       = 'someId';
                var property = 'prop';
                var value    = 'val';
                switcher.set_property_value.throws( new Error( error ) );
                expect( quiddityManager.setPropertyValue.bind( quiddityManager, id, property, value ) ).to.throw( error );
                switcher.set_property_value.should.have.been.calledOnce;
                switcher.set_property_value.should.have.been.calledWith( id, property, String( value ) );
            } );

            it( 'should throw error when switcher returns an error', function () {
                var error    = 'some error';
                var id       = 'someId';
                var property = 'prop';
                var value    = 'val';
                switcher.set_property_value.returns( {error: error} );
                expect( quiddityManager.setPropertyValue.bind( quiddityManager, id, property, value ) ).to.throw();
                switcher.set_property_value.should.have.been.calledOnce;
                switcher.set_property_value.should.have.been.calledWith( id, property, String( value ) );
            } );

        } );

        describe( 'Methods', function () {

            it( 'should follow protocol', function () {
                var id = 'someId';
                // Make a list of parsed public quiddities, _parseMethod is already tested so trust it
                var methods = _.clone( quiddities.methods() ).methods;
                _.each( methods, quiddityManager._parseMethod, quiddityManager );
                switcher.get_methods_description.returns( quiddities.methods() );
                var result  = quiddityManager.getMethods( id );
                switcher.get_methods_description.should.have.been.calledOnce;
                switcher.get_methods_description.should.have.been.calledWith( id );
                should.exist( result );
                result.should.eql( methods );
            } );

            it( 'should follow protocol with empty methods', function () {
                var id     = 'someId';
                switcher.get_methods_description.returns( {methods: []} );
                var result = quiddityManager.getMethods( id );
                switcher.get_methods_description.should.have.been.calledOnce;
                switcher.get_methods_description.should.have.been.calledWith( id );
                should.exist( result );
                result.should.eql( [] );
            } );

            it( 'should throw error when switcher throws', function () {
                var id    = 'someId';
                var error = 'some error';
                switcher.get_methods_description.throws( new Error( error ) );
                expect( quiddityManager.getMethods.bind( quiddityManager, id ) ).to.throw( error );
                switcher.get_methods_description.should.have.been.calledOnce;
                switcher.get_methods_description.should.have.been.calledWith( id );
            } );

            it( 'should throw error when switcher returns error', function () {
                var id    = 'someId';
                var error = 'some error';
                switcher.get_methods_description.returns( {error: error} );
                expect( quiddityManager.getMethods.bind( quiddityManager, id ) ).to.throw( error );
                switcher.get_methods_description.should.have.been.calledOnce;
                switcher.get_methods_description.should.have.been.calledWith( id );
            } );

            it( 'should return empty array when switcher returns null', function () {
                var id     = 'someId';
                switcher.get_methods_description.returns( null );
                var result = quiddityManager.getMethods( id );
                switcher.get_methods_description.should.have.been.calledOnce;
                switcher.get_methods_description.should.have.been.calledWith( id );
                should.exist( result );
                result.should.eql( [] );
            } );

            it( 'should return mpety array when switcher returns null methods', function () {
                var id     = 'someId';
                switcher.get_methods_description.returns( {methods: null} );
                var result = quiddityManager.getMethods( id );
                switcher.get_methods_description.should.have.been.calledOnce;
                switcher.get_methods_description.should.have.been.calledWith( id );
                should.exist( result );
                result.should.eql( [] );
            } );

            it( 'should return empty array when switcher returns garbage methods 1', function () {
                var id     = 'someId';
                switcher.get_methods_description.returns( {methods: 'not an array'} );
                var result = quiddityManager.getMethods( id );
                switcher.get_methods_description.should.have.been.calledOnce;
                switcher.get_methods_description.should.have.been.calledWith( id );
                should.exist( result );
                result.should.eql( [] );
            } );

            it( 'should return empty array when switcher returns garbage methods 2', function () {
                var id     = 'someId';
                switcher.get_methods_description.returns( {methods: {not: 'an array'}} );
                var result = quiddityManager.getMethods( id );
                switcher.get_methods_description.should.have.been.calledOnce;
                switcher.get_methods_description.should.have.been.calledWith( id );
                should.exist( result );
                result.should.eql( [] );
            } );

            it( 'should return empty array when switcher returns without methods', function () {
                var id     = 'someId';
                switcher.get_methods_description.returns( {} );
                var result = quiddityManager.getMethods( id );
                switcher.get_methods_description.should.have.been.calledOnce;
                switcher.get_methods_description.should.have.been.calledWith( id );
                should.exist( result );
                result.should.eql( [] );
            } );

        } );

        describe( 'Method Description', function () {

            it( 'should follow protocol', function () {
                var id     = 'someId';
                var method = 'meth';
                switcher.get_method_description.returns( quiddities.method() );
                var result = quiddityManager.getMethodDescription( id, method );
                switcher.get_method_description.should.have.been.calledOnce;
                switcher.get_method_description.should.have.been.calledWith( id, method );
                should.exist( result );
                result.should.eql( quiddities.method_parsed() );
            } );

            it( 'should return empty object with empty method', function () {
                var id     = 'someId';
                var method = 'meth';
                switcher.get_method_description.returns( {} );
                var result = quiddityManager.getMethodDescription( id, method );
                switcher.get_method_description.should.have.been.calledOnce;
                switcher.get_method_description.should.have.been.calledWith( id, method );
                should.exist( result );
                result.should.eql( {} );
            } );

            it( 'should throw error when switcher throws', function () {
                var error  = 'some error';
                var id     = 'someId';
                var method = 'meth';
                switcher.get_method_description.throws( new Error( error ) );
                expect( quiddityManager.getMethodDescription.bind( quiddityManager, id, method ) ).to.throw( error );
                switcher.get_method_description.should.have.been.calledOnce;
                switcher.get_method_description.should.have.been.calledWith( id, method );
            } );

            it( 'should throw error when switcher returns error', function () {
                var error  = 'some error';
                var id     = 'someId';
                var method = 'meth';
                switcher.get_method_description.returns( {error: error} );
                expect( quiddityManager.getMethodDescription.bind( quiddityManager, id, method ) ).to.throw( error );
                switcher.get_method_description.should.have.been.calledOnce;
                switcher.get_method_description.should.have.been.calledWith( id, method );
            } );

            it( 'should return empty object when switcher returns null', function () {
                var id     = 'someId';
                var method = 'meth';
                switcher.get_method_description.returns( null );
                var result = quiddityManager.getMethodDescription( id, method );
                switcher.get_method_description.should.have.been.calledOnce;
                switcher.get_method_description.should.have.been.calledWith( id, method );
                should.exist( result );
                result.should.eql( {} );
            } );

            it( 'should return empty object when switcher returns garbage method 1', function () {
                var id     = 'someId';
                var method = 'meth';
                switcher.get_method_description.returns( 'not a method' );
                var result = quiddityManager.getMethodDescription( id, method );
                switcher.get_method_description.should.have.been.calledOnce;
                switcher.get_method_description.should.have.been.calledWith( id, method );
                should.exist( result );
                result.should.eql( {} );
            } );

            it( 'should return empty object when switcher returns garbage method 2', function () {
                var id     = 'someId';
                var method = 'meth';
                switcher.get_method_description.returns( [{not: 'a method'}] );
                var result = quiddityManager.getMethodDescription( id, method );
                switcher.get_method_description.should.have.been.calledOnce;
                switcher.get_method_description.should.have.been.calledWith( id, method );
                should.exist( result );
                result.should.eql( {} );
            } );

        } );

        describe( 'Invoking Method', function () {

            it( 'should follow protocol', function () {
                var id     = 'someId';
                var method = 'prop';
                var args   = ['arg1', 'arg2'];
                switcher.invoke.returns( true );
                var result = quiddityManager.invokeMethod( id, method, args );
                switcher.invoke.should.have.been.calledOnce;
                switcher.invoke.should.have.been.calledWith( id, method, args );
                should.exist( result );
                result.should.be.true;
            } );

            it( 'should change args to empty array when missing', function () {
                var id     = 'someId';
                var method = 'prop';
                var args   = null;
                switcher.invoke.returns( true );
                var result = quiddityManager.invokeMethod( id, method, args );
                switcher.invoke.should.have.been.calledOnce;
                switcher.invoke.should.have.been.calledWith( id, method, [] );
                should.exist( result );
                result.should.be.true;
            } );

            it( 'should wrap args in array when not an array', function () {
                var id     = 'someId';
                var method = 'prop';
                var args   = 'argument';
                switcher.invoke.returns( true );
                var result = quiddityManager.invokeMethod( id, method, args );
                switcher.invoke.should.have.been.calledOnce;
                switcher.invoke.should.have.been.calledWith( id, method, [args] );
                should.exist( result );
                result.should.be.true;
            } );

            it( 'should return error when switcher throws', function () {
                var id     = 'someId';
                var method = 'prop';
                var args   = ['arg1', 'arg2'];
                var error  = 'some error';
                switcher.invoke.throws( new Error( error ) );
                expect( quiddityManager.invokeMethod.bind( quiddityManager, id, method, args ) ).to.throw( error );
                switcher.invoke.should.have.been.calledOnce;
                switcher.invoke.should.have.been.calledWith( id, method, args );
            } );

        } );

        describe( 'Creating Quiddities', function () {

            var type;
            var name;
            var socketId;

            beforeEach(function() {
                type     = 'some type';
                name     = 'some name';
                socketId = 'some socket id';
                sinon.stub(quiddityManager, 'getQuiddityDescription');
                quiddityManager.getQuiddityDescription.returns( quiddities.quiddity() );
            });

            it( 'should follow protocol', function () {
                switcher.create.returns( name );
                var result = quiddityManager.create( type, name, socketId );
                switcher.create.should.have.been.calledOnce;
                switcher.create.should.have.been.calledWithExactly( type, name );
                quiddityManager.getQuiddityDescription.should.have.been.calledOnce;
                quiddityManager.getQuiddityDescription.should.have.been.calledWithExactly( name );
                should.exist( result );
                result.should.eql( quiddities.quiddity() );
            } );

            it( 'should follow protocol without a name', function () {
                switcher.create.returns( name );
                var result = quiddityManager.create( type, null, socketId );
                switcher.create.should.have.been.calledOnce;
                switcher.create.should.have.been.calledWithExactly( type );
                quiddityManager.getQuiddityDescription.should.have.been.calledOnce;
                quiddityManager.getQuiddityDescription.should.have.been.calledWithExactly( name );
                should.exist( result );
                result.should.eql( quiddities.quiddity() );
            } );

            it( 'should follow protocol with an empty name', function () {
                switcher.create.returns( name );
                var result = quiddityManager.create( type, '', socketId );
                switcher.create.should.have.been.calledOnce;
                switcher.create.should.have.been.calledWithExactly( type );
                quiddityManager.getQuiddityDescription.should.have.been.calledOnce;
                quiddityManager.getQuiddityDescription.should.have.been.calledWithExactly( name );
                should.exist( result );
                result.should.eql( quiddities.quiddity() );
            } );

            it( 'should throw error when switcher throws at create', function () {
                var error    = 'some error';
                switcher.create.throws( new Error( error ) );
                expect(quiddityManager.create.bind(quiddityManager, type, name, socketId ) ).to.throw(error);
                switcher.create.should.have.been.calledOnce;
                switcher.create.should.have.been.calledWithExactly( type, name );
                quiddityManager.getQuiddityDescription.should.not.have.been.called;
            } );

            it( 'should return null when switcher returns null at create', function () {
                var error    = 'some error';
                switcher.create.returns( null );
                var result = quiddityManager.create( type, name, socketId );
                switcher.create.should.have.been.calledOnce;
                switcher.create.should.have.been.calledWithExactly( type, name );
                quiddityManager.getQuiddityDescription.should.not.have.been.called;
                should.not.exist( result );
            } );

            it( 'should throw error when switcher throws at quiddity description', function () {
                var error    = 'some error';
                switcher.create.returns( name );
                quiddityManager.getQuiddityDescription.throws( new Error( error ) );
                expect(quiddityManager.create.bind( quiddityManager, type, name, socketId ) ).to.throw(error);
                switcher.create.should.have.been.calledOnce;
                switcher.create.should.have.been.calledWithExactly( type, name );
                quiddityManager.getQuiddityDescription.should.have.been.calledOnce;
                quiddityManager.getQuiddityDescription.should.have.been.calledWithExactly( name );
            } );

        } );

        describe( 'Removing Quiddities', function () {

            it( 'should follow protocol', function () {
                var id = 'someId';
                switcher.remove.returns( true );
                var result = quiddityManager.remove( id );
                switcher.remove.should.have.been.calledOnce;
                switcher.remove.should.have.been.calledWithExactly( id );
                should.exist(result);
                result.should.be.true;
            } );

            it( 'should follow protocol when switcher returns false', function () {
                var id = 'someId';
                switcher.remove.returns( false );
                var result = quiddityManager.remove( id );
                switcher.remove.should.have.been.calledOnce;
                switcher.remove.should.have.been.calledWithExactly( id );
                should.exist(result);
                result.should.be.false;
            } );

            it( 'should throw error when switcher throws', function () {
                var id    = 'someId';
                var error = 'some error';
                switcher.remove.throws( new Error(error) );
                expect(quiddityManager.remove.bind( quiddityManager, id ) ).to.throw(error);
                switcher.remove.should.have.been.calledOnce;
                switcher.remove.should.have.been.calledWithExactly( id );
            } );
        } );
    } )

} );