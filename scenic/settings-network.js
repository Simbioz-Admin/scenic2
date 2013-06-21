module.exports = function (config, log)
{

	var portchecker = require("portchecker");
	var os = require('os');


	//*** check if port soap is in use ***//
	
	function checkPort(port, callback)
	{
		portchecker.isOpen(port, config.host, function(isOpen)
		{ 
			if(isOpen)
			{
				portchecker.getFirstAvailable(8084, 8090, config.host, function(newPort, host)
				{
					log("info", "Port "+port+" is already in use. the new port is "+newPort);
					callback(newPort); 
				});
			}
			else
			{
				callback(port);
			}
		});
	}


	//*** Get local address of the host ***//

	var interfaces = os.networkInterfaces();
	var addresses = [];
	for (k in interfaces) {
	    for (k2 in interfaces[k]) {
	        var address = interfaces[k][k2];
	        if (address.family == 'IPv4' && !address.internal) {
	            addresses.push(address.address)
	        }
	    }
	}

	config.host = addresses[0];

	return {
		checkPort : checkPort 
	}
}