"use strict";

define( [
    'underscore',
    'backbone',
    'model/Sources',
    'model/base/Destinations',
    'views/table',
    'views/source'
], function ( _, Backbone, Sources, Destinations, ViewTable ) {

    /**
     *  @constructor
     *  @augments module:Backbone.Model
     */
    var Table = Backbone.Model.extend( {
        defaults:    {
            "name":                   null,
            "type":                   null,
            "description":            null,
            "menus":                  [],
            "collectionSources":      null,
            "collectionDestinations": null,
            "active": false
        },

        initialize: function () {

            /* Create collection source and destination */
            /* we check if it's already a collection */
            this.set( "collectionSources", new Sources( this.getQuidds( "sources" ) ) );

            if ( !this.get( "collectionDestinations" ) ) {
                this.set( "collectionDestinations", new Destinations( this.getQuidds( "destinations" ) ) );
            }
        },

        activate: function() {
            this.collection.setCurrentTable( this );
        },


        //
        //
        //
        //
        //
        //
        //
        //
        //
        //









        /* Return the quiddities authorize baded on tyoe (source or destination) */
        getQuidds: function ( shmdataType ) {

            /* parse global collection quidds contains all quidds already created for return just what you want */
            if ( this.get( shmdataType ) ) {
                var quiddsSelect = this.get( shmdataType ).select;
                return collections.quiddities.SelectQuidds( quiddsSelect );
            }
        },

        isAuthorized: function ( quiddClass ) {
            var authorized_source = _.find( this.selectByCategory( "sources" ), function ( clas ) {
                return clas["class name"] == quiddClass;
            } );

            var authorized_destination = _.find( this.selectByCategory( "destinations" ), function ( clas ) {
                return clas["class name"] == quiddClass;
            } );

            return {
                source:      authorized_source ? true : false,
                destination: authorized_destination ? true : false
            }
        }
    } );

    return Table;
} );
