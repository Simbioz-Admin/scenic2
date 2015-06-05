//noinspection BadExpressionStatementJS
({
    baseUrl:                 './',
    paths:                   {
        requirejs: '../../bower_components/requirejs/require',
        socketio: 'empty:'
    },
    include: [ 'requirejs' ],
    mainConfigFile:          'main.js',
    name:                    "main",
    out:                     'main.min.js',
    useStrict:               true,
    optimize:                "uglify2",
    preserveLicenseComments: false,
    generateSourceMaps:      true,
    uglify2:                 {
        output:   {
            beautify: false
        },
        compress: {
            sequences:   true,
            global_defs: {
                DEBUG: false
            }
        },
        warnings: false,
        mangle:   true
    }
})