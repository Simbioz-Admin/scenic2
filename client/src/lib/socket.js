define( [
    'socketio'
], function( socketio ) {
    //localStorage.debug = '*';
    return socketio.connect();
});