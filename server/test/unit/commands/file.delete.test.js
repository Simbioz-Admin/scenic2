var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

var quiddities = require( '../../fixtures/quiddities' );

describe( 'Get Save File List Command', function () {

    var client;
    var command;
    var cb;

    beforeEach( function () {
        command = require( '../../../src/net/commands/file.delete' );
        client  = {
            switcherController: {
                deleteFile: sinon.stub()
            }
        };
        command = command.execute.bind( client );
        cb      = sinon.stub();
    } );

    afterEach( function () {
        cb.should.have.been.calledOnce;
    } );

    it( 'should return nothing on success', function () {
        client.switcherController.deleteFile.yields();
        command( 'file name', cb );
        client.switcherController.deleteFile.should.have.been.calledOnce;
        cb.should.have.been.calledWithExactly( );
    } );

    it( 'should return an error when manager returns an error', function () {
        var error = 'some error';
        client.switcherController.deleteFile.yields( new Error( error ) );
        command( 'file name', cb );
        client.switcherController.deleteFile.should.have.been.calledOnce;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when file parameter is empty', function () {
        command( '', cb );
        client.switcherController.deleteFile.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when file parameter is null', function () {
        command( null, cb );
        client.switcherController.deleteFile.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when file parameter is a number', function () {
        command( 666, cb );
        client.switcherController.deleteFile.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

    it( 'should return an error when file parameter is not a string', function () {
        command( ['not a string'], cb );
        client.switcherController.deleteFile.should.not.have.been.called;
        cb.should.have.been.calledWithMatch( '' );
    } );

} );
