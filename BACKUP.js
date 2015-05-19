//Model control_property
idAttribute: "name",
    defaults: {
    "name": null,
        "property": null,
        "quiddName": null
}
socket.emit("removeValuePropertyOfDico", "controlDestinations", that.get("name"));

// Model destinationRtp

defaults: {
    "id": null,
        "name": null,
        "hostName": null,
        "portSoap": null,
        "data_streams": [],
        "in_tab": true
}

socket.emit("remove_destination", that.get("id"), that.get("portSoap"), function(data) {
    if (data.error) {
        return views.global.notifications("error", data.error);
    }
});

/* Called when user leave a class Quiddity with device autodetect */

leaveAutoDetect: function () {
    clearTimeout( this.delayAutoDetect );
},

/* called when we can know if there are any device connected to the quiddity */

autoDetect: function ( element ) {
    /* we need to put the autodetect in timeout for not trigg directly when the mouse hover the menu */
    this.delayAutoDetect = setTimeout( function () {

        //create temporary v4l2 quiddity for listing device available
        var className = $( element.target ).data( "name" );

        /* get  the information about the device in property value of quiddity */
        socket.emit( "get_property_by_class", className, "device", function ( property ) {
            if ( property ) {
                var deviceDetected = property["values"];
                //clean list existing and add the new
                $( "#deviceDetected" ).remove();
                $( "[data-name='" + className + "']" ).append( "<ul id='deviceDetected'></ul>" );
                _.each( deviceDetected, function ( device ) {
                    var li = $( "<li></li>", {
                        text:  device["name"] + " " + device["nick"],
                        class: 'source',
                        data:  {
                            name:           className,
                            devicedetected: device["value"]
                        },
                    } );
                    $( "#deviceDetected" ).append( li );
                } );
            } else {
                views.global.notification( "error", "no video device" );
            }
        } );

    }, 500 );
},