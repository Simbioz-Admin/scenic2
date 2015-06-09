var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

var quiddities   = require( '../../fixtures/quiddities' );

describe( 'Save Save File Command', function () {

    var client;
    var command;
    var cb;

    beforeEach( function () {
        command = require( '../../../src/net/commands/file.save' );
        client  = {
            switcherController: {
                saveFile: sinon.stub()
            }
        };
        command = command.execute.bind( client );
        cb      = sinon.stub();
    } );

    afterEach( function () {
        cb.should.have.been.calledOnce;
    } );

    it( 'should return nothing on success', function () {
        client.switcherController.saveFile.returns(true);
        command( 'file name', cb );
        client.switcherController.saveFile.should.have.been.calledOnce;
        client.switcherController.saveFile.should.have.been.calledWithExactly( 'file name' );
        cb.should.have.been.calledWithExactly( );
    } );

    it( 'should return an error when saveing is unsuccessful', function () {
        client.switcherController.saveFile.returns(false);
        command( 'file name', cb );
        client.switcherController.saveFile.should.have.been.calledOnce;
        client.switcherController.saveFile.should.have.been.calledWithExactly( 'file name' );
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when manager throws', function () {
        var error = 'some error';
        client.switcherController.saveFile.throws(new Error(error));
        command( 'file name', cb );
        client.switcherController.saveFile.should.have.been.calledOnce;
        client.switcherController.saveFile.should.have.been.calledWithExactly( 'file name' );
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when file parameter is empty', function () {
        command( '', cb );
        client.switcherController.saveFile.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when file parameter is null', function () {
        command( null, cb );
        client.switcherController.saveFile.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when file parameter is a number', function () {
        command( 666, cb );
        client.switcherController.saveFile.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when file parameter is not a string', function () {
        command( ['not a string'], cb );
        client.switcherController.saveFile.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );


} );
