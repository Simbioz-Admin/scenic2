define(

    /** 
     *	View Systemusage
     *	Manage information about cpu and memory
     *	@exports views/Systemusage
     */

    [
        'underscore',
        'backbone',
        'text!../../../templates/systemusage/preview_systemusage.html'
    ],

    function(_, Backbone, previewUsageTemplate, circleiful) {

        /** 
         *	@constructor
         *  @requires Underscore
         *  @requires Backbone
         *  @augments module:Backbone.Model
         */

        var ConnexionView = Backbone.View.extend(

            /**
             *	@lends module: Views/connexion~ConnexionView.prototype
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
                    if (!this.cpuRender) {
                        var leftBar = 0;
                        var countCpu = info.cpu.length;
                        _.each(info.cpu, function(cpu, name) {
                            $(".cpus", this.el).prepend("<div class='bar' data-cpu='" + name + "' style='height:" + cpu.total * 100 + "%;left:" + leftBar + "px;'></div>");
                            leftBar = leftBar + 4;
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



                    //$(".total", this.el).html(Math.round(info.cpu.cpu.total * 10000) / 100 + "%");
                }
            });

        return ConnexionView;
    });