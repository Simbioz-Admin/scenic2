define(
    /**
     *  View Quidds
     *  The Launch View to manage the interface scenic pre-configuration  when launched
     *  @exports Views/Launch
     */

    [
        'underscore',
        'backbone',
        'lib/socket',
        'model/Quiddity',
        'text!../../templates/createQuidd.html',
        'text!../../templates/quidd.html',

    ],

    function ( _, Backbone, socket, Quiddity, quiddCreateTemplate, quiddTemplate ) {

        /**
         *  @constructor
         *  @requires Underscore
         *  @requires Backbone
         *  @requires Quiddity
         *  @requires quiddCreateTemplate
         *  @requires quiddTemplate
         *  @augments module:Backbone.View
         */

        var QuiddView = Backbone.View.extend(
            /**
             *  @lends module: Views/launch~LaunchView.prototype
             */

            {
                el:              'body',
                events:          {
                    "menuselect .createQuidd a": "defineName",
                    "click #create":             "create",
                    "mouseup #quiddName":        "stopEvent"
                },
                delayAutoDetect: false,

                initialize: function () {
                },


                /* open the lightbox and show the properties to define for create the quidd Source
                 * ALERT : This function is call in views/table.js Because we use jqueryui and we cant access events in view declaration
                 */

                defineName: function ( element ) {
                    var className  = $( element ).data( "name" );
                    var getDevices = $( element ).hasClass( "autoDetect" );

                    /* get  the information about the device in property value of quiddity */
                    if ( getDevices ) {
                        socket.emit( "get_property_by_class", className, "device", function ( property ) {
                            if ( property ) {
                                console.log( "Property", property.values );
                                openPanelDefineName( property.values );
                            } else {
                                views.global.notification( "error", "no video device" );
                            }
                        } );
                    } else if ( className ) {
                        openPanelDefineName( false );
                    }

                    function openPanelDefineName( devices ) {

                        var template = _.template( quiddCreateTemplate )( {
                            title:     "Define name for " + className,
                            className: className,
                            devices:   devices
                        } );

                        $( "#inspector .inspector-info-panel" ).html( template );
                        $( "#inspector .inspector-info-panel" ).i18n();
                        views.global.openPanel();
                        //timeout wait for loading correctly field and focusing
                        setTimeout( function () {
                            $( "#inspector .inspector-info-panel #quiddName" ).focus();
                        }, 1 );

                    }
                },

                stopEvent: function ( e ) {
                    e.preventDefault();
                },

                /* Called after the user define a name for create a quiddity */

                create: function ( element ) {
                    var className      = $( "#className" ).val(),
                        quiddName      = $( "#quiddName" ).val(),
                        deviceDetected = $( "#device" ).val();

                    new Quiddity().save( {'class': className, 'newName': quiddName}, {
                        success: function ( quiddity ) {
                            if ( deviceDetected ) {
                                quiddity.setPropertyValue( "device", deviceDetected, function ( ok ) {
                                    quiddity.edit();
                                } );
                            } else {
                                quiddity.edit();
                            }
                        },
                        error:   function ( error ) {
                            return views.global.notification('error', error);
                        }
                    } );
                }
            } );

        return QuiddView;
    } );