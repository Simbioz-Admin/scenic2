define(
    [
        'config',
        'express',
        'http',
        'path'
    ],
    function(config, express, http, path) {

        console.log("set server express");

        var app = express(),
            server = http.createServer(app);

        //param necessary for access file and use authentification
        app.use("/assets", express.static("assets"));
        app.use("/js", express.static("js"));
        app.use("/templates", express.static("templates"));

        app.get('/', function(req, res) {
            res.sendfile('index.html');

        });

        return app;

    }
)