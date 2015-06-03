var async = require('async');
var proxyquire = require( 'proxyquire' ).noCallThru();
var chai       = require( "chai" );
var sinon      = require( "sinon" );
var sinonChai  = require( "sinon-chai" );
var should     = chai.should();
chai.use( sinonChai );

var SwitcherAddon = require('switcher');

describe( 'Quiddity Lifecycle', function () {

    var cb;
    var switcher;

    beforeEach( function () {
        switcher = new SwitcherAddon.Switcher('test', function( message ) {
            //console.log( message );
        } );
        cb                     = sinon.stub();
    } );

    afterEach( function () {
        switcher.close();
        cb                 = null;
    } );

    describe('Initialization', function() {

        it('should have initialized correctly', function() {
            switcher.has_quiddity('internal_logger' ).should.be.true;
            var logger = switcher.get_quiddity_description('internal_logger');
            should.exist( logger );
            logger.class.should.equal('logger');

            switcher.has_quiddity('create_remove_spy' ).should.be.true;
            var spy = switcher.get_quiddity_description('create_remove_spy');
            should.exist( spy );
            spy.class.should.equal('create_remove_spy');
        })

    });

    describe('Callbacks', function() {
        var property_cb = sinon.stub();

        //switcher.register_prop_callback(property_cb);
        //switcher.create
    });
});