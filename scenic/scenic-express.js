
module.exports = function (config, $, _, app, scenic, dir, scenicStart)
{
	var express = require("express");

	console.log(dir);



	// ------------------------------------ EXPRESS CONFIGURATION ---------------------------------------------//

	app.get('/classes_doc/:className?/:type?/:value?', function(req, res){

		if(req.params.type == "properties")
		{
			if(req.params.value) 	res.send(scenic.get_property_description_by_class(req.params.className, req.params.value));
			else 					res.send(scenic.get_properties_description_by_class(req.params.className));
		}
		else if(req.params.type == "methods")
		{
			if(req.params.value)	res.send(scenic.get_method_description_by_class(req.params.className, req.params.value));
			else					res.send(scenic.get_methods_description_by_class(req.params.className));
		}
		else if(req.params.className)
		{
			res.send(scenic.get_class_doc(req.params.className));
		}
		else
		{
			if(req.query.category) res.send(scenic.get_classes_docs_type(req.query.category));
			else res.send(scenic.get_classes_docs());
		}
	});



	app.get('/quidds/:quiddName?/:type?/:value?/:val?', function(req, res)
	{
		if(req.params.val)
		{
			res.send(scenic.get_property_value(req.params.quiddName, req.params.value))
		}
		else if(req.params.type == "properties")
		{	
			if(req.params.value)	res.send(scenic.get_property_description(req.params.quiddName, req.params.value))
			else						res.send(scenic.get_properties_description(req.params.quiddName));
	  	}
		else if(req.params.type == "methods")
		{
			if(req.params.value)	res.send(scenic.get_method_description(req.params.quiddName, req.params.value));
			else					res.send(scenic.get_methods_description(req.params.quiddName));
		}
	  	else if(req.params.quiddName)
	  	{
			res.send(scenic.get_quiddity_description(req.params.quiddName));
	  	}
	  	else
	  	{
	  		//return the quidds without the excludes
	  		var quidds = scenic.getQuidds();
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
	  response.send(scenic.get_property_value("defaultrtp", "destinations-json"));
	});	
}