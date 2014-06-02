define(

    /** 
     *	View Systemusage
     *	Manage information about cpu and memory
     *	@exports views/Systemusage
     */

    [
        'underscore',
        'backbone',
        'text!../../../templates/systemusage/preview_systemusage.html',
        'd3'
    ],

    function(_, Backbone, previewUsageTemplate, d3) {

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
                events: {
                    "click": "d3"
                },
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

                d3: function() {
                    var random = d3.random.normal(0, 0.2);
                    var n = 40;
                    var data = d3.range(n).map(random);
                    console.log(data);
                    var width = $(this.el).width();
                    var height = $(this.el).height();
                    console.log("inside d3 function, element", this.el);
                    $("#panelLeft").append('<div class="table active" id="system_usage"></div');
                    console.log(d3);

                    var margin = {top: 10, right: 10, bottom: 20, left: 40},
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;
	            
                    var x = d3.scale.linear()
                        .domain([0, n - 1])
                        .range([0, width]);
	            
                    var y = d3.scale.linear()
                        .domain([0, 20])
                        .range([height, 0]);

                    var line = d3.svg.line()
                        .interpolate("linear")
                        .x(function (d, i) {
                            return x(i);
                        })
                        .y(function (d, i) {
                            return y(d);
                        });
                    var svg = d3.select("#panelLeft").append("svg")
                        .attr("width", width)
                        .attr("height", height);
                    svg.append("defs").append("clipPath")
                        .attr("id", "clip")
                        .append("rect")
                        .attr("width", width)
                        .attr("height", height);

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(d3.svg.axis().scale(y).ticks(5).orient("left"));

                    var path = svg.append("g")
                        .attr("clip-path", "url(#clip)")
                        .append("path")
                        .data([data])
                        .attr("class", "line")
                        .attr("d", line);
                    //tick(path, line, data);
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
