var npm = require("npm");
var config = require("./server_side/settings/config.js");
var scenicDependenciesPath = config.scenicDependenciesPath;
var scenicSavePath = config.scenicSavePath;
var fs = require('fs');
var cwd = __dirname;

//console.log(scenicSavePath);
////console.log("currend dir: " + __dirname);
if (!fs.existsSync(scenicDependenciesPath)) {
    try {
        fs.mkdirSync(scenicDependenciesPath);
    } catch (err) {
        //console.log("cannot create directory: ", err);
    }
}
if (!fs.existsSync(scenicSavePath)) {
    try {
        fs.mkdirSync(scenicSavePath);
    } catch (err) {
        //console.log("cannot create directory: ", err);
    }
}
var p = "./package.json";
var reported = [];
var http = require('http');
// var tmpBody = '<html><head><meta http-equiv="Content-Type" content="text/html" charset="UTF-8"/><link rel="stylesheet" type="text/css" href="assets/css/stylesheets/screen.css"></head><title>Scenic2</title><body><center>Verifying installation</p>';
var tmpBody = '<html><head><meta http-equiv="Content-Type" content="text/html" charset="UTF-8"/></head><title>Scenic2</title><body><center>Verifying installation</p>';
// <img src="blacksmiths.gif"/>';
// TODO: clean this code
var tmpServer = http.createServer(function(req, res) {
    var imgPath = __dirname + '/assets/images/blacksmiths.gif';
    fs.readFile(imgPath, function(error, file) {
        var response_content_type = null;
        if (req.url.indexOf(".css") != -1 && req.headers.accept.indexOf("text/css") != -1) {
            response_content_type = "text/css";
        }
        ////console.log("Reading file: ", file);
        var imagedata = file.toString('base64');
        res.writeHead(200, {
            'Content-Type': 'text/html' //,
            //'Content-Length': tmpBody.length
        });
        //res.write("Boo");
        ////console.log(imagedata);
        res.write('<head><meta http-equiv="Content-Type" content="text/html" charset="UTF-8"/><link rel="stylesheet" type="text/css" href="assets/css/stylesheets/screen.css"></head><title>Scenic2</title><br/><center>Installing components<br/><img src="data:blacksmiths.gif;base64,' + imagedata + '"/></center>');
        res.end('</center></body></html>');
    });
});
tmpServer.listen(8096, '127.0.0.1');
//console.log('Server running at http://127.0.0.1:8096/');
Array.prototype.difference = function(ar) {
    return this.filter(function(i) {
        return !(ar.indexOf(i) > -1);
    });
}

function createNpmDependenciesArray(packageFilePath) {
    var pkg = require(packageFilePath);
    if (!pkg.dependencies) return [];

    var deps = [];
    for (var mod in pkg.dependencies) {
        deps.push(mod + "@" + pkg.dependencies[mod]);
    }
    //console.log("We have this depndencies array: ", deps);
    return deps;
}

////console.log(createNpmDependenciesArray(p));

function returnInstalled(stuff) {
    reported = stuff;
    scenicRequire(createNpmDependenciesArray(p), reported);
    console.log("returnInstalled returns: ", stuff);
    return reported;
}

function scenicDependenciesSearch(dependencies, callback) {
    var installed = new Array();
    npm.load({
        prefix: scenicDependenciesPath
    }, function(err, npm) {
        console.log("npm.load ")
        npm.commands.ls([], true, function(err, data, lite) {
            if (err) console.log("npm.ls returned this error: ", err);
            //console.log("lite's length: ", data);
            for (var key in lite.dependencies) {
                console.log(lite.dependencies[key].from);
                installed.push(lite.dependencies[key].from);
            }
            //console.log("These packages are already installed", installed);
            for (var i = 0; i < installed.length; i++) {
                console.log("Detected: " + installed[i]);
            }

            callback(installed);
        });
    });
}

var done = scenicDependenciesSearch(createNpmDependenciesArray(p), returnInstalled);

function scenicRequire(deps, installed, callback) {
    console.log("scenicRequire fired");
    var dependencies = deps;
    var installed = installed;
    console.log("dependencies : ", dependencies);
    console.log("installed : ", installed);
    // find the difference between the dependency list and installed packages.
    // it compares package versions!!!
    var toInstall = dependencies.difference(installed)
    console.log("to install : ", toInstall);
    var spawn = require('child_process').spawn
    if (toInstall.length) {
        try {
            var notify = spawn("notify-send", [
                "--icon=" + cwd + "/assets/images/logo_sat.png",
                "Scenic2",
                "Downloading and installing dependencies. Scenic2 will start automatically"
            ]);
            notify.on("close", function notifyExit(code) {
                console.log("Notify exited with code: ", code);
            });
            notify.stderr.on('data', function notifyData(data) {
                console.log("notify error: ", data.toString());
            });
            notify.on('error', function onError(error) {
                console.log("There was an error", error);
                console.log("message was not displayed to the user");
            });
        } catch (e) {
            console.log("An ", e, "occured. Not displying a notify message");
        }
        // var chrome = spawn("chromium-browser", [" --app=http://localhost:8096", "--window-size=300,400"], {
        //     detached: true,
        //     stdio: ['ignore', null, null]
        // });
        // chrome.unref();
        // chrome.on('close', function(code) {
        //     tmpServer.close();
        //     spawn("./scenic2");
        //     process.exit();
        // });
        npm.load({
            prefix: scenicDependenciesPath
        }, function(err) {
            if (err) {
                console.log("npm.load reported an error: ", err);

            }
            npm.commands.install(toInstall, function(er, data) {
                if (er) console.log("npm.commands.install error:", er);
                if (data) console.log("npm.commands.installed data: ", data);
                //         chrome.kill('SIGHUP');
                tmpServer.close();
                spawn("./scenic2");
                //process.exit();
            });

        });
    } else {
        console.log("nothing to install");
        //chrome.kill('SIGHUP');
        tmpServer.close();
        spawn("./scenic2");
    }
}