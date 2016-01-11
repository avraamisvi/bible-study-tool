var BaseClass = require('base-class-extend');
var CompositionPanel = require('../gui/composition-panel');

var CompositionToolbar = BaseClass.extend({

  compositionPanel: null,
  writeMode: false,
  buttonWrite: null,
  buttonDelete: null,
  toolbar: null,

  constructor: function() {
  },

  create: function(composition) {

    this.compositionPanel = composition;
    this.toolbar = composition.toolbar;

    this.toolbar.html("");
    this.toolbar.append(nunjucks.render(__dirname + '/templates/composition-toolbar-content-tmpl.html'));

    this.buttonWrite = $("#composition-toolbar-button-write-mode");
    this.buttonWrite[0].onclick = function(self) {
        return function(ev){
            self.toggleWriteMode();
        };
    }(this);

    this.buttonDelete = $("#composition-toolbar-button-delete-track-item");
    this.buttonDelete.click(function(self){
      return function(e) {
        self.compositionPanel.deleteSelectedTracksItems();
      }
    }(this));

    this.buttonAdd = $("#composition-toolbar-button-add-track-item");
    this.buttonAdd.click(function(self){
      return function(e) {
        config = {
            label: "New (" + (new Date().getTime()) + ")"
        };

        config.seconds = this.seconds;
        config.id = new Date().getTime();
        self.compositionPanel.addTrackLine(config);
      }
    }(this));

  },

  toggleWriteMode: function() {
    this.setWriteMode(!this.isWriteMode());
  },

  isWriteMode: function() {
    return this.writeMode;
  },

  setWriteMode: function(write) {

    this.writeMode = write;

    if(write) {
        this.buttonWrite.addClass("mini-toolbar-button-down");
    } else {
        this.buttonWrite.removeClass("mini-toolbar-button-down");
    }
  }
});

module.exports = CompositionToolbar;
