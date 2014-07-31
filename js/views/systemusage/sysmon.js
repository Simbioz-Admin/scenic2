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
                   

                    return this;
                },
                /**
                 * @param info - the data we will be operating on
                 */
                render: function(info) {
                    //this.renderBars(info);
                    //console.log("info in render: ", info);
                    var cpus = [];
                    for (key in info) {
                        //console.log("key", sysusage[key])
                        if (key == "cpu") {
                            for (cpu in info[key]) {
                                //console.log("cpu", cpu, info[key][cpu]);
                                cpus.push(info[key][cpu]);
                            }
                            //console.log(cpus);
                        }
                    }
                    this.d3(cpus);
                    
                },
                d3: function (data) {
                    var width = 80,
                    height = 40;
                    var y = d3.scale.linear()
                            .range([height, 0]);
                    var chart = d3.select(".chart")
                        .attr("x", 600)
                        .attr("width", width)
                        .attr("height", height);
                    var bar = chart.selectAll("g")
                        .data(data)
                        .enter().append("g")
                        .attr("transform", function(d, i){
                            return "translate(" + i * 10 + ", 0)";
                        });
                    bar.append("rect")
                        .attr("y", function (d) {return y(d.user)})
                        .attr("height", function (d, i) { 
                            console.log("bar " + i + " should be " + d.user);
                            return height - y(d.user); 
                        })
                        .attr("width", 5);
                    
                }
            });

        return SysmonView;
    }
);
