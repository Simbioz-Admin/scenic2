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
     * @extends module:Marionette.ItemView
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

                if ( tree.top.mem ) {
                    this.renderMemory( tree.top.mem );
                }

                if ( tree.top.net ) {
                // Clone because we want to remove the 'lo' interface
                    var net = _.clone( tree.top.net );
                    delete net.lo;
                    this.renderNetwork( net );
                }
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
                $( ".cpu .content", this.el ).append('<div class="bars"></div>');
                var width = $('.cpu .content .bars' ).width();
                var count = _.values( info ).length;
                var barWidth = Math.floor(width / count) - 1;
                console.log( width, count, barWidth );
                _.each( info, function ( cpu, name ) {
                    this.lastValues[name] = cpu.total;
                    $( ".cpu .content .bars", this.el ).append( '<div class="bar" data-cpu="' + name + '" style="height:' + cpu.total * 100 + '%;width:' + barWidth + 'px;left:' + leftBar +'px"></div>' );
                    leftBar += barWidth + 1;
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

        convertBytes: function ( totalBytes ) {
            var total = parseFloat( totalBytes );
            var size  = null;
            if ( total >= 1099511627776 ) {
                var terabytes = total / 1099511627776;
                size          = terabytes.toFixed( 2 ) + "T";
            } else if ( total >= 1073741824 ) {
                var gigabytes = total / 1073741824;
                size          = gigabytes.toFixed( 2 ) + "G";
            } else if ( total >= 1048576 ) {
                var megabytes = total / 1048576;
                size          = megabytes.toFixed( 2 ) + "M";
            } else if ( total >= 1024 ) {
                var bytes = total / 1024;
                size      = bytes.toFixed( 2 ) + "K";
            } else {
                size = total.toFixed( 2 ) + "b";
            }
            return size;
        }
    } );

    return SystemUsageView;
} );
