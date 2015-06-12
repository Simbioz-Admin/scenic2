var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

var quiddities   = require( '../../fixtures/quiddities' );

describe( 'Get Save File List Command', function () {

    var client;
    var command;
    var cb;

    beforeEach( function () {
        command = require( '../../../src/net/commands/file.list' );
        client  = {
            switcherController: {
                    getFileList: sinon.stub()
            }
        };
        command = command.execute.bind( client );
        cb      = sinon.stub();
    } );

    afterEach( function () {
        cb.should.have.been.calledOnce;
    } );

    it( 'should return file list on success', function () {
        client.switcherController.getFileList.yields( null, ['some', 'files'] );
        command( cb );
        client.switcherController.getFileList.should.have.been.calledOnce;
        cb.should.have.been.calledWithExactly( null, ['some', 'files'] );
    } );

    it( 'should return an error when manager returns an error', function () {
        var error = 'some error';
        client.switcherController.getFileList.yields(new Error(error));
        command( cb );
        client.switcherController.getFileList.should.have.been.calledOnce;
        cb.should.have.been.calledWithMatch( '' );
    } );

} );
