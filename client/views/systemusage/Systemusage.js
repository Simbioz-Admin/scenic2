define(

  /** 
   *	View Systemusage
   *	Manage information about cpu and memory
   *	@exports views/Systemusage
   */

  [
    'underscore',
    'backbone',
    'lib/socket',
    'text!../../templates/systemusage/preview_systemusage.html',
    'text!../../templates/systemusage/network_usage.html'
  ],

  function(_, Backbone, socket, previewUsageTemplate, networkUsageTemplate) {

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
          // $("#menu_header").after(this.el);
          $("#tabs").append(this.el);

          var template = _.template(previewUsageTemplate)();
          $(this.el).html(template);
          $(this.el).i18n();

          this.$net = $('.content_network');

          var self = this;
          socket.on("systemusage", function(info) {
            info = $.parseJSON(info);
            delete info.cpu.cpu;
            self.renderCpu(info.cpu);
            self.renderMem(info.mem);
            self.renderNetwork(info.net);
          });
        },

        renderCpu: function (info) {
          var that = this;

          if (!this.cpuRender) {
            var leftBar = 0;
            var countCpu = info.length;
            _.each(info, function(cpu, name) {
              $(".cpus .content_bar", this.el).prepend("<div class='bar' data-cpu='" + name + "' style='height:" + cpu.total * 100 + "%;left:" + leftBar + "px;'></div>");
              leftBar = leftBar + 6;
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

        }, 
        renderMem: function(info) {
          var percentUsedMemory = 100-Math.round(100*(parseInt(info.cached)+parseInt(info.buffers)+parseInt(info.free))/parseInt(info.total));
          $(".memory .content_memory").html(percentUsedMemory+"%");
        },
        renderNetwork:function(info){

          var html = '';
          for ( ifaceName in info ) {
            var iface = info[ifaceName];
            html += _.template(networkUsageTemplate)( { name: ifaceName, iface: iface });
          }
          this.$net.html(html);
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
