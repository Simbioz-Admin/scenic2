var _         = require( 'underscore' );
var chai      = require( 'chai' );
var sinon     = require( 'sinon' );
var sinonChai = require( 'sinon-chai' );
var should    = chai.should();
var expect    = chai.expect;
chai.use( sinonChai );

var quiddities   = require( '../../fixtures/quiddities' );

describe( 'Get Tree Information Command', function () {

    var client;
    var command;
    var cb;

    beforeEach( function () {
        command = require( '../../../src/net/commands/getTreeInfo' );

        client = {
            switcherController: {
                quiddityManager: {
                    getTreeInfo: sinon.stub()
                }
            }
        };
        command = command.execute.bind( client );
        cb = sinon.stub();
    } );

    afterEach(function() {
        cb.should.have.been.calledOnce;
    });

    it( 'should return exactly what the manager returns', function () {
        client.switcherController.quiddityManager.getTreeInfo.returns({});
        command('quidd','path', cb);
        client.switcherController.quiddityManager.getTreeInfo.should.have.been.calledOnce;
        client.switcherController.quiddityManager.getTreeInfo.should.have.been.calledWithExactly('quidd', 'path');
        cb.should.have.been.calledWithExactly(null, {});
    } );

    it( 'should return an error when manager throws', function () {
        client.switcherController.quiddityManager.getTreeInfo.throws();
        command('quidd', 'path', cb);
        client.switcherController.quiddityManager.getTreeInfo.should.have.been.calledOnce;
        client.switcherController.quiddityManager.getTreeInfo.should.have.been.calledWithExactly('quidd', 'path');
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when quiddity parameter is empty', function () {
        command('', 'path', cb);
        client.switcherController.quiddityManager.getTreeInfo.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when quiddity parameter is null', function () {
        command(null, 'path', cb);
        client.switcherController.quiddityManager.getTreeInfo.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when quiddity parameter is a number', function () {
        command(666, 'path', cb);
        client.switcherController.quiddityManager.getTreeInfo.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when quiddity parameter is not a string', function () {
        command(['not a string'], 'path', cb);
        client.switcherController.quiddityManager.getTreeInfo.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when path is empty', function () {
        command('quidd', '', cb);
        client.switcherController.quiddityManager.getTreeInfo.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when path is null', function () {
        command('quidd', null, cb);
        client.switcherController.quiddityManager.getTreeInfo.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when path is a number', function () {
        command('quidd', 666, cb);
        client.switcherController.quiddityManager.getTreeInfo.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );

    it( 'should return an error when path is not a string', function () {
        command('quidd', ['not a string'], cb);
        client.switcherController.quiddityManager.getTreeInfo.should.not.have.been.called;
        cb.should.have.been.calledWithMatch('');
    } );


} );