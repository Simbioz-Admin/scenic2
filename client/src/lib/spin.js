define( [
    'spin'
], function ( Spinner ) {
    var opts = {
        lines:     13, // The number of lines to draw
        length:    30, // The length of each line
        width:     8, // The line thickness
        radius:    30, // The radius of the inner circle
        corners:   1, // Corner roundness (0..1)
        rotate:    0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color:     '#fff', // #rgb or #rrggbb or array of colors
        speed:     1, // Rounds per second
        trail:     60, // Afterglow percentage
        shadow:    false, // Whether to render a shadow
        hwaccel:   true, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex:    2e9, // The z-index (defaults to 2000000000)
        top:       '50%', // Top position relative to parent
        left:      '50%' // Left position relative to p
    };
    return function () {
        if ( $( '#spinner-container' ).length == 0 ) {
            $( 'body' ).append( '<div id="spinner-container"></div>' );
        }
        var container = $( '#spinner-container' );
        container.hide();
        var spinner   = new Spinner( opts ).spin( container.get( 0 ) );
        container.fadeIn(250);
        return function () {
            container.fadeOut(250, function() {
                spinner.stop();
                $( '#spinner-container' ).remove();
            });
        }
    }
} );