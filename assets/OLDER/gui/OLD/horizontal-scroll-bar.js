var BaseClass = require('base-class-extend');

var HorizontalScrollBar = BaseClass.extend({

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
           var dltx = e.x - this.oldx;
           this.oldx = e.x;

           newX = barSvg.x() + dltx;

           if(self.initialPosition > newX) {
             newX = self.initialPosition;
             dltx = 0;
           }

           barSvg.x(newX);
           self.callback(dltx);
          return false;
        }
      };
    }(this);
  }
});

module.exports = HorizontalScrollBar;
