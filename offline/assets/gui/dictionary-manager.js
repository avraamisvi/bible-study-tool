var BaseClass = require('base-class-extend');
//var StrongLexicon = require('../gui/strong-lexicon.js');
var nunjucks = require('nunjucks');

var DictionaryManager = BaseClass.extend({

  dictionary: null, //dicionario default
  current: null,

  constructor: function(dict, code) {
    this.element = $("#main");
    this.dictionary = dict;
    this.current = this.dictionary.get(code);
    this.load();
  },

  load: function() {
    this.element.html(nunjucks.render(__dirname + '/templates/dictionary-tmpl.html', {
      entry: this.current
    }));
  }

});

module.exports = DictionaryManager;
