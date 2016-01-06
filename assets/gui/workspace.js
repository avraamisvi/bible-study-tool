var BaseClass = require('base-class-extend');
var StrongLexicon = require('../gui/strong-lexicon.js');
var BibleViewer = require('../gui/bible-viewer.js');
var DictionaryEntryManager = require("../gui/dictionary-entry-manager.js");
var BrowserWindow = require('electron').remote.BrowserWindow;

var Workspace = BaseClass.extend({

  DEFAULT_MODULE_DIR: "/home/abraao/desenvolvimento/projetos/estudos/bible/modules/",
  dictionary: null, //dicionario default
  dictionaryManager: null,

  constructor: function() {

    window.workspace = this;

    this.load();
  },

  load: function() {
    this.dictionary = new StrongLexicon();
    this.dictionary.load();

    this.openModule("bible-byz-port");//TODO remover
  },

  openModule: function(name) {
    var module = require(this.DEFAULT_MODULE_DIR + name + "/mod.js");

    if(module.type == "bible") {
      new BibleViewer(module);
    }
  },

  /*openDictionary: function(code) {
    //win = window.open("dictionary.html", "Dictionary", "toolbar=false");

    if(this.dictionaryWindow == null) {
      this.dictionaryWindow = new BrowserWindow({width: 300, height: 600});
      this.dictionaryWindow.setMenuBarVisibility(false);
      this.dictionaryWindow.loadUrl('file://' + __dirname + '/dictionary.html');
      this.dictionaryWindow.openDevTools();

      this.dictionaryWindow.webContents.on('did-finish-load', function(data){
        return function(ev) {
          data.dictionaryWindow.webContents.send('loadEntry', {
            code: data.code,
            dictionary: data.dictionary //TODO carregar o novamente dicionario? ta pesando um pouco para passar o objeto talvez seja melhor carregar ele do zero na outra janela
          });
        }
      }({
        code: code,
        dictionary: this.dictionary,
        dictionaryWindow: this.dictionaryWindow
      }));

      this.dictionaryWindow.on('closed', function() {
        console.log("FECHOU");
      });
    }

    console.log(this.dictionary.get(code));
  }*/

  showDictionaryEntry: function(code) {
    if(this.dictionaryManager) {
      this.dictionaryManager.show();
    } else {
      this.dictionaryManager = new DictionaryEntryManager(this.dictionary, code);
    }
  }
});

module.exports = Workspace;
