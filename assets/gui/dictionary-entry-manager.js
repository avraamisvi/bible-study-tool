var BaseClass = require('base-class-extend');
//var StrongLexicon = require('../gui/strong-lexicon.js');
var nunjucks = require('nunjucks');

var DictionaryEntryManager = BaseClass.extend({

  dictionary: null, //dicionario default
  current: null,

  constructor: function(dict, code, word) {
    this.element = $("#dictionary-entry");
    this.dictionary = dict;
    this.current = this.dictionary.get(code, word);

    this.load();
  },

  load: function() {
    this.element.html(nunjucks.render(__dirname + '/templates/dictionary-tmpl.html', {
      entry: this.current
    }));
  },

  show: function(code, word) {

    this.current = this.dictionary.get(code, word);

    this.element.html(nunjucks.render(__dirname + '/templates/dictionary-tmpl.html', {
      entry: this.current
    }));
  }

});

module.exports = DictionaryEntryManager;
