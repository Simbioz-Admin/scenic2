
module.exports = function (config, $, _, app, scenic, switcher, scenicStart)
{
	var express = require("express");

	// ------------------------------------ EXPRESS CONFIGURATION ---------------------------------------------//

	app.get('/classes_doc/:className?/:type?/:value?', function(req, res)
	{

		if(req.params.type == "properties")
		{
			if(req.params.value) 	res.send($.parseJSON(switcher.get_property_description_by_class(req.params.className, req.params.value)));
			else 					res.send($.parseJSON(switcher.get_properties_description_by_class(req.params.className)));
		}
		else if(req.params.type == "methods")
		{
			if(req.params.value)	res.send($.parseJSON(switcher.get_method_description_by_class(req.params.className, req.params.value)));
			else					res.send($.parseJSON(switcher.get_methods_description_by_class(req.params.className)));
		}
		else if(req.params.className)
		{
			res.send($.parseJSON(switcher.get_class_doc(req.params.className)));
		}
		else
		{
			if(req.query.category) res.send(scenic.get_classes_docs_type(req.query.category));
			else res.send($.parseJSON(switcher.get_classes_doc()));
		}
	});


	app.get('/quidds/:quiddName?/:type?/:value?/:val?', function(req, res)
	{
		if(req.params.val)
		{
			res.send($.parseJSON(switcher.get_property_value(req.params.quiddName, req.params.value)))
		}
		else if(req.params.type == "properties")
		{	
			if(req.params.value)	res.send($.parseJSON(switcher.get_property_description(req.params.quiddName, req.params.value)));
			else						res.send($.parseJSON(switcher.get_properties_description(req.params.quiddName)));
	  	}
		else if(req.params.type == "methods")
		{
			if(req.params.value)	res.send($.parseJSON(switcher.get_method_description(req.params.quiddName, req.params.value)));
			else					res.send($.parseJSON(switcher.get_methods_description(req.params.quiddName)));
		}
	  	else if(req.params.quiddName)
	  	{
			res.send($.parseJSON(switcher.get_quiddity_description(req.params.quiddName)));
	  	}
	  	else
	  	{
	  		//return the quidds without the excludes
	  		var quidds = $.parseJSON(switcher.get_quiddities_description()).quiddities;
	  		var quiddsFiltered = [];
	  		_.each(quidds, function(quidd, index)
	  		{
	  			if(!_.contains(config.quiddExclude, quidd.class)) quiddsFiltered.push(quidds[index]);
	  		});

			res.send(quiddsFiltered);
	  	}
	});

	app.get('/methods_doc', function(request, response) {
	  response.contentType('application/json');
	  response.send(scenic.getQuidditiesWithMethods());
	});

	app.get('/shmdatas', function(request, response) {
	  response.contentType('application/json');
	  response.send(scenic.getShmdatas());
	});

	app.get('/destinations', function(request, response) {
		response.contentType('application/json');
		//TODO : Fix segmentation fault with get_property_value("defautltrtp");
		var destinations =  switcher.get_property_value("defaultrtp", "destinations-json");
		response.send(destinations);

	});	
}