/**
 *	@module Parameter settings of Expess
 *	@description express manage http request of server we define here the informations return.
 	Principally we return informations about quiddities, docs of switcher
 */

module.exports = function(config, $, _, app, scenic, switcher, scenicStart, log) {

    var express = require("express");


    app.get('/classes_doc/:className?/:type?/:value?', function(req, res) {

        if (req.params.type == "properties") {
            if (req.params.value) res.send($.parseJSON(switcher.get_property_description_by_class(req.params.className, req.params.value)));
            else res.send($.parseJSON(switcher.get_properties_description_by_class(req.params.className)));
        } else if (req.params.type == "methods") {
            if (req.params.value) res.send($.parseJSON(switcher.get_method_description_by_class(req.params.className, req.params.value)));
            else res.send($.parseJSON(switcher.get_methods_description_by_class(req.params.className)));
        } else if (req.params.className) {
            res.send($.parseJSON(switcher.get_class_doc(req.params.className)));
        } else {
            res.send($.parseJSON(switcher.get_classes_doc()));
        }
    });


    app.get('/quidds/:quiddName?/:type?/:value?/:val?', function(req, res) {
        if (req.params.val) {
            res.send($.parseJSON(switcher.get_property_value(req.params.quiddName, req.params.value)))
        } else if (req.params.type == "properties") {
            if (req.params.value) res.send($.parseJSON(switcher.get_property_description(req.params.quiddName, req.params.value)));
            else res.send($.parseJSON(switcher.get_properties_description(req.params.quiddName)));
        } else if (req.params.type == "methods") {
            if (req.params.value) res.send($.parseJSON(switcher.get_method_description(req.params.quiddName, req.params.value)));
            else res.send($.parseJSON(switcher.get_methods_description(req.params.quiddName)));
        } else if (req.params.quiddName) {
            res.send($.parseJSON(switcher.get_quiddity_description(req.params.quiddName)));
        } else {
            //return the quidds without the excludes
            var quidds = $.parseJSON(switcher.get_quiddities_description()).quiddities;
            var quiddsFiltered = [];
            _.each(quidds, function(quidd, index) {
                if (!_.contains(config.quiddExclude, quidd.class)) {
                    var properties = scenic.getQuiddPropertiesWithValues(quidd.name);
                    var methods = $.parseJSON(switcher.get_methods_description(quidd.name)).methods;
                    quidds[index]["properties"] = properties;
                    quidds[index]["methods"] = methods;
                    quiddsFiltered.push(quidds[index]);
                }

            });

            res.send(quiddsFiltered);
        }
    });


    app.get('/shmdatas', function(request, response) {
        response.contentType('application/json');
        response.send(scenic.getShmdatas());
    });

    app.get('/destinations', function(request, response) {
        response.contentType('application/json');
        var destinations = switcher.get_property_value("defaultrtp", "destinations-json");
        response.send(destinations);

    });
}