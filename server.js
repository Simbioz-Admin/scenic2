var fs = require('fs')
if (!fs.existsSync(process.env.HOME + "/.scenic2")) {
    console.log("~/.scenic2 does not exist, running the installer")
    var scenic = require('child_process').spawn
    var installer = scenic(__dirname + "/scenic2-installer")
    installer.on('close', function() {
        scenic("notify-send", ["Scenic2", "Components installed. You may now run scenic"])
    });
    return;
}

var requirejs = require('requirejs');


requirejs({
    paths: {
        argv: './scenic/settings/optimist',
        config: './scenic/settings/config',
        log: './scenic/settings/log',
        scenicIo: './scenic/settings/scenic-io',
        switcher: 'switcher',
        node_switcher: './scenic/switcher/switcher',
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
    function(app, scenicIo) {}
);