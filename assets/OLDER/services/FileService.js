var BaseClass = require('base-class-extend');
var fs = require('fs');
var remote = require("remote");
var Dialog = remote.require("dialog");

var FileService = BaseClass.extend({//todo balao de mensagem indicando operacao

  constructor: function FileService() {
    window.fileService = this;
    this.projectFile = null;
  },

  get ProjectFile() {
    return this.projectFile;
  },

  set ProjectFile(projectFile) {
    this.projectFile = projectFile;
    this.configureElecSoundTitle(projectFile);
  },

  configureElecSoundTitle: function(filename) {
    document.title = "EleCsound - " + filename;
  },

  saveComposition: function(composition) {

    if(this.projectFile) {
      this.openSave(this.projectFile, composition);
    } else {

      Dialog.showSaveDialog(remote.getCurrentWindow(), {
        defaultPath: "~",
        title: "Save Project",
        filters: [ { name: 'EleCsound Files', extensions: ['elc'] } ]
      }, function(self) {
        return function(filename){
          if(filename) {

            self.ProjectFile = filename;
            self.openSave(filename, composition);
          }
        }
      }(this));
    }
  },

  saveAsComposition: function(composition) {

      Dialog.showSaveDialog(remote.getCurrentWindow(), {
        defaultPath: "~",
        title: "Save Project",
        filters: [ { name: 'EleCsound Files', extensions: ['elc'] } ]
      }, function(self) {
        return function(filename){
          if(filename) {
            self.ProjectFile = filename;
            self.openSave(filename, composition);
          }
        }
      }(this));

  },

  openSave: function(filename, composition) {
    fs.open(filename, 'w', function(self){
      return function(err, fd) {
        if(!err) {
          self.save(fd, composition)
        }
      }
    }(this))
  },

  save: function(fd, composition) {
    fs.write(fd, JSON.stringify(composition), function(err, bytesWritten, string) {
      //TODO caixa de mensagem de erro, balao ou coisa do tipo
      if(err) {
        alert("Erro when saving composition:" + err);
      }

    })
  },

  openLoadDialog: function(loadCallBack) {
    Dialog.showOpenDialog(remote.getCurrentWindow(), {
      properties: ['openFile'],
      filters: [ { name: 'EleCsound Files', extensions: ['elc'] } ]
    },
    function(self) {
      return function(filename){
        if(filename) {
          self.ProjectFile = filename[0];
          self.openLoad(filename[0], loadCallBack);
        }
      }
    }(this)
    )
  },

  openLoad: function(filename, loadCallBack) {

    console.log(filename)

    fs.readFile(filename, function(self){
      return function(err, data) {

        if (err) throw err;

        if(!err) {
          self.load(data, loadCallBack)
        }
      }
    }(this)
    );
  },

  load: function(data, loadCallBack) {
    loadCallBack(JSON.parse(data));
  }

});

module.exports = FileService;
