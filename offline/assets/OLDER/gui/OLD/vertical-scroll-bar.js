var BaseClass = require('base-class-extend');

var VerticalScrollBar = BaseClass.extend({

  initialPosition: 0,

  callback: function(dtx){},

  constructor: function() {
  },

  configure: function(scrollbar, iniPosition, callback) {
    this.initialPosition = iniPosition;
    this.callback = callback;

    var bar = document.getElementById(scrollbar);
    var barSvg = SVG.get(scrollbar);

    bar.onmousedown = function(e) {
      this.md = true;
      this.oldx = e.x;
      this.oldy = e.y;
    }

    bar.onmouseup = function(e) {
      this.md = false;
    }

    bar.onmouseleave = function(e) {
      this.md = false;
    }

    bar.onmousemove = function(self){
      return function(e) {
        if(this.md) {
           var dlty = e.y - this.oldy;
           this.oldy = e.y;

           newY = barSvg.y() + dlty;

           if(self.initialPosition > newY) {
             newY = self.initialPosition;
             dlty = 0;
           }

           barSvg.y(newY);
           self.callback(dlty);
          return false;
        }
      };
    }(this);
  }
});

module.exports = VerticalScrollBar;
