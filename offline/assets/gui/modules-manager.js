var fs = require('fs');
var path = require('path');
var BaseClass = require('base-class-extend');
//var nunjucks = require('nunjucks');
var BibleViewer = require('../gui/bible-viewer.js');
var OS = require('os');

var ModulesManager = BaseClass.extend({

  DEFAULT_MODULE_DIR: OS.homedir() + "/.bible-study-tools/modules/",

  constructor: function() {

  },

  show: function() {
    this.load(this.getDirectories(this.DEFAULT_MODULE_DIR));
  },

  getDirectories: function(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
      return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  },

  load: function(modules) {
    this.element = $("#right");
    this.element.html(nunjucks.render(__dirname + '/templates/modules-list-tmpl.html', {
      modules: modules,
      getModuleLabel: this.getModuleLabel
    }));
  },

  openModule: function(name) {
    try {
      var module = require(this.DEFAULT_MODULE_DIR + name + "/mod.js");

      if(module.type == "bible") {
        new BibleViewer(module);
      }
    } catch(ex) {
      alert("This module can not be opened.");
    }
  },

  getModuleLabel: function(module) {
    try {
      var temp = require(window.workspace.modulesManager.DEFAULT_MODULE_DIR + "/" + module + "/mod.js");
      return temp.name;
    } catch(ex) {
      console.error(ex);
      return module;
    }

  }

});

module.exports = ModulesManager;
