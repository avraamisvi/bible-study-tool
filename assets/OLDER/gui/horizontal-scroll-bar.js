var BaseClass = require('base-class-extend');

var HorizontalScrollBar = BaseClass.extend({

  initialPosition: 0,
  maxPosition: 0,
  bar: null,

  callback: function(dtx){},

  constructor: function() {
  },

  configure: function(scrollbar, iniPosition, maxPos, callback) {
    this.initialPosition = iniPosition;
    this.callback = callback;
    this.maxPosition = maxPos;

    var bar = $(scrollbar)[0];
    var barQuery = $(scrollbar);

    this.bar = barQuery;

    bar.onmousedown = function(e) {
      this.md = true;
      this.oldx = e.x;
      this.oldy = e.y;
      window.movingAnchor = this;
    }

    bar.stopDragging = function() {
      this.md = false;
    }

    bar.updateDragging = function(self){
      return function(e) {
      //  if(this.md) {
           var dltx = e.x - this.oldx;
           this.oldx = e.x;

           newX = barQuery.position().left + dltx;

           if(self.initialPosition > newX) {
             newX = self.initialPosition;
             dltx = 0;
           }

           newX = self.maxPosition(newX);//verifica se chegou no limite, senao continua retornando o newX passado;

           barQuery.css({
             left: newX
           });

           self.callback(dltx);
        //}
        return false;
      };
    }(this);
  },

  processWheel: function(ev) {
    //this.deltaX = -0;
     //ev.deltaY = -53;

     var dltx = ev.deltaY < 0? -10: 10;

     newX = this.bar.position().left + dltx;

     if(this.initialPosition > newX) {
       newX = this.initialPosition;
       dltx = 0;
     }

     newX = this.maxPosition(newX);//verifica se chegou no limite, senao continua retornando o newX passado;

     this.bar.css({
       left: newX
     });

     this.callback(dltx);

    return false;
  }
});

module.exports = HorizontalScrollBar;
