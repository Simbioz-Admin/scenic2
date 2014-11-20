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
    'd3',
    // 'views/systemusage/Htop'
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
          //"click": "runHtop"
        },
        className: 'monitor',
        id: "preview_usagesystem",
        cpuRender: false,
        //el: $("#panelLeft"),


        /* Called when the view ConnexionView is initialized */

        initialize: function() {
          var that = this;
          var info = null;
          socket.on("systemusage", function(info) {
            info = $.parseJSON(info);
            delete info.cpu.cpu;
            that.renderCpu(info.cpu);
            that.renderMem(info.mem);
            that.renderNetwork(info.net.eth0);
          });
          $("#menu_header").after(this.el);
          var template = _.template(previewUsageTemplate);
          $(this.el).html(template);

        },

        renderCpu: function (info) {
          var that = this;

          if (!this.cpuRender) {
            var leftBar = 0;
            var countCpu = info.length;
            _.each(info, function(cpu, name) {
              $(".cpus .content", this.el).prepend("<div class='bar' data-cpu='" + name + "' style='height:" + cpu.total * 100 + "%;left:" + leftBar + "px;'></div>");
              leftBar = leftBar + 4;
              if (!--countCpu) that.cpuRender = true;
            });
          } else {
            _.each(info, function(cpu, name) {
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
        renderMem: function(info) {
          var percentUsedMemory = 100-Math.round(100*(parseInt(info.cached)+parseInt(info.buffers)+parseInt(info.free))/parseInt(info.total));
          $(".memory .content").html(percentUsedMemory+"%");
        },
        renderNetwork:function(info){
          console.log(this.convertBytes(info.rx_rate));
          var unit = '/Bps'
          var rxRate = this.convertBytes(info.rx_rate);
          var txRate = this.convertBytes(info.tx_rate);
          var lengthRx = rxRate.toString().length;
          var lengthTx = txRate.toString().length;
          var unitRx = unitTx = '';
          if(lengthRx > 3 && lengthRx < 6) unitRx = 'K';
          if(lengthTx > 3 && lengthTx < 6) unitTx = 'K';
          if(lengthRx > 6 && lengthRx < 9) unitRx = 'M';
          if(lengthTx > 6 && lengthTx < 9) unitTx = 'M';
          if(lengthRx > 9 && lengthRx < 12) unitRx = 'G';
          if(lengthTx > 9 && lengthTx < 12) unitTx = 'G';

          //console.log(unitRx, unitTx);
          $('.network .receive').html("rx: " + rxRate);
          $('.network .transfer').html("tx: " + txRate);
          
          //console.log(rxRate,unitRx, txRate, unitTx);

        },
        convertBytes: function(bytes) {
          var bytes = parseFloat(bytes);
          var size = null;
          if (bytes >= 1099511627776) {
            var terabytes = bytes / 1099511627776;
            size = terabytes.toFixed(2) + "T";
          }
          else if (bytes >= 1073741824) {
            var gigabytes = bytes / 1073741824;
            size = gigabytes.toFixed(2) + "G";
          }
          else if (bytes >= 1048576) {
            var megabytes = bytes / 1048576;
            size = megabytes.toFixed(2) + "M";
          }
          else if (bytes >= 1024) {
            var bytes = bytes / 1024;
            size = bytes.toFixed(2) + "K";
          }
          else {
            size = bytes.toFixed(2) + "b";
          }
          return size;
        }
      });

    return ConnexionView;
  });
