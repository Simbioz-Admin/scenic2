var _          = require( 'underscore' );
var async      = require( 'async' );
var proxyquire = require( 'proxyquire' ).noCallThru();
var chai       = require( "chai" );
var sinon      = require( "sinon" );
var sinonChai  = require( "sinon-chai" );
var should     = chai.should();
chai.use( sinonChai );

var quiddities = require( '../fixtures/quiddities' );

describe( 'Control Mappings', function () {

    var config;
    var io;
    var switcherController;
    var checkPort;
    var fs;
    var control;

    beforeEach( function (done) {
        config                 = require( '../fixtures/config' );
        io                     = {};
        io.emit                = sinon.spy();
        checkPort              = sinon.stub();
        checkPort.yields();
        fs                     = {};
        var SwitcherController = proxyquire( '../../src/switcher/SwitcherController', {
            'fs':                  fs,
            '../utils/check-port': checkPort
        } );
        switcherController     = new SwitcherController( config, io );
        control                = switcherController.controlManager;
        switcherController.initialize(done);
    } );

    afterEach( function () {
        console.log('closing');
        switcherController.close();
        switcherController = null;
        console.log('closed');
        config             = null;
        io                 = null;
        switcherController = null;
        checkPort          = null;
        fs                 = null;
    } );

    describe( 'Creating Quiddities', function () {

        it( 'should map properties', function () {
            switcherController.quiddityManager.create( 'audiotestsrc', 'a1' );
            switcherController.quiddityManager.create( 'audiotestsrc', 'a2' );
            var result     = control.addMapping( 'a1', 'volume', 'a2', 'volume' );
            should.exist( result );
            result.should.be.true;
            var mapper = _.findWhere( switcherController.quiddityManager.getQuiddities(), {'class':'property-mapper'});
            should.exist( mapper );
            should.exist(mapper.tree);
            should.exist(mapper.tree.source);
            should.exist(mapper.tree.source.quiddity);
            mapper.tree.source.quiddity.should.equal('a1');
            should.exist(mapper.tree.source.property);
            mapper.tree.source.property.should.equal('volume');
            should.exist(mapper.tree.sink);
            should.exist(mapper.tree.sink.quiddity);
            mapper.tree.sink.quiddity.should.equal('a2');
            should.exist(mapper.tree.sink.property);
            mapper.tree.sink.property.should.equal('volume');
        } );

        it( 'should remove mapping when removing source quiddity', function ( done ) {

            var original = switcherController.quiddityManager._onRemoved;
            switcherController.quiddityManager._onRemoved = function( quiddityId ) {
                original.apply( switcherController.quiddityManager, arguments );

                if ( quiddityId == 'property-mapper0' ) {
                    var mapper = _.findWhere( switcherController.quiddityManager.getQuiddities({}), { 'class': 'property-mapper' } );
                    should.not.exist( mapper );
                    done();
                }
            };

            switcherController.quiddityManager.create( 'audiotestsrc', 'a1' );
            switcherController.quiddityManager.create( 'audiotestsrc', 'a2' );
            control.addMapping( 'a1', 'volume', 'a2', 'volume' );
            switcherController.quiddityManager.remove( 'a1' );
        } );

        it( 'should remove mapping when removing sink quiddity', function ( done ) {

            var originalRemoved = switcherController.quiddityManager._onRemoved;
            switcherController.quiddityManager._onRemoved = function( quiddityId ) {
                originalRemoved.apply( switcherController.quiddityManager, arguments );
                if ( quiddityId == 'property-mapper0' ) {
                    var mapper = _.findWhere( switcherController.quiddityManager.getQuiddities(), { 'class': 'property-mapper' } );
                    should.not.exist( mapper );
                    done();
                }
            };

            switcherController.quiddityManager.create( 'audiotestsrc', 'a1' );
            switcherController.quiddityManager.create( 'audiotestsrc', 'a2' );
            control.addMapping( 'a1', 'volume', 'a2', 'volume' );
            switcherController.quiddityManager.remove( 'a2' );
        } );

    } );
} );