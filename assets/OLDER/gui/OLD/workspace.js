var BaseClass = require('base-class-extend');
var CompositionPanel = require('../gui/composition-panel');

var Workspace = BaseClass.extend({

  compositionPanel: null,

  constructor: function() {
  },

  load: function() {
    this.compositionPanel = new CompositionPanel();
  }

});

module.exports = Workspace;
