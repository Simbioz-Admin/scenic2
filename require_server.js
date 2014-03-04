var requirejs = require('requirejs');

requirejs({
    config: {
        nodeRequire: require,
        baseUrl: __dirname,
    },
    paths: {
        log: './scenic/settings/log',
        argv: './scenic/settings/optimist',
        config: './scenic/settings/config'
    }
});

requirejs(['./scenic/app'],
    function() {}
);