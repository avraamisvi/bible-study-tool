var BaseClass = require('base-class-extend');
var nunjucks = require('nunjucks');

var RightManager = BaseClass.extend({

  constructor: function() {
    this.element = $("#right");

    this.load();
  },

  load: function() {
    this.element.html(nunjucks.render(__dirname + '/templates/right-menu-tmpl.html', {
      nope: "nada"
    }));
  }

});

module.exports = RightManager;
