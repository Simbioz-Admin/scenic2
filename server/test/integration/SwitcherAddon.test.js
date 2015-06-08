var async      = require( 'async' );
var proxyquire = require( 'proxyquire' ).noCallThru();
var chai       = require( "chai" );
var sinon      = require( "sinon" );
var sinonChai  = require( "sinon-chai" );
var should     = chai.should();
chai.use( sinonChai );

var SwitcherAddon = require( 'switcher' );

describe( 'Switcher Addon', function () {

    var log;
    var switcher;

    beforeEach( function () {
        log      = sinon.stub();
        switcher = new SwitcherAddon.Switcher( 'test', log );
    } );

    afterEach( function () {
        switcher.close();
    } );

    describe( 'Initialization', function () {

        it( 'should have initialized correctly', function () {
            switcher.has_quiddity( 'internal_logger' ).should.be.true;
            var logger = switcher.get_quiddity_description( 'internal_logger' );
            should.exist( logger );
            logger.class.should.equal( 'logger' );

            switcher.has_quiddity( 'create_remove_spy' ).should.be.true;
            var spy    = switcher.get_quiddity_description( 'create_remove_spy' );
            should.exist( spy );
            spy.class.should.equal( 'create_remove_spy' );
        } )

    } );

    describe( 'Callbacks', function () {

        describe('Logger', function() {

            it('should receive logging info', function() {
                // Logs are sent at creation so nothing to do here, just check if we received something
                log.should.have.been.called;
            });

        });

        describe('Properties', function() {

            it('should receive changed property callbacks', function(done) {
                var dummy = switcher.create('dummy');
                switcher.subscribe_to_property( dummy, 'myprop');
                switcher.register_prop_callback(function( quiddity, property, value ) {
                    quiddity.should.equal(dummy);
                    property.should.equal('myprop');
                    value.should.equal(String(true));
                    done();
                });
                switcher.set_property_value( dummy, 'myprop', String(true));
            });

        });

        describe('Signals', function() {

            it('should receive quiddity creation callbacks', function(done) {
                var dummy = switcher.create('dummy');
                switcher.register_signal_callback(function( quiddity, signal, value ) {
                    quiddity.should.equal('create_remove_spy');
                    signal.should.equal('on-quiddity-created');
                    value.should.eql([dummy]);
                    done();
                });
            });

            it('should receive quiddity removal callbacks', function(done) {
                var created = false;
                var dummy = switcher.create('dummy');
                switcher.remove(dummy);
                switcher.register_signal_callback(function( quiddity, signal, value ) {
                    if (!created ) {
                        quiddity.should.equal( 'create_remove_spy' );
                        signal.should.equal( 'on-quiddity-created' );
                        value.should.eql( [dummy] );
                        created = true;
                    } else {
                        quiddity.should.equal( 'create_remove_spy' );
                        signal.should.equal( 'on-quiddity-removed' );
                        value.should.eql( [dummy] );
                        done();
                    }
                });
            });

            it('should receive tree grafted callbacks', function(done) {
                var created = false;
                var dico = switcher.create('dico');
                switcher.subscribe_to_signal( dico, 'on-tree-grafted');
                switcher.invoke(dico, 'update', ['shmil', 'blick']);
                switcher.register_signal_callback(function( quiddity, signal, value ) {
                    if (!created ) {
                        created = true; // Already tested
                    } else {
                        quiddity.should.equal( dico );
                        signal.should.equal( 'on-tree-grafted' );
                        value.should.eql( ['.dico.shmil' ] );
                        done();
                    }
                });
            });

            it('should receive tree pruned callbacks', function(done) {
                var created = false;
                var dico = switcher.create('dico');
                switcher.subscribe_to_signal( dico, 'on-tree-pruned');
                switcher.invoke(dico, 'update', ['shmil', 'blick']);
                switcher.invoke(dico, 'remove', ['shmil']);
                switcher.register_signal_callback(function( quiddity, signal, value ) {
                    if ( !created ) {
                        created = true; // Already tested
                    } else {
                        quiddity.should.equal( dico );
                        signal.should.equal( 'on-tree-pruned' );
                        value.should.eql( ['.dico.shmil' ] );
                        done();
                    }
                });
            });

        });

    } );
} );