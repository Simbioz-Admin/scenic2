"use strict";

var npm = require("npm");
var fs = require('fs');
var spawn = require( 'child_process' ).spawn;
var pkg = require('../../package.json');

var config = require("./settings/config.js");
var cwd = __dirname;

module.exports = function( callback ) {
    // Create package installation directory
    if ( !fs.existsSync( config.scenicDependenciesPath ) ) {
        try {
            fs.mkdirSync( config.scenicDependenciesPath );
        } catch ( err ) {
            return callback( "Could not create directory: " + config.scenicDependenciesPath + " Error: " + err.toString() );
        }
    }

    // Create save file directory
    if ( !fs.existsSync( config.scenicSavePath ) ) {
        try {
            fs.mkdirSync( config.scenicSavePath );
        } catch ( err ) {
            return callback( "Could not create directory: " + config.scenicSavePath + " Error: " + err.toString() );
        }
    }

    // List current dependencies
    var dependencies = [];
    if ( pkg.dependencies ) {
        for ( var module in pkg.dependencies ) {
            dependencies.push( module + "@" + pkg.dependencies[module] );
        }
    }

    // Load installed dependencies and install missing
    npm.load( { prefix: config.scenicDependenciesPath }, function ( err, npm ) {
        if ( err ) return callback( err );

        npm.commands.ls( [], true, function ( err, data, lite ) {
            if ( err ) return callback( err );

            // List installed dependencies
            var installed = [];
            for ( var key in lite.dependencies ) {
                installed.push( lite.dependencies[key].from );
            }

            // Find the difference between the dependency list and installed packages.
            var missing = dependencies.filter( function ( dependency ) {
                if ( installed.indexOf( dependency ) == -1 ) {
                    console.log( "Missing dependency: " + dependency );
                    return true;
                } else {
                    return false;
                }
            } );

            // Load missing
            if ( missing.length > 0 ) {

                // Display notification
                try {
                    var notify = spawn( "notify-send", [
                        "--icon=" + cwd + "/client/assets/images/logo_sat.png",
                        "Scenic",
                        "Downloading and installing dependencies. Scenic will start automatically."
                    ] );
                } catch ( e ) {
                    console.log( "Could not display notification message, an error occured", e );
                }

                npm.commands.install( missing, function ( err, data ) {
                    if ( err ) return callback( err );
                    callback();
                } );
            } else {
                callback();
            }
        } );
    } );
};