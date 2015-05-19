define(
    /**
     *  View Shmdata
     *  Map view for create shmdata for each quiddity in each table
     *  @exports Views/Shmdata
     */

    [
        '../bower_components/underscore/underscore',
        'backbone',
        'lib/socket',
        'text!../../templates/table/source/shmdata.html',
        'text!../../templates/table/source/shmdata/box.html',
        'text!../../templates/table/source/shmdata/info-panel.html'
    ],

    function ( _, Backbone, socket, TemplateShmdata, BoxTemplate, infoPanelTemplate ) {

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
                tagName:   'div',
                table:     null,
                className: "shmdata",
                events:    {
                    "click .controls .info": "infoShmdata"
                },

                /* called for each new mapper */
                initialize: function ( options ) {
                    /* Subscribe to the remove of a specific mapper */
                    this.model.on( 'remove', this.removeView, this );
                    this.model.on( "change:byteRate", this.updateByteRate, this );
                    this.model.on( "renderConnection", this.renderConnections, this );
                    this.table = options.table;

                    this.boxTemplate = _.template( BoxTemplate );
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
                    if ( sipUserName ) {
                        this.$el.addClass('sip');
                    }

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
                    $( ".box", that.el ).remove();
                    _.defer( function () {
                        that.table.get( "destinations" ).each( function ( destination ) {
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

                        var statusBox = 'enabled';
                        statusBox += active ? ' active' : ' inactive';
                        $( '.boxes', that.el ).append( that.boxTemplate({
                            status: statusBox,
                            name: that.table.get('name'),
                            destinationId: destinationId,
                            port: port
                        }) );
                    }

                },

            } );

        return ShmdataView;
    } )