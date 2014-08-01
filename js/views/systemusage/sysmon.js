define(
    /*****
     * Display a mini system monitor in the heading of the page
     * @exports view/sysmon
     */
    [
        'underscore',
        'backbone',
        'text!../../../templates/systemusage/sysmon.html',
        'd3'
    ],
    function(_, Backbone, sysmon, d3) {

        /** 
         *  @constructor
         *  @requires Underscore
         *  @requires Backbone
         *  @augments module:Backbone.Model
         */

        var SysmonView = Backbone.View.extend(

            /**
             *	@lends module: Views/connexion~ConnexionView.prototype
             */

            {
                template: sysmon,
                events: {
                    "click": "d3"
                },
                className: 'chart',
                id: "svg",
                cpuRender: false,
                //el: $("#panelRight"),

                /* Called when the view ConnexionView is initialized */
                initialize: function() {
                    console.log("d3 version ", d3.version);
                    console.log("sysmon loaded!");
                    console.log("initialize this is ", this);
                    var _this = this;
                     function parseInfo(info) {
                        var cpuinfo = $.parseJSON(info);
                        //delete info.cpu.cpu;
                        _this.render(cpuinfo);
                    };
                    socket.on("systemusage", parseInfo);

                    //if ($("#w").length > 0) return $("#w").remove();
                    //$("#header").append(this.el);
                    var template = _.template(sysmon);
                    $("#header").append(template);
                    //$("body").html(this.el);
                    //$(this.el).html(template);

                    // FIXME: style these with CSS
                    var cpuBg = d3.select(".chart")
                        .append("rect")
                        .attr("class", "monBg")
                        .attr("width", 50)
                        .attr("height", 50);

                    var cpuLabel = d3.select(".chart")
                        .append("text")
                        .attr("class", "monLabel")
                        .attr("x", 5)
                        .attr("y", 15)
                        //.attr("fill", "grey")
                        .text("CPU");

                    var netBg = d3.select(".chart")
                        .append("rect")
                        .attr("x", 51)
                        .attr("class", "monBg")
                        .attr("width", 50)
                        .attr("height", 50);

                    var netLabel = d3.select(".chart")
                        .append("text")
                        .attr("class", "monLabel")
                        .attr("x", 55)
                        .attr("y", 15)
                        //.attr("fill", "grey")
                        .text("NET");

                   

                    return this;
                },
                /**
                 * @param info - the data we will be operating on
                 */
                render: function(info) {
                    //this.renderBars(info);
                    //console.log("info in render: ", info);
                    var cpus = [];
                    var net = [];
                    for (key in info) {
                            //console.log("key", sysusage[key])
                            if (key == "cpu") {
                            for (cpu in info[key]) {
                                //console.log("cpu", cpu, info[key][cpu]);
                                cpus.push(info[key][cpu]);
                            }
                                this.cpuMon(cpus);
                        } else if (key == "net") {
                            for (eth in info[key]) {
                                net.push(info[key][eth])
                            }
                            this.netMon(net);
                        }
                    }
                    
                    
                    
                },
                netMon: function netMon(data) {
                    //console.log("TODO: implement netMonitor")
                    var width = 200;
                    var height = 50;
                    var barWidth = (width / 4) / data.length;
                    var y = d3.scale.linear()
                            .range([height, 0]);
                    var chart = d3.select(".chart")
                        .attr("width", width)
                        .attr("height", height);

                    var bar = chart.selectAll(".bar")
                        .data(data);
                    bar.enter()
                        .append("rect")
                        .attr("class", "bar");

                    bar.transition(0.1)
                        .attr("y", function (d) {return y(d.tx_rate)})
                        .attr("height", function (d, i) { 
                            return height - y(d.tx_rate); 
                        })
                        .attr("width", barWidth - 1)
                        .attr("transform", function(d, i){
                            return "translate(" + 50 + (i * barWidth) + ", 0)";
                        });

                    function type(d) {
                        d.value = +d.value; // coerce to number
                        return d;
                    }
                    
                },
                cpuMon: function (data) {
                    var width = 200;
                    var height = 50;
                    var barWidth = (width / 4) / data.length;
                    var y = d3.scale.linear()
                            .range([height, 0]);
                    var chart = d3.select(".chart")
                        .attr("width", width)
                        .attr("height", height);

                    var bar = chart.selectAll(".bar")
                        .data(data);
                    bar.enter()
                        .append("rect")
                        .attr("class", "bar");

                    bar.transition(0.1)
                        .attr("y", function (d) {return y(d.total)})
                        .attr("height", function (d, i) { 
                            return height - y(d.total); 
                        })
                        .attr("width", barWidth - 1)
                        .attr("transform", function(d, i){
                            return "translate(" + i * barWidth + ", 0)";
                        });

                    function type(d) {
                        d.value = +d.value; // coerce to number
                        return d;
                    }
                },
            });

        return SysmonView;
    }
);
