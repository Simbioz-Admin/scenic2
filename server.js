var requirejs = require('requirejs');

requirejs({
    paths: {
        argv: './scenic/settings/optimist',
        config: './scenic/settings/config',
        log: './scenic/settings/log',
        scenicIo: './scenic/settings/scenic-io',
        switcher: './scenic/switcher/switcher',
    },
    config: {
        nodeRequire: require,
        baseUrl: __dirname,
        // shim: {
        //     "switcher": ["scenicIo"]
        // }
    },
});

requirejs(['./scenic/app', 'scenicIo'],
    function(app, scenicIo) {
        // var express = require('express'),
        //     http = require('http');

        // var app = express();
        // var server = http.createServer(app).listen(8095);

        // require('socket.io').listen(server); // Your app passed to socket.io
    }
);