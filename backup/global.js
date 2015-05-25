define(
    /**
     *  View Global
     *  Manage interaction with the Destination Model (quiddity)
     *  @exports Views/Gobal
     */
    [
        '../bower_components/underscore/underscore',
        'backbone',
        'lib/socket',
        'text!../../templates/quidd.html',
        'text!../../templates/panelInfo.html',
        'text!../../templates/panelLoadFiles.html',
        'text!../../templates/panelSaveFile.html',
        'text!../../templates/confirmation.html',
        'text!../../templates/createReceiver.html',
        'app'
    ],

    function ( _, Backbone, socket, quiddTemplate, panelInfoTemplate, panelLoadtemplate, panelSaveTemplate, confirmationTemplate, TemplateReceiver, app ) {
        /**
         *  @constructor
         *  @requires Underscore
         *  @requires Backbone
         *  @requires quiddTemplate
         *  @requires panelInfoTemplate
         *  @requires confirmationTemplate
         *  @augments module:Backbone.View
         */

        var GlobalView = Backbone.View.extend(
            /**
             *  @lends module: Views/Gobal~GlobalView.prototype
             */

            {
                el:            'body',
                statePanelIrc: false,
                statePanelLog: false,

                //assocition between action on elements html and functions
                events: {
                    "keypress":                        "keyboardAction",
                    "click #close-inspector":          "closePanel",
                    "click #close-shmdata-info-panel": "closeShmdataInfoPanel",
                    "change .checkbox":                'stateCheckbox',
                    "click #header .menu .info":       'panelInfo',
                    "click #header .menu .save":       'save_file',
                    "click #header .menu .load":       'get_save_file_list',
                    "submit #saveFile":                'save',
                    'click #panelFiles .file':         'load_file',
                    'click .remove_save':              'remove_save',
                    "click #create_receiver":          "create_receiver",
                    "click #add-receiver":             "add_receiver",
                    /*"click  #form-destination, #form-lightbox, #panelInfo, #panelFiles,\
                     #btnSave, #quiddName, #panelSave, #btnGetFiles,\
                     #device, .edit": "preventPropagation",*/
                    "click .lang":                     "changeLang"
                },

                /* Called when the view is initialized */

                initialize: function () {
                    var that = this;


                    $( document ).keyup( function ( e ) {
                        that.keyboardAction( e );
                    } );
                },


                keyboardAction: function ( event ) {
                    var that = this;
                    //console.log("id Key", event.which);

                    /* started or stopped quidd */
                    if ( event.which == 115 && event.shiftKey ) {
                        $( "#check-started" ).attr( 'checked', true );
                    }

                    /* action open menu for create quidd (id : 113 - up) */
                    if ( event.which == 81 && event.shiftKey ) {
                        var currentTable = localStorage['currentTable'];
                        currentTable     = collections.tables.get( currentTable );
                        currentTable.trigger( "trigger:menu", "sources" );
                        $( "#subMenu" ).addClass( "active" );
                    }

                    /* action on panel (close) */
                    if ( event.which == 27 ) {
                        /* Close inspector */
                        this.closePanel();

                        /* close confirmation message */
                        if ( $( "#overlay_confirmation" ).length > 0 ) {
                            $( "#overlay_confirmation" ).remove();
                            $( "#container" ).removeClass( "blur" );
                        }

                        /* Close box save/ load */
                        $( ".panelBox, #subMenu" ).remove();


                    }
                },



                remove_save: function ( e ) {
                    var name = $( e.target ).data( "name" );
                    socket.emit( "remove_save", name, function ( error ) {
                        if ( error ) {
                            //TODO: Handle error
                        } else {
                            $( e.target ).parent().remove();
                        }
                    } )
                },

                panelInfo: function ( event ) {
                    // element.stopPropagation();
                    if ( $( "#panelInfo" ).length == 0 ) {
                        $( ".panelBox" ).remove();
                        var template = _.template( panelInfoTemplate )( {
                            username: config.nameComputer,
                            host:     config.host,
                            soap:     config.soap.port
                        } );
                        $( event.currentTarget ).after( template );
                    } else {
                        $( "#panelInfo" ).remove();
                    }
                },

                changeLang: function ( e ) {
                    var currentLang = localStorage.getItem( 'lang' );
                    var lang        = $( e.currentTarget ).data( 'lang' );
                    if ( lang != currentLang ) {
                        localStorage.setItem( 'lang', lang );
                        location.reload();
                    }

                }

            } );

        return GlobalView;
    } )