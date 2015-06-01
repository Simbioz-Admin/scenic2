"use strict";

define( [
    'underscore',
    'backbone',
    'marionette',
    'lib/socket',
    'text!template/scenic/system-usage.html',
    'text!template/scenic/system-usage/network.html'
], function ( _, Backbone, Marionette, socket, SystemUsageTemplate, NetworkUsageTemplate ) {

    /**
     * SystemUsageView
     *
     * @constructor
     * @extends Backbone.View
     */

    var SystemUsageView = Marionette.ItemView.extend( {
        template:  _.template( SystemUsageTemplate ),
        className: 'monitor',
        id:        "system-usage",
        cpuRender: false,

        /**
         * Initialize
         */
        initialize: function () {
            this.networkUsageTemplate = _.template( NetworkUsageTemplate );
        },

        onAttach: function () {
            $( this.el ).i18n();
            this.$net = $( '.network .content' );
            socket.on( "systemusage", _.bind( this.renderSystemUsage, this ) );
        },

        /**
         * Render System Usage
         *
         * @param info
         */
        renderSystemUsage: function ( info ) {
            info = $.parseJSON( info );
            delete info.cpu.cpu;
            this.renderCpu( info.cpu );
            this.renderMemory( info.mem );
            this.renderNetwork( info.net );
        },

        /**
         * Render CPU
         *
         * @param info
         */
        renderCpu: function ( info ) {
            var that = this;
            if ( !this.cpuRender ) {
                var leftBar    = 0;
                _.each( info, function ( cpu, name ) {
                    $( ".cpu .content", this.el ).prepend( "<div class='bar' data-cpu='" + name + "' style='height:" + cpu.total * 100 + "%;left:" + leftBar + "px;'></div>" );
                    leftBar = leftBar + 6;
                }, this );
                that.cpuRender = true;
            } else {
                _.each( info, function ( cpu, name ) {
                    if ( (cpu.total * 100) < 95 ) {
                        $( "[data-cpu='" + name + "']", this.el ).removeClass( "cpu-alert" );
                    }
                    $( "[data-cpu='" + name + "']", this.el ).animate( {
                        "height": cpu.total * 100 + "%"
                    }, 500, function () {
                        if ( (cpu.total * 100) > 95 ) {
                            $( "[data-cpu='" + name + "']", this.el ).addClass( "cpu-alert" );
                        }
                    } );
                }, this );
            }
        },

        /**
         * Render Memory
         *
         * @param info
         */
        renderMemory: function ( info ) {
            var percentUsedMemory = 100 - Math.round( 100 * (parseInt( info.cached ) + parseInt( info.buffers ) + parseInt( info.free )) / parseInt( info.total ) );
            $( ".memory .content" ).html( percentUsedMemory + "%" );
        },

        /**
         * Render Network
         *
         * @param info
         */
        renderNetwork: function ( info ) {
            var html = '';
            _.each( _.keys( info ), function ( ifaceName ) {
                var iface     = info[ifaceName];
                iface.rx_rate = this.convertBytes( iface.rx_rate );
                iface.tx_rate = this.convertBytes( iface.tx_rate );
                html += this.networkUsageTemplate( {name: ifaceName, iface: iface} );
            }, this );
            this.$net.html( html );
        },

        convertBytes: function ( bytes ) {
            var bytes = parseFloat( bytes );
            var size  = null;
            if ( bytes >= 1099511627776 ) {
                var terabytes = bytes / 1099511627776;
                size          = terabytes.toFixed( 2 ) + "T";
            } else if ( bytes >= 1073741824 ) {
                var gigabytes = bytes / 1073741824;
                size          = gigabytes.toFixed( 2 ) + "G";
            } else if ( bytes >= 1048576 ) {
                var megabytes = bytes / 1048576;
                size          = megabytes.toFixed( 2 ) + "M";
            } else if ( bytes >= 1024 ) {
                var bytes = bytes / 1024;
                size      = bytes.toFixed( 2 ) + "K";
            } else {
                size = bytes.toFixed( 2 ) + "b";
            }
            return size;
        }
    } );

    return SystemUsageView;
} );
