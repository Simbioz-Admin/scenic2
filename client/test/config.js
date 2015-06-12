var requirejs = require( "requirejs" );
var chai      = require( "chai" );
var sinon     = require( "sinon" );
var sinonChai = require( "sinon-chai" );
var should    = chai.should();
chai.use( sinonChai );

requirejs.config( {
    baseUrl:        './client/src/',
    mainConfigFile: './client/src/main.js',
    nodeRequire:    require,
    packages:       [
        {
            name:     'crypto-js',
            location: '../bower_components/crypto-js/',
            main:     'index'
        }
    ],
    paths:          {
        text:       '../../bower_components/requirejs-text/text',
        socketio:   '../test/mock/socket', // Served by the socket.io server, needs a build path to be set to 'empty:' in the build configuration
        underscore: '../../bower_components/underscore/underscore',
        backbone:   '../../bower_components/backbone/backbone',
        marionette: '../../bower_components/marionette/lib/backbone.marionette',
        mutators:   '../../bower_components/backbone.mutators/backbone.mutators.min',
        async:      '../../bower_components/async/lib/async',
        jquery:     '../../bower_components/jquery/dist/jquery.min',
        jqueryui:   '../../bower_components/jquery-ui/jquery-ui.min',
        punch:      '../../bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.min',
        spin:       '../../bower_components/spin.js/spin',
        i18n:       '../../bower_components/i18next/i18next.min'
    }
} );