var _        = require( 'underscore' );
var async    = require( 'async' );
var fs    = require( 'fs' );
var switcher = require( 'switcher' );
var i18next  = require( 'i18next' );

switcher.register_log_callback(console.log);

var namespace = 'switcher';

var translations = "";

function add( str ) {
    console.log( 'Adding', str );
    if ( str ) {
        translations += 'i18n' + '.' + 't(\'' + namespace + ':::' + str + '\');';
    }
}

async.series( [

    function ( callback ) {
        i18next.init( {
            lng: "fr",
            saveMissing:   true,
            ns:            'switcher',
            resGetPath:    'locales/__lng__/__ns__.json',
            resSetPath:    'locales/__lng__/__ns__.json',
            sendMissingTo: 'fr',
            keyseparator:  "::",
            nsseparator:   ':::',
            debug:         true
        }, function( ) {
            callback();
        } );
    },

    function ( callback ) {
        var classesDoc = JSON.parse( switcher.get_classes_doc() ).classes;
        _.each( classesDoc, function ( classDoc ) {
            add( classDoc['long name'] );
            add( classDoc['category'] );
            add( classDoc['description'] );
            var className = classDoc['class name'];
            try {
                var propertiesByClass = JSON.parse( switcher.get_properties_description_by_class( className ) );
                console.log(propertiesByClass);
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
                console.error('PROPERTY ERROR:', className, e);
                callback( e );
            }
            try {
                var methodsByClass = JSON.parse( switcher.get_methods_description_by_class( className ) );
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
                console.error('METHOD ERROR:', className, e);
                callback( e );
            }
        } );
    },

    function( callback ) {
        //SAVE TO FILE
    }

], function ( error ) {
    if ( error ) {
        console.error( error );
    } else {
        console.log( 'Finished!' );
    }
    process.exit();
} );