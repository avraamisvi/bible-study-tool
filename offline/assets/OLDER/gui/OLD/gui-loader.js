var BaseClass = require('base-class-extend');
var $  = require('jquery');
var SVGJS  = require('svg.js');

var GuiLoader = BaseClass.extend({
  constructor: function() {
  },

  loadComponent: function(name, dest, success, error) {

    $.ajax({
      url: "./assets/gui/components/" + name,
      data: '',
      success: function(data){

        id = data.rootElement.id;

        $("#"+dest).html(data.rootElement);

        success(SVGJS(id));
      },
      dataType: 'xml',
      error: function(e) {
        error(e);
      }
    });
  }
});

module.exports = GuiLoader;
