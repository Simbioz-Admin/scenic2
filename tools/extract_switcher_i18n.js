var _           = require( 'underscore' );
var async       = require( 'async' );
var path        = require( 'path' );
var fs          = require( 'fs' );
var switcherLib = require( 'switcher' );
var i18next     = require( 'i18next' );
var argv        = require( 'optimist' ).argv;

/**
 * Help
 */
if ( argv.h || argv.helper ) {
    var message = "Switcher i18n Extractor\n";
    message += "----------------------------------------------------------\n";
    message += rpad( '-o, --output', 25 ) + "Output file\n";
    console.log( message );
    process.exit();
}

var output;
if ( !argv.o && !argv.output ) {
    console.error( 'Missing output file parameter.' );
    process.exit(1);
}

output = ( argv.o || argv.output );
output = path.join(path.dirname(__dirname), output);
var dir = path.dirname( output );
try {
    if ( !fs.existsSync( dir ) ) {
        fs.mkdirSync( dir );
    }
} catch (e) {
    console.error(e);
    process.exit(1);
}

var switcher = new switcherLib.Switcher( 'translations', console.log );
var strings = "// Extracted Switcher strings\n// You can safely remove that file it is a byproduct of the build process.\n\n";

function add( str ) {
    console.log( 'Adding string: ', str );
    if ( str ) {
        strings += 'i18n' + '.' + 't(\'' + str + '\');\n';
    }
}

async.series( [

    function ( callback ) {
        console.log( 'Extracting strings');
        var classesDoc = switcher.get_classes_doc().classes;
        _.each( classesDoc, function ( classDoc ) {
            add( classDoc['long name'] );
            add( classDoc['category'] );
            add( classDoc['description'] );
            var className = classDoc['class name'];
            try {
                var propertiesByClass = switcher.get_properties_description_by_class( className );
                if ( propertiesByClass.properties ) {
                    _.each( propertiesByClass.properties, function ( prop ) {
                        add( prop['long name'] );
                        add( prop['short description'] );
                        if ( prop['type'] == 'enum' ) {
                            _.each( prop['values'], function ( value ) {
                                add( value['name'] );
                            } );
                        }
                    } );
                }
            } catch ( e ) {
                console.error( 'PROPERTY ERROR:', className, e );
            }
            try {
                var methodsByClass = switcher.get_methods_description_by_class( className );
                if ( methodsByClass.methods ) {
                    _.each( methodsByClass.methods, function ( prop ) {
                        add( prop['long name'] );
                        add( prop['description'] );
                        _.each( prop['arguments'], function ( arg ) {
                            add( prop['long name'] );
                            add( prop['description'] );
                        } );
                    } );
                }
            } catch ( e ) {
                console.error( 'METHOD ERROR:', className, e );
            }
        } );
        callback();
    },

    function ( callback ) {
        console.log('Saving file');
        fs.writeFile( output, strings, callback );
    }

], function ( error ) {
    if ( error ) {
        console.error( error );
    } else {
        console.log( 'Finished!' );
    }
    switcher.close();
    process.exit();
} );