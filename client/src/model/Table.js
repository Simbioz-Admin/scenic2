"use strict";

define( [
    'underscore',
    'backbone',
    'model/Sources',
    'model/Destinations',
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

            /* Create view for the table and associate this model */
            var viewTable = new ViewTable( {
                model: this
            } );
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

        /* Return list of quiddity you can created for this table */
        selectByCategory: function ( shmdataType ) {

            var classes,
                that = this;

            if ( !this.get( shmdataType ) ) {
                return null;
            }

            /* if specified category selected */
            if ( this.get( shmdataType ).select ) {
                classes = collections.classesDoc.getByCategory( this.get( shmdataType ).select );
            } else {
                classes = collections.classesDoc.toJSON();
            }

            if ( this.get( shmdataType ).exclude ) {
                classes = _.filter( classes, function ( clas ) {
                    if ( !_.contains( that.get( shmdataType ).exclude, clas["category"] ) ) {
                        return clas
                    }
                } );
            }

            return classes;

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
