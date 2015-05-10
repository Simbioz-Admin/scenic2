define(

  /** 
   *  View Source
   *  The source view is for each source type quiddity create whatsoever to control or transfer table
   *  @exports Views/Launch
   */

  [
    'underscore',
    'backbone',
    'lib/socket',
    'views/connexion',
    'views/shmdata',
    'text!../../templates/source.html'
  ],

  function(_, Backbone, socket, ConnexionView, ViewShmdata, TemplateSource) {

    /** 
     *  @constructor
     *  @requires Underscore
     *  @requires Backbone
     *  @requires TemplateSource
     *  @augments module:Backbone.View
     */

    var SourceView = Backbone.View.extend(

      /**
       *  @lends module: Views/source~SourceView.prototype
       */

      {
        tagName: 'div',
        className: 'source',
        table: null,
        events: {
          "click .edit-source": "edit",
          "click .remove-source": "removeClick",
          "click .preview": "preview",
          'click .info': 'info'
        },

        /* Called when en new source quiddity is created */

        initialize: function(options) {
          /* Subscribe for remove and change shmdatas on quiddity source */
          this.model.on('destroy', this.removeView, this);
          this.model.on('updateShmdatas', this.render, this);
          this.model.on('updateConnexions', this.updateConnexions, this);
          this.model.on("toggleShow", this.toggleShow, this);
          var that = this
          // this.model.on('updateByteRate', this.updateByteRateAndPreview);
          this.table = options.table;
          // FIXME: properly handle renders from views rather than passing through socket.io
          socket.on("remove_connection", function(path, id) {
            // console.log("views->source remove_connection", that, path, id);
            that.render();
          });
          socket.on("add_connection", function(quiddName, path, port, id) {
            // console.log("views->source add_connection", that, quiddName, path, port, id);
            that.render();
          });


          $("#" + this.table.get("id") + " .sources").append(this.el);

          /* we check if the category of this quidd exist in filter table */
          this.table.trigger("addCategoryFilter", this.model.get("category"));

          var quiddTpl = _.template(TemplateSource)( {
            name: this.model.get("name")
          });

          $(this.el).append(quiddTpl);
          this.render();
        },

        render: function() {
          var that = this;
          //Render Shmdata of this source
          $(".shmdatas", that.el).html("");

          var shmdatas = this.model.get("shmdatasCollection");
          var shmdataWriters = shmdatas.where({
            type: 'writer'
          });

          if (shmdataWriters.length > 0) {

            _.each(shmdataWriters, function(shm) {
              var viewShm = new ViewShmdata({
                model: shm,
                modelQuidd: that.model,
                table: that.table
              });
              $(".shmdatas", that.el).append(viewShm.el);
              viewShm.render();
            });
          }
        },

        updateConnexions: function() {
          this.model.get('shmdatasCollection').each(function(shm) {
            shm.trigger('renderConnection')
          });
        },

        /* called when we want to have a preview of the quiddity (audio or video) */

        setPreview: function(shmdata) {

          var that = this;

          //get info about vumeter for know if we can create a preview
          collections.quidds.getPropertyValue("vumeter_" + shmdata.path, "caps", function(info) {
            info = info.split(",");

            if (info[0] == "audio/x-raw-int" || info[0] == "audio/x-raw-float" || info[0] == "video/x-raw-yuv" || info[0] == "video/x-raw-rgb") {

              var type = (info[0].indexOf("video") >= 0 ? "gtkvideosink" : "pulsesink");
              //check if the quiddity have already a preview active
              socket.emit("get_quiddity_description", that.model.get("name") + type, function(quiddInfo) {
                var active = (quiddInfo.name ? "active" : "");
                $("[data-path='" + shmdata.path + "'] .nameInOut .short").append("<div class='preview " + active + "'></div>");
              });
            }
          });

        },

        toggleShow: function(state, tableName) {

          /* trigger is called for all destination, we need to check if its for the good table */
          if (this.table.get("name") == tableName) {
            if (state == "show") $(this.el).show();
            else $(this.el).hide();
          }
        },

        edit: function() {
          this.model.edit();
        },
        removeClick: function() {
          this.model.askDelete();
        },
        removeView: function() {
          // remove category in filter (check if its the last quidd of this category) 
          this.remove();
          this.table.trigger('removeCategoryFilter', this.model.get("category"), "source");
        },
        preview: function(element) {
          this.model.preview(element);
          $(element.target).toggleClass("active");
        },
        info: function(element) {
          this.model.info(element);
        }
      });

    return SourceView;
  })
