"use strict";

define( [
    'underscore',
    'backbone',
    'lib/socket',
    'model/base/ScenicModel',
    'model/quiddity/method/Arguments'
], function ( _, Backbone, socket, ScenicModel, Arguments ) {

    /**
     *  @constructor
     *  @augments ScenicModel
     */

    var Method = ScenicModel.extend( {
        idAttribute: 'name',
        defaults:    {
            'name':               null,
            'long name':          null,
            'description':        null,
            'return description': null,
            'return type':        null,
            'position category':  null,
            'position weight':    0,
            arguments:            new Arguments()
        },
        parse: function( response ) {
            //Parse arguments into a collection
            response.arguments = new Arguments( response.arguments );
            return response;
        },
        initialize:  function () {
            ScenicModel.prototype.initialize.apply( this, arguments );
        }
    } );
    return Method;
} )
;