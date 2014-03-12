var npm = require("npm");
var scenicDependenciesPath = process.env.HOME + "/.scenic2";
var p = "./package.json";
var reported = [];

var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<html><head><link rel="stylesheet" type="text/css" href="./assets/css/stylesheets/screen.css"></head><title>Scenic2</title><body><center>Veryfying installation<p>Please be patient</p></center></body></html>');
}).listen(8095, '127.0.0.1');
console.log('Server running at http://127.0.0.1:8095/');
var spawn = require('child_process').spawn
var chrome = spawn("chromium-browser", [" --app=http://localhost:8095", "--window-size=300,300"], {
    detached: true,
    stdio: [ 'ignore', null, null ]
});
chrome.unref();
chrome.on('close', function(code){
    process.exit();
});

Array.prototype.difference = function(ar) {
    return this.filter(function(i) {
        return !(ar.indexOf(i) > -1);
    });
}

function createNpmDependenciesArray (packageFilePath) {
    var pkg = require(packageFilePath);
    if (!pkg.dependencies) return [];

    var deps = [];
    for (var mod in pkg.dependencies) {
        deps.push(mod + "@" + pkg.dependencies[mod]);
    }
    console.log("We have this depndencies array: ", deps);
    return deps;
}

//console.log(createNpmDependenciesArray(p));

function returnInstalled(stuff) {
    reported = stuff;
    scenicRequire(createNpmDependenciesArray(p),reported );
    return stuff;
}

function scenicDependenciesSearch(dependencies, callback) { 
    var installed = new Array();
    npm.load({prefix: scenicDependenciesPath}, function(err, npm) {
        console.log("npm.load ")
        npm.commands.ls([], true, function(err, data, lite){
            if (err) console.log(err);
            console.log("lite's length: ", data);
            for(var key in lite.dependencies){
                console.log(lite.dependencies[key].from);
                installed.push(lite.dependencies[key].from);
            }
            console.log(installed);
            for(var i=0; i < installed.length; i++) {
                console.log("Detected: " + installed[i]);
            }
            
            callback(installed);
        });
    });
}

var done = scenicDependenciesSearch(createNpmDependenciesArray(p), returnInstalled);

function scenicRequire (deps, installed, callback) {
    console.log("scenicRequire fired");
    var dependencies = deps;
    var installed = installed;
    console.log("dependencies : ", dependencies);
    console.log("installed : ", installed);
    // find the difference between the dependency list and installed packages.
    // it compares package versions!!!
    var toInstall = dependencies.difference(installed)
    console.log("to install : " , toInstall);
    if (toInstall.length > 0) {
        npm.load({prefix: scenicDependenciesPath}, function(err, npm) {
            npm.config.set("prefix", scenicDependenciesPath);
            npm.load({prefix: scenicDependenciesPath}, function(err) {
                npm.commands.install(toInstall, function (er, data) {
                    console.log(data);
                    chrome.kill('SIGHUP');
                    spawn("./scenic2");
                });
            });
        });
    } else {
        console.log("nothing to install");
        chrome.kill('SIGHUP');
        spawn("./scenic2");
    }
}

