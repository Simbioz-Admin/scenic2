var socket = io.connect();

var tempi = {

	"messageInlet" : function(arguments){
		console.log("ask for set attribute"+arguments[1]+" to "+arguments[0]);
		console.log(arguments);
		socket.emit("messageInlet", arguments);
	},
	"setIsActiveConnection" : function(id, state){
		console.log("ask for change state connection");
		socket.emit("setIsActiveConnection", id, state);
	},
	//ask for the list of Outlets of specific node
	"listNodeOutletsInlets" : function(node){
		socket.emit("listNodeOutletsInlets", node);
	},
	//ask for the list of Inlets of specific node 
	"listNodeAttributes" : function(node){
		socket.emit("listNodeAttributes", node);
	},
	"observeOutlet" : function(from, outlet){
		socket.emit("observeOutlet", from, outlet);
	},
	"stopObservingOutlet" : function(from, outlet){
		socket.emit("stopObservingOutlet", from, outlet);
	},
	"getUniqueId" : function(callback){
		socket.emit("getUniqueId", "bang", function(idReceive){
			callback(idReceive);
		});
	},
	"saveGraph" : function(fileName){
		socket.emit("saveGraph", fileName);
	}
	
}