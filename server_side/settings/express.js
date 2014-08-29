define(
    [
        'config',
        'express',
        'path',
        'switcher',
        'node_switcher',
        'underscore',
        'jquery'
    ],
    function(config, express, path, nodeSwitcher, switcher, _, $) {

        var app = express();

        //param necessary for access file and use authentification
        app.use("/assets", express.static("assets"));
        app.use("/client_side", express.static("client_side"));
        app.use("/templates", express.static("templates"));

        app.get('/', function(req, res) {
            if (!config.passSet) {
                res.sendfile('index.html');
            } else {
                config.passSet.apply(req, res, function(username) {
                    res.sendfile('index.html');

                });
            }

        });


        app.get('/classes_doc/:className?/:type?/:value?', function(req, res) {

            if (req.params.type == "properties") {
                if (req.params.value) res.send($.parseJSON(nodeSwitcher.get_property_description_by_class(req.params.className, req.params.value)));
                else res.send($.parseJSON(nodeSwitcher.get_properties_description_by_class(req.params.className)));
            } else if (req.params.type == "methods") {
                if (req.params.value) res.send($.parseJSON(nodeSwitcher.get_method_description_by_class(req.params.className, req.params.value)));
                else res.send($.parseJSON(nodeSwitcher.get_methods_description_by_class(req.params.className)));
            } else if (req.params.className) {
                res.send($.parseJSON(nodeSwitcher.get_class_doc(req.params.className)));
            } else {
                res.send($.parseJSON(nodeSwitcher.get_classes_doc()));
            }
        });


        app.get('/quidds/:quiddName?/:type?/:value?/:val?', function(req, res) {
            if (req.params.val) {
                res.send($.parseJSON(nodeSwitcher.get_property_value(req.params.quiddName, req.params.value)))
            } else if (req.params.type == "properties") {
                if (req.params.value) res.send($.parseJSON(nodeSwitcher.get_property_description(req.params.quiddName, req.params.value)));
                else res.send($.parseJSON(nodeSwitcher.get_properties_description(req.params.quiddName)));
            } else if (req.params.type == "methods") {
                if (req.params.value) res.send($.parseJSON(nodeSwitcher.get_method_description(req.params.quiddName, req.params.value)));
                else res.send($.parseJSON(nodeSwitcher.get_methods_description(req.params.quiddName)));
            } else if (req.params.quiddName) {
                res.send($.parseJSON(nodeSwitcher.get_quiddity_description(req.params.quiddName)));
            } else {
                //return the quidds without the excludes
                var quidds = $.parseJSON(nodeSwitcher.get_quiddities_description()).quiddities;
                var quiddsFiltered = [];
                _.each(quidds, function(quidd, index) {
                    if (!_.contains(config.quiddExclude, quidd.class)) {
                        var properties = switcher.quidds.get_properties_values(quidd.name);
                        var methods = $.parseJSON(nodeSwitcher.get_methods_description(quidd.name)).methods;
                        quidds[index]["properties"] = properties;
                        quidds[index]["methods"] = methods;
                        quiddsFiltered.push(quidds[index]);
                    }

                });

                res.send(quiddsFiltered);
            }
        });


        app.get('/destinations', function(request, response) {
            response.contentType('application/json');
            var destinations = nodeSwitcher.get_property_value("defaultrtp", "destinations-json");
            response.send(destinations);

        });

        /* temporary create fake values for users */

        app.get('/users', function(req, res) {
            res.contentType('application/json');
            var listUsers = switcher.sip.getListUsers();
            res.send(listUsers);
        })

        return app;

    }
)