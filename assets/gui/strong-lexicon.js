var BaseClass = require('base-class-extend');
var fs = require('fs');

var StrongLexicon = BaseClass.extend({

  greek: null,

  constructor: function() {

  },

  load: function() {

    //TODO ler de uma pasta default do sistema tipo um .biblestudytool
    var text = fs.readFileSync(workspace.DEFAULT_MODULE_DIR + 'strong-lexicon/strongs-greek-dictionary.js', 'utf8');

    try {
      this.greek = JSON.parse(text);
    } catch(ex) {
      console.log(ex);
    }

    //console.log(this.greek);
  },

  get: function(code) {
    return this.greek[code];
  }

});

module.exports = StrongLexicon;
