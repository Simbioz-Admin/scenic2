var proxyquire = require( 'proxyquire' ).noCallThru();
var chai       = require( "chai" );
var sinon      = require( "sinon" );
var sinonChai  = require( "sinon-chai" );
var should     = chai.should();
chai.use( sinonChai );

describe( 'Switcher Controller', function () {

    var switcher;
    var config;
    var io;
    var switcherController;

    beforeEach( function () {
        switcher               = {};
        config                 = {};
        io                     = {};
        io.emit                = sinon.spy();
        var SwitcherController = proxyquire( '../../src/switcher/SwitcherController', {'switcher': switcher} );
        switcherController     = new SwitcherController( config, io );
    } );
    afterEach( function () {
        config             = null;
        io                 = null;
        switcherController = null;
    } );

    // Hey, dummy test to get started
    it( 'should exist', function () {
        should.exist( switcherController );
    } );

    it( 'should have been instanciated correctly', function () {
        should.exist( switcherController.config );
        switcherController.config.should.equal( config );

        should.exist( switcherController.io );
        switcherController.io.should.equal( io );

        should.exist( switcherController.quiddityManager );
        switcherController.quiddityManager.should.be.an.instanceOf( require( '../../src/switcher/QuiddityManager' ) );

        should.exist( switcherController.sipManager );
        switcherController.sipManager.should.be.an.instanceOf( require( '../../src/switcher/SipManager' ) );

        should.exist( switcherController.receiverManager );
        switcherController.receiverManager.should.be.an.instanceOf( require( '../../src/switcher/ReceiverManager' ) );
    } );

    describe( 'Signal', function () {

        it( 'should subscribe to property when property is added', function () {
            switcher.subscribe_to_property = sinon.spy();
            switcherController._onSwitcherSignal( 'irrelevant', 'on-property-added', ['anything'] );
            switcher.subscribe_to_property.should.have.been.calledOnce;
            switcher.subscribe_to_property.should.have.been.calledWith( 'irrelevant', 'anything' );
        } );

        it( 'should unsubscribe to property when property is removed', function () {
            switcher.unsubscribe_to_property = sinon.spy();
            switcherController._onSwitcherSignal( 'irrelevant', 'on-property-removed', ['anything'] );
            switcher.unsubscribe_to_property.should.have.been.calledOnce;
            switcher.unsubscribe_to_property.should.have.been.calledWith( 'irrelevant', 'anything' );
        } );

        it( 'should notify clients and cleanup when quiddity is removed', function () {
            var quiddityRemoveStub = sinon.stub( switcherController.quiddityManager, 'removeElementsAssociateToQuiddRemoved' );
            switcherController._onSwitcherSignal( 'irrelevant', 'on-quiddity-removed', ['anything'] );
            io.emit.should.have.been.calledOnce;
            io.emit.should.have.been.calledWith( 'remove', ['anything'] );
            quiddityRemoveStub.calledOnce;
            quiddityRemoveStub.calledWith( 'anything' );
        } );
    } );

} );