var BaseClass = require('base-class-extend');

var InstrumentsToolbar = BaseClass.extend({

  buttonDelete: null,
  buttonSettings: null,
  toolbar: null,
  instrumentPanel: null,

  constructor: function(panel) {
    this.instrumentPanel = panel;
    this.create();
  },

  create: function() {

    this.toolbar = $("#instrument-panel-toolbar");

    this.toolbar.html("");
    this.toolbar.append(nunjucks.render(__dirname + '/templates/instruments-toolbar-tmpl.html'));

    this.buttonDelete = $("#instruments-toolbar-button-delete-item");
    this.buttonDelete.click(function(self){
      return function(e) {
        self.instrumentPanel.deleteSelectedItem();
      }
    }(this));

    this.buttonSettings = $("#instruments-toolbar-button-options-item");
    this.buttonSettings.click(function(self){
      return function(e) {
        self.instrumentPanel.showSettingsSelectedItem();
      }
    }(this));
  },

  height: function() {
    return this.toolbar.height();
  },

  width: function() {
    return this.toolbar.width();
  }
});

module.exports = InstrumentsToolbar;
