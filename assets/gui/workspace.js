var BaseClass = require('base-class-extend');
var StrongLexicon = require('../gui/strong-lexicon.js');
var BibleViewer = require('../gui/bible-viewer.js');
var DictionaryEntryManager = require("../gui/dictionary-entry-manager.js");
var RightManager = require("../gui/right-manager.js");
var ModulesManager = require("../gui/modules-manager.js");
var BrowserWindow = require('electron').remote.BrowserWindow;

var Workspace = BaseClass.extend({

  DEFAULT_MODULE_DIR: "/home/abraao/desenvolvimento/projetos/estudos/bible/modules/",
  dictionary: null, //dicionario default
  dictionaryManager: null,
  rightMenu: null,
  modulesManager: null,

  constructor: function() {

    window.workspace = this;

    this.load();
  },

  load: function() {
    this.modulesManager = new ModulesManager();
    this.dictionary = new StrongLexicon();
    this.dictionary.load();
    //this.rightMenu = new RightManager();

    //this.openModule("bible-byz-port");//TODO remover

    $(window).click(function(ev){
      workspace.removeFloatDialogs();
    });
  },

  removeFloatDialogs: function() {
    $("#dictionary-entry").remove();
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

  showDictionaryEntry: function(event, code, word) {

    event.stopImmediatePropagation();

    if(this.dictionaryManager) {
      this.dictionaryManager.show(event.clientX, event.clientY, code, word);
    } else {
      this.dictionaryManager = new DictionaryEntryManager(event.clientX, event.clientY, this.dictionary, code);
    }
  }
});

module.exports = Workspace;
