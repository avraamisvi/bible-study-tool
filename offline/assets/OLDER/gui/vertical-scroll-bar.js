var BaseClass = require('base-class-extend');

var VerticalScrollBar = BaseClass.extend({

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
           var dlty = e.y - this.oldy;
           this.oldy = e.y;

           newY = barQuery.position().top + dlty;

           console.log(self.initialPosition);
           if(self.initialPosition > newY) {
             newY = self.initialPosition;
             dlty = 0;
           }

           newY = self.maxPosition(newY);//verifica se chegou no limite, senao continua retornando o newX passado;

           barQuery.css({
             top: newY
           });

           self.callback(dlty);
        //}
        return false;
      };
    }(this);
  },

  processWheel: function(ev) {
    //this.deltaX = -0;
     //ev.deltaY = -53;

     var dlty = ev.deltaY < 0? -10: 10;

     newY = this.bar.position().top + dlty;

     if(this.initialPosition > newY) {
       newY = this.initialPosition;
       dlty = 0;
     }

     newY = this.maxPosition(newY);//verifica se chegou no limite, senao continua retornando o newX passado;

     this.bar.css({
       top: newY
     });

     this.callback(dlty);
  }
});

module.exports = VerticalScrollBar;
