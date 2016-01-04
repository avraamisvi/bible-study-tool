var BaseClass = require('base-class-extend');
var StrongLexicon = require('../gui/strong-lexicon.js');
var BibleViewer = require('../gui/bible-viewer.js');

var Workspace = BaseClass.extend({

  DEFAULT_MODULE_DIR: "/home/abraao/desenvolvimento/projetos/estudos/bible/modules/",
  dictionary: null, //dicionario default

  constructor: function() {

    window.workspace = this;

    this.load();
  },

  load: function() {
    this.dictionary = new StrongLexicon();
    this.dictionary.load();
  },

  openModule: function(name) {
    var module = require(this.DEFAULT_MODULE_DIR + name + "/mod.js");

    if(module.type == "bible") {
      new BibleViewer(module);
    }
  },

  openDictionary: function(code) {
    console.log(this.dictionary.get(code));
  }
});

module.exports = Workspace;
