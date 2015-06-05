var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var gulpSequence = require('gulp-sequence');

var requirejsOptimize = require('gulp-requirejs-optimize');
var compass = require('gulp-compass');

var buildPath = path.join(__dirname, 'build' );
var buildPathPublic = path.join(buildPath, 'public' );


/**
 * Default task
 */
gulp.task('default', gulpSequence( 'requirejs', 'compass', 'copy' ) );

/**
 * Build RequireJS sources
 */
gulp.task( 'requirejs', function() {
    return gulp.src('client/src/main.js')
        .pipe(requirejsOptimize({
                             baseUrl                : 'client/src/',
                             paths                  : {
                                 socketio: 'empty:'
                             },
                             mainConfigFile         : 'client/src/main.js',
                             name                   : "main",
                             out                    : 'main.min.js',
                             useStrict              : true,
                             optimize               : "uglify2",
                             preserveLicenseComments: true, // Must be false with source maps
                             generateSourceMaps     : false, // Doesn't work with gulp
                             uglify2                : {
                                 output  : {
                                     beautify: false
                                 },
                                 compress: {
                                     sequences  : true,
                                     global_defs: {
                                         DEBUG: false
                                     }
                                 },
                                 warnings: false,
                                 mangle  : true
                             }
                         }))
        .pipe(gulp.dest(buildPathPublic));
});

/**
 * Builds stylesheets
 */
gulp.task('compass', function() {
    gulp.src('client/assets/scss/**/*.scss')
        .pipe(compass({
            config_file: 'config.rb',
            project: path.join(__dirname, 'client/assets/'),
            css: path.join(buildPathPublic, 'css'),
            sass: 'scss',
            sourcemap: false
        }))
        .pipe(gulp.dest(buildPathPublic));
});

/**
 * Copy required files to destination
 */
gulp.task( 'copy', function( cb ) {
    return gulpSequence('copy-requirejs', 'copy-assets', 'copy-scenic', cb );
});

gulp.task( 'copy-requirejs', function() {
    return gulp.src('bower_components/requirejs/require.js').pipe(gulp.dest(buildPathPublic));
});

gulp.task( 'copy-assets', function( cb ) {
    return gulpSequence('copy-images', 'copy-locales', cb);
});

gulp.task( 'copy-images', function() {
    return gulp.src('client/assets/images/**/*').pipe(gulp.dest(path.join(buildPathPublic, 'assets/images')));
});

gulp.task( 'copy-locales', function() {
    return gulp.src('locales/**/*').pipe(gulp.dest(path.join(buildPathPublic, 'locales')));
});

gulp.task( 'copy-scenic', function(cb) {
    return gulpSequence( 'copy-scenic-app', 'copy-scenic-templates', cb );
});

gulp.task( 'copy-scenic-app', function() {
    return gulp.src('server/src/**/*').pipe(gulp.dest(buildPath));
});

gulp.task( 'copy-scenic-templates', function() {
    return gulp.src('server/templates/**/*').pipe(gulp.dest(path.join(buildPath, 'templates')));
});

/**
 * Clean after ourselves
 */
gulp.task( 'clean', function(cb) {
    del([

    ], cb);
});