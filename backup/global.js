
                remove_save: function ( e ) {
                    var name = $( e.target ).data( "name" );
                    socket.emit( "remove_save", name, function ( error ) {
                        if ( error ) {
                            //TODO: Handle error
                        } else {
                            $( e.target ).parent().remove();
                        }
                    } )
                }