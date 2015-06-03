var chai      = require( "chai" );
var sinon     = require( "sinon" );
var sinonChai = require( "sinon-chai" );
var should    = chai.should();
chai.use( sinonChai );

module.exports = function () {
    return {
        verbose:  sinon.stub(),
        switcher: sinon.stub(),
        debug:    sinon.stub(),
        info:     sinon.stub(),
        warn:     sinon.stub(),
        error:    sinon.stub(),
        logback:  sinon.stub()
    };
};