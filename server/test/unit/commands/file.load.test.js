var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

var quiddities   = require( '../../fixtures/quiddities' );

describe( 'Load Save File Command', function () {

    var client;
    var command;
    var cb;

    beforeEach( function () {
        command = require( '../../../src/net/commands/file.load' );
        client  = {
            switcherController: {
                loadFile: sinon.stub()
            }
        };
        command = command.execute.bind( client );
        cb      = sinon.stub();
    } );

    afterEach( function () {
        cb.should.have.been.calledOnce;
    } );

    it( 'should return nothing on success', function () {
        client.switcherController.loadFile.returns(true);
        command( 'file name', cb );
        client.switcherController.loadFile.should.have.been.calledOnce;
        client.switcherController.loadFile.should.have.been.calledWithExactly( 'file name' );
        cb.should.have.been.calledWithExactly( );
    } );

    it( 'should return an error when loading is unsuccessful', function () {
        client.switcherController.loadFile.returns(false);
        command( 'file name', cb );
        client.switcherController.loadFile.should.have.been.calledOnce;
        client.switcherController.loadFile.should.have.been.calledWithExactly( 'file name' );
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when manager throws', function () {
        var error = 'some error';
        client.switcherController.loadFile.throws(new Error(error));
        command( 'file name', cb );
        client.switcherController.loadFile.should.have.been.calledOnce;
        client.switcherController.loadFile.should.have.been.calledWithExactly( 'file name' );
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when file parameter is empty', function () {
        command( '', cb );
        client.switcherController.loadFile.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when file parameter is null', function () {
        command( null, cb );
        client.switcherController.loadFile.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when file parameter is a number', function () {
        command( 666, cb );
        client.switcherController.loadFile.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when file parameter is not a string', function () {
        command( ['not a string'], cb );
        client.switcherController.loadFile.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );


} );
