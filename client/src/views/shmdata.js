define(
    /**
     *  View Shmdata
     *  Map view for create shmdata for each quiddity in each table
     *  @exports Views/Shmdata
     */

    [
        'underscore',
        'backbone',
        'lib/socket',
        'text!../../templates/shmdata.html',
        'text!../../templates/shmdata/info-panel.html'
    ],

    function ( _, Backbone, socket, TemplateShmdata, infoPanelTemplate ) {

        /**
         *  @constructor
         *  @requires Underscore
         *  @requires Backbone
         *  @requires TemplateShmdata
         *  @augments module:Backbone.View
         */

        var ShmdataView = Backbone.View.extend(
            /**
             *  @lends module: Views/Shmdata~ShmdataView.prototype
             */

            {
                tagName:   'tr',
                table:     null,
                className: "shmdata",
                events:    {
                    "click th":      "infoShmdata",
                    'click .edit':   "editQuidd",
                    'click .remove': "removeQuidd"
                },

                /* called for each new mapper */
                initialize: function ( options ) {
                    /* Subscribe to the remove of a specific mapper */
                    this.model.on( 'remove', this.removeView, this );
                    this.model.on( "change:byteRate", this.updateByteRate, this );
                    this.model.on( "renderConnection", this.renderConnections, this );
                    this.table = options.table;

                },

                /* Called for render the view */
                render: function () {
                    var nameShm = this.model.get( "path" ).split( '_' )[3];
                    var pathShm = this.model.get( "path" ).split( "/" );

                    var sipUserName = this.model.getSipUser();

                    templateShmdata = _.template( TemplateShmdata )( {
                        name:      nameShm,
                        user:      sipUserName, //UBALD: Added to sort sipquidd shmdatas bu user, sketchy for the moment
                        nameQuidd: this.model.get( "quidd" ),
                        tableType: this.table.get( "type" )
                    } );

                    $( this.el ).append( templateShmdata );
                    $( this.el ).attr( "data-path", this.model.get( "path" ) );

                    /* insert view in the quidd associate to */
                    if ( this.table.get( "type" ) == "transfer" ) {
                        $( "#" + this.table.get( "type" ) + " #quidd_" + this.model.get( "quidd" ) + " .shmdatas" ).append( this.el );
                    }

                    if ( this.table.get( "type" ) == "sink" ) {
                        $( "#" + this.table.get( "type" ) + " [data-type='" + this.model.get( 'category' ) + "']" + " .shmdatas" ).append( this.el );
                    }


                    this.renderConnections();
                },

                renderConnections: function () {

                    var that = this;
                    $( "td", that.el ).remove();
                    _.defer( function () {
                        that.table.get( "collectionDestinations" ).each( function ( destination ) {
                            that.connectionForDestination( destination, that.table.get( "type" ) );
                        } );
                    } );
                },

                connectionForDestination: function ( destination, tableType ) {
                    /* check if the connexion existing between source and destination */
                    var that   = this;
                    var active = false;
                    var port   = '';

                    var destinationId = (!destination.get( "uri" )) ? destination.get( "name" ) : destination.get( "uri" );
                    /* Render for Tab transfer */
                    if ( tableType == "transfer" && that.table.get( "type" ) == tableType && $( '[data-destination="' + destinationId + '"]', that.el ).length == 0 && destination.get( 'in_tab' ) ) {
                        active = false;

                        _.each( destination.get( "data_streams" ), function ( stream ) {
                            if ( stream.path == that.model.get( "path" ) ) {
                                active = true;
                                port   = stream.port;
                            }
                        } );

                        if ( destination.get( 'connection' ) ) {

                            _.each( destination.get( 'connection' ), function ( connection ) {
                                if ( that.model.get( "path" ) == connection ) {
                                    active = true;
                                }
                            } );
                        }

                        var statusBox = 'box enabled';
                        statusBox += active ? ' active' : ' inactive';
                        $( that.el ).append( '<td class="' + statusBox + " " + that.table.get( "name" ) + '" data-destination="' + destinationId + '">' + port + '</td>' );
                    }

                    /* Render for Tab Sink */
                    if ( tableType == "sink" && that.table.get( "type" ) == tableType ) {

                        /* Check if we can create a connexion between shmdata and sink */
                        socket.emit( "invoke", destination.get( "name" ), "can-sink-caps", [that.model.get( "caps" )], function ( err, canSink ) {

                            if ( $( '[data-destination="' + destination.get( "name" ) + '"]', that.el ).length == 0 ) {

                                /* Check if already connected */
                                var shmdata_readers = null;
                                var shmdatasReaders = destination.get( "shmdatasCollection" ).where( {
                                    type: 'reader'
                                } );

                                active = false;

                                if ( shmdatasReaders ) {
                                    _.each( shmdatasReaders, function ( shm ) {
                                      if ( shm.get( 'path' ) == that.model.get( "path" ) ) {
                                        active = true;
                                      }
                                    } );
                                }
                                var statusBox = 'box';
                                statusBox += canSink == "true" ? ' enabled' : ' disabled';
                                statusBox += active ? ' active' : ' inactive';
                                $( that.el ).append( '<td class="' + statusBox +'" data-destination="' + destinationId + '"><div class="icon"></div></td>' );

                            }
                        } );

                    }
                },

                updateByteRate: function () {
                  if ( this.model.get( "byteRate" ) > 0 ) {
                    $( this.el ).removeClass( "inactive" ).addClass( "active" );
                  } else {
                    $( this.el ).removeClass( "active" ).addClass( "inactive" );
                  }
                },

                /*
                 *  Get information about the quiddity and show on the interface.
                 *  the information is present in vumeter quiddity created with each quiddity soruce
                 */

                infoShmdata: function ( element ) {
                    var capabilities = this.model.get('caps').split(', ');
                    capabilities = _.map( capabilities, function( capString ) {
                        var parts = capString.split('=');
                        var property = parts[0];
                        var type = null;
                        var value = null;
                        var value = parts.length > 1 ? parts[1] : null;
                        if ( parts.length > 1 ) {
                            var info = /\((.*)\)(.*)/.exec(parts[1]);
                            if ( info.length == 3 ) {
                                type = info[1];
                                value = info[2];
                            } else {
                                value = parts[1];
                            }
                        }
                        return { property: property, type: type, value: value };
                    } );
                    var data = {
                        shmdata: this.model.attributes,
                        capabilities: capabilities
                    };
                    var template = _.template( infoPanelTemplate )( data );
                    $( "#info" ).remove();
                    $( "body" ).prepend( template );
                    $( "#info" ).css( {
                        top:  element.pageY,
                        left: element.pageX
                    } ).show();
                    $( ".panelInfo" ).draggable( {
                        cursor: "move",
                        handle: ".title"
                    } );

                    /*collections.quidds.getPropertyValue("vumeter_" + shmdata, "caps", function(val) {
                     val = val.replace(/, /g, "\n" );
                     });*/
                },

                removeView:  function () {

                    this.remove();
                },
                editQuidd:   function () {
                    collections.quidds.get( this.model.get( "quidd" ) ).edit();
                },
                removeQuidd: function () {
                    collections.quidds.get( this.model.get( "quidd" ) ).askDelete();
                },
            } );

        return ShmdataView;
    } )