var BaseClass = require('base-class-extend');

var InstrumentsLibraryToolbar = BaseClass.extend({

  buttonDelete: null,
  buttonSettings: null,
  toolbar: null,
  owner: null,

  constructor: function(panel) {
    this.owner = panel;
    this.create();
  },

  create: function() {

    this.toolbar = $("#instruments-library-panel-toolbar");

    this.toolbar.html("");
    this.toolbar.append(nunjucks.render(__dirname + '/templates/instruments-library-toolbar-tmpl.html'));

    /*this.buttonDelete = $("#instruments-toolbar-button-delete-item");
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
    }(this));*/
  },

  height: function() {
    return this.toolbar.height();
  },

  width: function() {
    return this.toolbar.width();
  }
});

module.exports = InstrumentsLibraryToolbar;
