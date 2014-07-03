define(

    /** 
     *	View Systemusage
     *	Manage information about cpu and memory
     *	@exports views/Systemusage
     */

    [
        'underscore',
        'backbone',
        'text!../../../templates/systemusage/htop.html',
        'd3'
    ],

    function(_, Backbone, htop, d3) {

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
                template: htop,
                events: {
                    "click": "d3"
                },
                className: 'tabTable',
                id: "htop",
                cpuRender: false,
                //el: $("#panelRight"),

                /* Called when the view ConnexionView is initialized */
                initialize: function() {
                    console.log("Htop loaded!");
                    this.svgElement = null;
                    console.log("initialize this is ", this);
                    var that = this;
                    this.info = null;
                    var setInfo = function (info) {
                        this.info = info;
                    }
                    var setSvgElement = function () {
                        that.svgElement = that.graph();
                    }
                    var parseInfo = function (info) {
                        info = $.parseJSON(info);
                        this.info = info;
                        delete info.cpu.cpu;
                        console.log("systemusage", info);
                        this.svgElement = that.graph();
                        //setSvgElement();
                        console.log("parseInfo ends with svgElement", this.svgElement);

                    }
                    socket.on("systemusage", parseInfo);

                    if ($("#htop").length > 0) return $("#htop").remove();
                    $("#panelRight").append(this.el);
                    var template = _.template(htop);
                    //$("body").html(this.el);
                    //$(this.el).html(template);
                    this.arc = d3.svg.arc()
                        .innerRadius(50)
                        .outerRadius(100)
                        .startAngle(0);
                    //.endAngle(1.5*Math.PI);
                    // this.svgElement = this.graph();
                    console.log("initialize ends with svgElement", this.svgElement);
                    this.render(this.info, this.svgElement);
                    return this;
                },
                /**
                 * Returns an svg object that can be manipulated.
                 * @param {Object} d3.transition on an object
                 * @param {Float} new angle in radians
                 * @param {Object|SVG} d3.arc to be modified
                 * @returns {Object|SVG}
                 */
                arcTween: function(transition, newAngle, arc){
                    // console.log("arcTween sees this.arc like this: ", this.arc);
                    // console.log("Inside arcTween", transition, newAngle);
                    transition.attrTween("d", function(d) {
                        var interpolate = d3.interpolate(d.endAngle, newAngle);
                        return function(t) {
                            console.log("Tweening data ", d);
                            d.endAngle = interpolate(t);
                            return arc(d);
                        }
                    });
                },
                graph: function() {
                    console.log("svElement in graph is: ", this.svgElement);
                    console.log("data in d3 ", this.info);
                    var vis = d3.select(this.el).append("svg")
                        .attr("width", 600)
                        .attr("height", 400);
                    
                    var vumeter = vis.append("path")
                        .data(this.info.cpu)
                        .enter().append("path")
                        .attr("d", this.arc)
                        .style("fill", "blue")
                    //.style("fill-opacity", 0.7)
                        .attr("transform", "translate(500,300)");

                    // console.log("vumeter is ", vumeter);
                    // console.log("vumeter transition is: ", vumeter.transition());

                    // setInterval(function() {
                    //     vumeter.transition()
                    //         .duration(750)
                    //         .call(this.arcTween, Math.random() * 2 * Math.PI);
                    // }, 1500);
                    
                    var arcTween = function(transition, newAngle, svgElement){
                        console.log("inside arcTween transition is: ", transition);
                        transition.attrTween("d", function(d) {
                            console.log("inside transision attrTween, d: ", d);
                            var interpolate = d3.interpolate(d.endAngle, newAngle);
                            return function(t) {
                                d.endAngle = interpolate(t);
                                return svgElement(d);
                            }
                        });
                    }
                    console.log("Returning vumeter", vumeter);
                    return vumeter;
                },
                /**
                 * Update the SVG element according to data 
                 * @param { Object|SVG } svg, the svg element we will be working with
                 * @param { Object } info - the date we will be operating on
                 */
                d3: function(svg, info) {
                    svg.transition()
                        .duration(750)
                        .call(this.arcTween, Math.PI * 2 * Math.random(), this.arc);
                },
                renderBars: function (info) {
                    var that = this;
                    that.d3(info);
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
                }, 
                /**
                 * @param svg - svg element that we will be working with
                 * @param info - the data we will be operating on
                 */
                render: function(info, svgElem) {
                    //this.renderBars(info);
                    console.log("new svgElement in render: ", svgElem);
                    this.info = info;
                    this.d3(svgElem, info);
                }
            });

        return ConnexionView;
    });
