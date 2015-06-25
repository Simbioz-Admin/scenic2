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

        modelEvents: {
            'change': 'renderSystemUsage'
        },

        /**
         * Initialize
         */
        initialize: function () {
            this.networkUsageTemplate = _.template( NetworkUsageTemplate );
            this.lastValues = {};
        },

        onAttach: function () {
            $( this.el ).i18n();
            this.$net = $( '.network .content' );
            //socket.on( "systemusage", _.bind( this.renderSystemUsage, this ) );
        },

        /**
         * Render System Usage
         *
         * @param info
         */
        renderSystemUsage: function ( ) {
            var tree = this.model.get('tree');
            if ( tree && tree.top ) {
                if ( tree.top.cpu ) {
                    // Clone because we want to remove the first cpu object
                    var cpu = _.clone( tree.top.cpu );
                    delete cpu.cpu;
                    this.renderCpu( cpu );
                }
                this.renderMemory( tree.top.mem );
                this.renderNetwork( tree.top.net );
            }
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
                this.lastValues = {};
                _.each( info, function ( cpu, name ) {
                    this.lastValues[name] = cpu.total;
                    $( ".cpu .content", this.el ).prepend( "<div class='bar' data-cpu='" + name + "' style='height:" + cpu.total * 100 + "%;left:" + leftBar + "px;'></div>" );
                    leftBar = leftBar + 6;
                }, this );
                that.cpuRender = true;
            } else {
                _.each( info, function ( cpu, name ) {
                    var lastValue = Math.round(this.lastValues[name]*100);
                    var cpuPercent = Math.round(cpu.total * 100);
                    if ( cpuPercent != lastValue ) {
                        var $cpu       = $( "[data-cpu='" + name + "']", this.el );
                        if ( cpuPercent < 95 && $cpu.hasClass('cpu-alert') ) {
                            $cpu.removeClass( "cpu-alert" );
                        }
                        if ( cpuPercent < 85 && $cpu.hasClass('cpu-warning') ) {
                            $cpu.removeClass( "cpu-warning" );
                        }
                        $cpu.css( 'height', cpuPercent + '%' );
                        if ( cpuPercent >= 95 && !$cpu.hasClass('cpu-alert') ) {
                            $cpu.addClass( "cpu-alert" );
                        } else if ( cpuPercent >= 85 && !$cpu.hasClass('cpu-warning')) {
                            $cpu.addClass( "cpu-warning" );
                        }
                        this.lastValues[name] = cpu.total;
                    }
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
