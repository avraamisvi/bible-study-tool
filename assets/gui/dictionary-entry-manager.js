var BaseClass = require('base-class-extend');
//var StrongLexicon = require('../gui/strong-lexicon.js');
var nunjucks = require('nunjucks');

var DictionaryEntryManager = BaseClass.extend({

  dictionary: null, //dicionario default
  current: null,

  constructor: function(x, y, dict, code, word) {
    this.element = $("#body");
    this.dictionary = dict;

    this.show(x, y, code, word);
  },

  show: function(x, y, code, word) {

    $("#dictionary-entry").remove();//se existe remove

    this.current = this.dictionary.get(code, word);

    this.element.append(nunjucks.render(__dirname + '/templates/dictionary-tmpl.html', {
      entry: this.current,
      code: code,
      dictionaryName: this.dictionary.name
    }));

    $("#dictionary-entry").css({
      top: y,
      left: x
    });
  }

});

module.exports = DictionaryEntryManager;
