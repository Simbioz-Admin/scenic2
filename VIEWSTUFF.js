//used to be when receiving shmdatas

/* ViewSource it's a view for create a entry source to the table transfer */
if ( self.get( "category" ) != "mapper" && self.get( "class" ) != "midisrc" ) {
    _.each( collections.tables.models, function ( tableModel ) {
        /* 1. Check autorization (sources / destinations) for create view for each table */
        var authorization = tableModel.isAuthorized( self.get( "class" ) );

        if ( authorization.source ) {
            /* insert in collection */
            tableModel.get( "sources" ).add( self );

            /* we create a view source for table transfer and after that we create view for shmdata */
            new ViewSource( {
                model: self,
                table: tableModel
            } );


        }

        if ( authorization.destination ) {
            /* insert in collection destination of this table */
            tableModel.get( "destinations" ).add( self );
            /* Create a view */
            new ViewDestination( {
                model: self,
                table: tableModel
            } );
        }

    } );
}

/* ViewSourceProperty it's a entry source for the table control */
if ( self.get( "class" ) == "midisrc" ) {
    self.set( "view", new ViewSourceProperty( {
        model: self,
        table: "control"
    } ) );
}

/* ViewMapper it's the connection between the source and destination in table control */
if ( self.get( "category" ) == "mapper" ) {
    console.log( "model mapper" );
    self.set( "view", new ViewMapper( {
        model: self,
        table: "control"
    } ) );
    // that.get("view").render();
}