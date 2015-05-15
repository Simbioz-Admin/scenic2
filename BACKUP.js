// source.js

/* called when we want to have a preview of the quiddity (audio or video) */

"click .preview": "preview",
preview: function(element) {
    this.model.preview(element);
    $(element.target).toggleClass('active').toggleClass('inactive');
}
setPreview: function(shmdata) {

    var that = this;

    //get info about vumeter for know if we can create a preview
    collections.quiddities.getPropertyValue("vumeter_" + shmdata.path, "caps", function(info) {
        info = info.split(",");

        if (info[0] == "audio/x-raw-int" || info[0] == "audio/x-raw-float" || info[0] == "video/x-raw-yuv" || info[0] == "video/x-raw-rgb") {

            var type = (info[0].indexOf("video") >= 0 ? "gtkvideosink" : "pulsesink");
            //check if the quiddity have already a preview active
            socket.emit("get_quiddity_description", that.model.get("name") + type, function(quiddInfo) {
                var active = (quiddInfo.name ? "active" : "inactive");
                $("[data-path='" + shmdata.path + "'] .nameInOut .short").append("<div class='preview " + active + "'></div>");
            });
        }
    });

},

//sourceProperty

"click .preview": "preview",
preview: function(element) {
    this.model.preview(element);
},


//quidds.js
addPreviewIcon:    function ( quidd ) {
    var that    = this
    var shmdata = quidd.split( '_' );
    shmdata     = shmdata[1] + "_" + shmdata[2] + "_" + shmdata[3] + "_" + shmdata[4];

    var IntervalPreviewExisting = setInterval( function () {
        if ( $( "[data-path='" + shmdata + "'] .preview" ).length > 0 ) {
            window.clearInterval( IntervalPreviewExisting );
            $( "[data-path='" + shmdata + "'] .preview" ).removeClass( 'inactive' ).addClass( "active" );
        }
    }, 500 );
}

/* called when a quiddity type previe audio video is removed for remove class active to icon Preview */
removePreviewIcon: function ( quidd ) {
    var shmdata = quidd.split( '_' );
    shmdata     = shmdata[1] + "_" + shmdata[2] + "_" + shmdata[3] + "_" + shmdata[4];
    $( "[data-path='" + shmdata + "'] .preview" ).removeClass( "active" ).addClass( 'inactive' );
},

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


//in quiddity
/**
 *  Allows viewing of video quiddities type and audio
 */

preview: function ( element ) {
    var path = $( element.target ).closest( 'tr' ).data( "path" ),
        type = null,
        that = this;

    /* The information needed to create a preview is present in the vumeter create with each quiddity  */
    collections.quiddities.getPropertyValue( "vumeter_" + path, "caps", function ( info ) {
        info = info.split( "," );
        if ( info[0].indexOf( "video" ) >= 0 ) {
            type = "gtkvideosink";
        }
        if ( info[0].indexOf( "audio" ) >= 0 ) {
            type = "pulsesink";
        }

        //check if the quiddity have already a preview active
        socket.emit( "get_quiddity_description", type + "_" + path, function ( err, quiddInfo ) {
            if ( err && type != null ) {
                socket.emit( "create", type, type + "_" + path, function ( err, quiddInfo ) {
                    socket.emit( "invoke", quiddInfo.name, "connect", [path] );
                } );
            } else {
                socket.emit( "remove", type + "_" + path );
            }

        } );

    } );

},