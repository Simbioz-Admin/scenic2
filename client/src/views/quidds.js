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