define(

    /** 
     *  View Systemusage
     *  Manage information about cpu and memory
     *  @exports views/Systemusage
     */

    [
        'underscore',
        'backbone',
        'text!../../../templates/systemusage/preview_systemusage.html'
    ],

    function(_, Backbone, previewUsageTemplate, circleiful) {

        /** 
         *  @constructor
         *  @requires Underscore
         *  @requires Backbone
         *  @augments module:Backbone.Model
         */

        var ConnexionView = Backbone.View.extend(

            /**
             *  @lends module: Views/connexion~ConnexionView.prototype
             */


            {
                template: previewUsageTemplate,
                events: {},
                className: 'tabTable',
                id: "preview_usagesystem",
                cpuRender: false,


                /* Called when the view ConnexionView is initialized */

                initialize: function() {
                    var that = this;
                    socket.on("systemusage", function(info) {
                        info = $.parseJSON(info);
                        delete info.cpu.cpu;
                        // console.log("systemusage", $.parseJSON(info));
                        that.render(info);
                    });


                    $("#panelTables").append(this.el);
                    var template = _.template(previewUsageTemplate);
                    $(this.el).html(template);

                },
                render: function(info) {
                    var that = this;

                    /* manage refresh info about cpu */
                    var numberCpu = Object.keys(info.cpu).length;
                    var spaceBetweenbar = 1;
                    var sizeBarW = ($(".cpus", this.el).width() - numberCpu * spaceBetweenbar) / numberCpu;

                    /* first time we added bar for cpu information */
                    if (!this.cpuRender) {
                        var leftBar = 0;
                        var countCpu = info.cpu.length;
                        _.each(info.cpu, function(cpu, name) {
                            $(".cpus", this.el).prepend("<div class='bar' data-cpu='" + name + "' style='height:" + cpu.total * 100 + "%;left:" + leftBar + "px;'></div>");
                            leftBar = leftBar + sizeBarW + spaceBetweenbar;
                            if (!--countCpu) that.cpuRender = true;
                        });
                    } else {
                        _.each(info.cpu, function(cpu, name) {
                            if ((cpu.total * 100) < 95) {
                                $("[data-cpu='" + name + "']", this.el).removeClass("alert");
                            }
                            $("[data-cpu='" + name + "']", this.el).animate({
                                "height": cpu.total * 100 + "%"
                            }, 500, function() {
                                if ((cpu.total * 100) > 95) {
                                    $("[data-cpu='" + name + "']", this.el).addClass("alert");
                                }
                            });
                        });
                    }

                    $(".cpus .bar", this.el).css("width", sizeBarW);


                    /* manage refresh info about memory */

                    var memUse = info.mem.total - info.mem.free - info.mem.cached,
                        percentUse = memUse * 100 / info.mem.total,
                        unit = ["KB", "MB", "GB"],
                        unitReceive, unitTransfer;

                    if (percentUse < 95) $(".memory .bar", this.el).removeClass("alert");

                    $(".memory .bar", this.el).animate({
                        "width": percentUse + "%"
                    }, 500, function() {
                        if (percentUse > 95) $(".memory .bar", this.el).addClass("alert");
                    });

                    var transfer = info.net.eth0.tx_rate;
                    var receive = info.net.eth0.rx_rate;

                    var countIntTransfer = transfer.toString().length;
                    var countIntReceive = receive.toString().length;

                    if (countIntTransfer < 7) {
                        transfer = transfer / 1024;
                        unitTransfer = unit[0];
                    }
                    if (countIntTransfer >= 7 && countIntTransfer < 10) {
                        transfer = transfer / 1024 / 1024;
                        unitTransfer = unit[1];
                    }
                    if (countIntTransfer >= 10) {
                        transfer = transfer / 1024 / 1024;
                        unitTransfer = unit[2];
                    }

                    if (countIntReceive < 7) {
                        receive = receive / 1024;
                        unitReceive = unit[0];
                    }
                    if (countIntReceive >= 7 && countIntReceive < 10) {
                        receive = receive / 1024 / 1024;
                        unitReceive = unit[1];
                    }
                    if (countIntReceive >= 10) {
                        receive = receive / 1024 / 1024;
                        unitReceive = unit[2];
                    }

                    $(".network .transfer", this.el).html(Math.round(transfer * 10) / 10 + unitTransfer);
                    $(".network .receive", this.el).html(Math.round(receive * 10) / 10 + unitReceive);


                }
            });

        return ConnexionView;
    });