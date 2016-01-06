var BaseClass = require('base-class-extend');
//var StrongLexicon = require('../gui/strong-lexicon.js');
var nunjucks = require('nunjucks');

var DictionaryEntryManager = BaseClass.extend({

  dictionary: null, //dicionario default
  current: null,

  constructor: function(dict, code) {
    this.element = $("#footer");
    this.dictionary = dict;
    this.current = this.dictionary.get(code);

    console.log(this.current);
    console.log(this.current.lemma);

    this.load();
  },

  load: function() {
    this.element.html(nunjucks.render(__dirname + '/templates/dictionary-tmpl.html', {
      entry: this.current
    }));
  },

  show: function() {

  }

});

module.exports = DictionaryEntryManager;
