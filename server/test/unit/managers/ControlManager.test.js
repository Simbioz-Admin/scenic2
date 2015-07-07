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

describe( 'Control Manager', function () {

    var switcher;
    var io;
    var config;
    var switcherController;
    var controlManager;

    beforeEach( function () {
        io      = {};
        io.emit = sinon.stub();
        config  = {};

        var ControlManager = proxyquire( '../../../src/switcher/ControlManager', {
            '../lib/logger': logStub()
        } );

        var SwitcherController = proxyquire( '../../../src/switcher/SwitcherController', {
            './ControlManager': ControlManager,
            'switcher':         switcherStub
        } );

        switcherController = new SwitcherController( config, io );
        switcher           = switcherController.switcher;
        controlManager     = switcherController.controlManager;
    } );

    afterEach( function () {
        switcher       = null;
        config         = null;
        io             = null;
        controlManager = null;
    } );

    // Hey, dummy test to get started
    it( 'should exist', function () {
        should.exist( controlManager );
    } );

    describe( 'Initialization', function () {

        it( 'should have been instantiated correctly', function () {
            should.exist( controlManager.config );
            controlManager.config.should.equal( config );

            should.exist( controlManager.switcher );
            controlManager.switcher.should.equal( switcher );

            should.exist( controlManager.io );
            controlManager.io.should.equal( io );
        } );

    } );

    describe( 'Adding Mappings', function () {

        var sq;
        var sp;
        var dq;
        var dp;

        beforeEach( function () {
            sq = 'sourceQuiddity';
            sp = 'sourceProperty';
            dq = 'destinationQuiddity';
            dp = 'destinationProperty';
            sinon.stub( switcherController.quiddityManager, 'getPropertyDescription' );
            sinon.stub( switcherController.quiddityManager, 'create' );
            sinon.stub( switcherController.quiddityManager, 'remove' );
            sinon.stub( switcherController.quiddityManager, 'invokeMethod' );
        } );

        it( 'should follow protocol', function () {
            switcherController.quiddityManager.getPropertyDescription.onFirstCall().returns( quiddities.property_int() );
            switcherController.quiddityManager.getPropertyDescription.onSecondCall().returns( quiddities.property_double() );
            switcherController.quiddityManager.create.returns( quiddities.mapper() );
            switcherController.quiddityManager.invokeMethod.returns( true );

            var result = controlManager.addMapping( sq, sp, dq, dp );

            switcherController.quiddityManager.getPropertyDescription.should.have.been.calledTwice;
            switcherController.quiddityManager.getPropertyDescription.should.have.been.calledWithExactly( sq, sp );
            switcherController.quiddityManager.getPropertyDescription.should.have.been.calledWithExactly( dq, dp );
            switcherController.quiddityManager.create.should.have.been.calledOnce;
            switcherController.quiddityManager.create.should.have.been.calledWithExactly( 'property-mapper' );
            switcherController.quiddityManager.remove.should.not.have.been.called;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( quiddities.mapper().id, 'set-source-property', [sq, sp] );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( quiddities.mapper().id, 'set-sink-property', [dq, dp] );

            should.exist( result );
            result.should.be.true;
        } );

        it( 'should return false if source property is not found', function () {
            switcherController.quiddityManager.getPropertyDescription.onFirstCall().returns( null );

            var result = controlManager.addMapping( sq, sp, dq, dp );

            switcherController.quiddityManager.getPropertyDescription.should.have.been.calledOnce;
            switcherController.quiddityManager.getPropertyDescription.should.have.been.calledWithExactly( sq, sp );
            switcherController.quiddityManager.create.should.not.have.been.called;
            switcherController.quiddityManager.remove.should.not.have.been.called;
            switcherController.quiddityManager.invokeMethod.should.not.have.been.called;

            should.exist( result );
            result.should.be.false;
        } );

        it( 'should return false if destination property is not found', function () {
            switcherController.quiddityManager.getPropertyDescription.onFirstCall().returns( quiddities.property_int() );
            switcherController.quiddityManager.getPropertyDescription.onSecondCall().returns( null );

            var result = controlManager.addMapping( sq, sp, dq, dp );

            switcherController.quiddityManager.getPropertyDescription.should.have.been.calledTwice;
            switcherController.quiddityManager.getPropertyDescription.should.have.been.calledWithExactly( sq, sp );
            switcherController.quiddityManager.getPropertyDescription.should.have.been.calledWithExactly( dq, dp );
            switcherController.quiddityManager.create.should.not.have.been.called;
            switcherController.quiddityManager.remove.should.not.have.been.called;
            switcherController.quiddityManager.invokeMethod.should.not.have.been.called;

            should.exist( result );
            result.should.be.false;
        } );

        it( 'should return false if mapper could not be created', function () {
            switcherController.quiddityManager.getPropertyDescription.onFirstCall().returns( quiddities.property_int() );
            switcherController.quiddityManager.getPropertyDescription.onSecondCall().returns( quiddities.property_double() );
            switcherController.quiddityManager.create.returns( null );

            var result = controlManager.addMapping( sq, sp, dq, dp );

            switcherController.quiddityManager.getPropertyDescription.should.have.been.calledTwice;
            switcherController.quiddityManager.getPropertyDescription.should.have.been.calledWithExactly( sq, sp );
            switcherController.quiddityManager.getPropertyDescription.should.have.been.calledWithExactly( dq, dp );
            switcherController.quiddityManager.create.should.have.been.calledOnce;
            switcherController.quiddityManager.create.should.have.been.calledWithExactly( 'property-mapper' );
            switcherController.quiddityManager.remove.should.not.have.been.called;
            switcherController.quiddityManager.invokeMethod.should.not.have.been.called;

            should.exist( result );
            result.should.be.false;
        } );

        it( 'should remove mapper and return false if source property could not be set', function () {
            switcherController.quiddityManager.getPropertyDescription.onFirstCall().returns( quiddities.property_int() );
            switcherController.quiddityManager.getPropertyDescription.onSecondCall().returns( quiddities.property_double() );
            switcherController.quiddityManager.create.returns( quiddities.mapper() );
            switcherController.quiddityManager.invokeMethod.onFirstCall().returns( false );

            var result = controlManager.addMapping( sq, sp, dq, dp );

            switcherController.quiddityManager.getPropertyDescription.should.have.been.calledTwice;
            switcherController.quiddityManager.getPropertyDescription.should.have.been.calledWithExactly( sq, sp );
            switcherController.quiddityManager.getPropertyDescription.should.have.been.calledWithExactly( dq, dp );
            switcherController.quiddityManager.create.should.have.been.calledOnce;
            switcherController.quiddityManager.create.should.have.been.calledWithExactly( 'property-mapper' );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledOnce;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( quiddities.mapper().id, 'set-source-property', [sq, sp] );
            switcherController.quiddityManager.remove.should.have.been.calledOnce;
            switcherController.quiddityManager.remove.should.have.been.calledWithExactly( quiddities.mapper().id );

            should.exist( result );
            result.should.be.false;
        } );

        it( 'should remove mapper and return false if destination property could not be set', function () {
            switcherController.quiddityManager.getPropertyDescription.onFirstCall().returns( quiddities.property_int() );
            switcherController.quiddityManager.getPropertyDescription.onSecondCall().returns( quiddities.property_double() );
            switcherController.quiddityManager.create.returns( quiddities.mapper() );
            switcherController.quiddityManager.invokeMethod.onFirstCall().returns( true );
            switcherController.quiddityManager.invokeMethod.onSecondCall().returns( false );

            var result = controlManager.addMapping( sq, sp, dq, dp );

            switcherController.quiddityManager.getPropertyDescription.should.have.been.calledTwice;
            switcherController.quiddityManager.getPropertyDescription.should.have.been.calledWithExactly( sq, sp );
            switcherController.quiddityManager.getPropertyDescription.should.have.been.calledWithExactly( dq, dp );
            switcherController.quiddityManager.create.should.have.been.calledOnce;
            switcherController.quiddityManager.create.should.have.been.calledWithExactly( 'property-mapper' );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledTwice;
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( quiddities.mapper().id, 'set-source-property', [sq, sp] );
            switcherController.quiddityManager.invokeMethod.should.have.been.calledWithExactly( quiddities.mapper().id, 'set-sink-property', [dq, dp] );
            switcherController.quiddityManager.remove.should.have.been.calledOnce;
            switcherController.quiddityManager.remove.should.have.been.calledWithExactly( quiddities.mapper().id );

            should.exist( result );
            result.should.be.false;
        } );

    } );

    describe( 'Removing Mappings', function () {

        describe( 'By Quiddity', function () {

            var q;
            var quidds;

            beforeEach( function () {
                q      = 'quiddity';
                quidds = [
                    {
                        'id':    'irrelevant',
                        'class': 'irrelevant'
                    },
                    {
                        'id':    'mapper1',
                        'class': 'property-mapper',
                        'tree':  {
                            'source': {
                                'quiddity': q
                            }
                        }
                    },
                    {
                        'id':    'mapper2',
                        'class': 'property-mapper',
                        'tree':  {
                            'source': {
                                'quiddity': 'irrelevant'
                            }
                        }
                    },
                    {
                        'id':    'mapper3',
                        'class': 'property-mapper',
                        'tree':  {
                            'sink': {
                                'quiddity': q
                            }
                        }
                    },
                    {
                        'id':    'mapper4',
                        'class': 'property-mapper',
                        'tree':  {
                            'sink': {
                                'quiddity': 'irrelevant'
                            }
                        }
                    }
                ];
                sinon.stub( switcherController.quiddityManager, 'getQuiddities' );
                sinon.stub( switcherController.quiddityManager, 'remove' );
            } );

            it( 'should follow protocol', function () {
                switcherController.quiddityManager.getQuiddities.returns( quidds );
                switcherController.quiddityManager.remove.returns( true );

                var result = controlManager.removeMappingsByQuiddity( q );

                switcherController.quiddityManager.getQuiddities.should.have.been.calledOnce;
                switcherController.quiddityManager.remove.should.have.been.calledTwice;
                switcherController.quiddityManager.remove.should.have.been.calledWithExactly( 'mapper1' );
                switcherController.quiddityManager.remove.should.have.been.calledWithExactly( 'mapper3' );

                should.exist( result );
                result.should.be.true;
            } );

            it( 'should return success when no mappers are found', function () {
                switcherController.quiddityManager.getQuiddities.returns( [] );
                var result = controlManager.removeMappingsByQuiddity( q );

                switcherController.quiddityManager.getQuiddities.should.have.been.calledOnce;
                switcherController.quiddityManager.remove.should.not.have.been.called;

                should.exist( result );
                result.should.be.true;
            } );

            it( 'should return false when no quiddities are found', function () {
                switcherController.quiddityManager.getQuiddities.returns( null );
                var result = controlManager.removeMappingsByQuiddity( q );

                switcherController.quiddityManager.getQuiddities.should.have.been.calledOnce;
                switcherController.quiddityManager.remove.should.not.have.been.called;

                should.exist( result );
                result.should.be.false;
            } );

            it( 'should return false when a mapper failed to remove but continue removing', function () {
                switcherController.quiddityManager.getQuiddities.returns( quidds );
                switcherController.quiddityManager.remove.onFirstCall().returns( false );
                switcherController.quiddityManager.remove.onSecondCall().returns( true );

                var result = controlManager.removeMappingsByQuiddity( q );

                switcherController.quiddityManager.getQuiddities.should.have.been.calledOnce;
                switcherController.quiddityManager.remove.should.have.been.calledTwice;
                switcherController.quiddityManager.remove.should.have.been.calledWithExactly( 'mapper1' );
                switcherController.quiddityManager.remove.should.have.been.calledWithExactly( 'mapper3' );

                should.exist( result );
                result.should.be.false;
            } );

        } );

    } );

    describe( 'By Destination', function () {

        var dq;
        var dp;
        var quidds;

        beforeEach( function () {
            dq     = 'destinationQuiddity';
            dp     = 'destinationProperty';
            quidds = [
                {
                    'id':    'irrelevant',
                    'class': 'irrelevant'
                },
                {
                    'id':    'mapper1',
                    'class': 'property-mapper',
                    'tree':  {
                        'sink': {
                            'quiddity': dq,
                            'property': dp
                        }
                    }
                },
                {
                    'id':    'mapper2',
                    'class': 'property-mapper',
                    'tree':  {
                        'sink': {
                            'quiddity': 'irrelevant',
                            'property': 'irrelevant'
                        }
                    }
                },
                {
                    'id':    'mapper3',
                    'class': 'property-mapper',
                    'tree':  {
                        'source': {
                            'quiddity': 'irrelevant',
                            'property': 'irrelevant'
                        }
                    }
                },
                {
                    'id':    'mapper4',
                    'class': 'property-mapper',
                    'tree':  {
                        'sink': {
                            'quiddity': dq,
                            'property': 'irrelevant'
                        }
                    }
                },
                {
                    'id':    'mapper5',
                    'class': 'property-mapper',
                    'tree':  {
                        'sink': {
                            'quiddity': 'irrelevant',
                            'property': dp
                        }
                    }
                },
                {
                    'id':    'mapper6',
                    'class': 'property-mapper',
                    'tree':  {
                        'sink': {
                            'quiddity': dq,
                            'property': dp
                        }
                    }
                }
            ];
            sinon.stub( switcherController.quiddityManager, 'getQuiddities' );
            sinon.stub( switcherController.quiddityManager, 'remove' );
        } );

        it( 'should follow protocol', function () {
            switcherController.quiddityManager.getQuiddities.returns( quidds );
            switcherController.quiddityManager.remove.returns( true );

            var result = controlManager.removeMappingsByDestination( dq, dp );

            switcherController.quiddityManager.getQuiddities.should.have.been.calledOnce;
            switcherController.quiddityManager.remove.should.have.been.calledTwice;
            switcherController.quiddityManager.remove.should.have.been.calledWithExactly( 'mapper1' );
            switcherController.quiddityManager.remove.should.have.been.calledWithExactly( 'mapper6' );

            should.exist( result );
            result.should.be.true;
        } );

        it( 'should return success when no mappers are found', function () {
            switcherController.quiddityManager.getQuiddities.returns( [] );
            var result = controlManager.removeMappingsByDestination( dq, dp );

            switcherController.quiddityManager.getQuiddities.should.have.been.calledOnce;
            switcherController.quiddityManager.remove.should.not.have.been.called;

            should.exist( result );
            result.should.be.true;
        } );

        it( 'should return false when no quiddities are found', function () {
            switcherController.quiddityManager.getQuiddities.returns( null );
            var result = controlManager.removeMappingsByDestination( dq, dp );

            switcherController.quiddityManager.getQuiddities.should.have.been.calledOnce;
            switcherController.quiddityManager.remove.should.not.have.been.called;

            should.exist( result );
            result.should.be.false;
        } );

        it( 'should return false when a mapper failed to remove but continue removing', function () {
            switcherController.quiddityManager.getQuiddities.returns( quidds );
            switcherController.quiddityManager.remove.onFirstCall().returns( false );
            switcherController.quiddityManager.remove.onSecondCall().returns( true );

            var result = controlManager.removeMappingsByDestination( dq, dp );

            switcherController.quiddityManager.getQuiddities.should.have.been.calledOnce;
            switcherController.quiddityManager.remove.should.have.been.calledTwice;
            switcherController.quiddityManager.remove.should.have.been.calledWithExactly( 'mapper1' );
            switcherController.quiddityManager.remove.should.have.been.calledWithExactly( 'mapper6' );

            should.exist( result );
            result.should.be.false;
        } );

    } );

} );