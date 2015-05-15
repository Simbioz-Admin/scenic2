// When shmdata is removed
//If the shmdata is a type reader (connection) we refresh shmdata source
if ( shmdata.type == 'reader' ) {
    //var quiddSource = shmdata.path.split('_')[2];
    self.findQuiddByShmdata( shmdata.path, function ( quidd ) {
        quidd.trigger( "updateConnexions" );
    } );
    //quidd = collections.quidds.get(quiddSource);
}

var quiddity = self.get( qname );
var shmdatas = quiddity.get( "shmdatas" );
var shmdata  = shmdatas.get( shmdata.path );
shmdata.trigger( 'destroy', shmdata );



//when adding a shmdata colection did
if ( shmdata.type == 'writer' ) {
    this.trigger( "updateShmdatas" );
    this.trigger( "updateConnexions" );
}


//when shmdata active changes, does not seem to be used
/** Event called when the shmdatas readers is updated */
socket.on( "update_shmdatas_readers", function ( name, shmdatas ) {
    /* we parse connection for add or remove */
    // var shmdatas = $.parseJSON(shmdatas);
    $( "[data-destination='" + name + "']" ).each( function ( index, box ) {
        $( box ).removeClass( "active" ).addClass( 'inactive' );
        var path = $( box ).parent().data( "path" );
        _.each( shmdatas, function ( shm, name ) {
            if ( name == path ) {
                $( box ).removeClass( 'inactive' ).addClass( "active" );
            }
        } );
    } );
} );


//when a quiddity is destroyed
/* sometimes quidd is destination and have connection need to be remove */
$( "[data-hostname='" + self.get( "name" ) + "']" ).remove();

/* check if the panel open is for the quiddity deleted */
if ( self.get( "name" ) == $( "#inspector" ).data( 'quiddName' ) ) {
    views.global.closePanel();
}