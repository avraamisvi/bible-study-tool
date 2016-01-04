var BaseClass = require('base-class-extend');

/**
  All draggable objects should use this class
*/
var Draggable = BaseClass.extend({

  element: null,

  onlyY: false,
  onlyX: false,

  ondrag: function(ev){},
  maxPosition: function(dtx, dty){},

  constructor: function(eleId, ondrag, maxPosition) {
    this.configure(eleId, ondrag, maxPosition)
  },

  configure: function(eleId, ondrag, maxPosition) {
    this.element = $(eleId);
    this.maxPosition = maxPosition;
    this.ondrag = ondrag;

    this.element[0].onmousedown = function(e) {
      this.md = true;
      this.oldx = e.x;
      this.oldy = e.y;
      window.movingAnchor = this;
      e.stopImmediatePropagation();
    }

    this.element[0].stopDragging = function() {
      this.md = false;
    }

    this.element[0].updateDragging = function(self){
      return function(e) {
           var dltx = e.x - this.oldx;
           var dlty = e.y - this.oldy;
           this.oldx = e.x;
           this.oldy = e.y;

           newX = self.element.position().left + dltx;
           newY = self.element.position().top + dlty;

           result = self.maxPosition(newX, newY);//verifica se chegou no limite

           if(self.onlyY) {
             self.element.css({
               top: result.y
             });
           } else if(self.onlyX) {
             self.element.css({
               left: result.x
             });
           } else {
             self.element.css({
               left: result.x,
               top: result.y
             });
           }

           self.ondrag(dltx,dlty);

           e.stopImmediatePropagation();
        return true;
      };
    }(this);
  },

  setOnlyY: function(flag) {
    this.onlyY = flag;
    if(flag) this.onlyX = false;
  },

  setOnlyX: function(flag) {
    this.onlyX = flag;
    if(flag) this.onlyY = false;
  }

});

module.exports = Draggable;
