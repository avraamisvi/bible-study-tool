var BaseClass = require('base-class-extend');

var SeparatorContentVertical = BaseClass.extend({

  elementId: null,
  topElementController: null,
  bottomElementController: null,

  constructor: function() {
  },

  configure: function(elementId, top, bottom) {
    this.elementId = elementId;
    this.topElementController = top;
    this.bottomElementController = bottom;

    separatorContent2 = $(elementId);

    separatorContent2.mousedown(function(self){
      return function(e) {
        this.md = true;
        this.oldx = e.x;
        this.oldy = e.y;
        window.workspace.content.movingAnchor = this;
      }
    }(this));

    separatorContent2[0].stopDragging = function() {
      this.md = false;
    }

    separatorContent2[0].updateDragging = function(self){
      return function(e) {

         perc = (e.y - workspace.content.element.position().top)/workspace.content.element.height();

         /*if(self.content.height() * perc >= 10) {
           perc = 10/self.content.width();
         } else if(self.content.width() * perc <= 144) {
           perc = 144/self.content.width();
         }*/

         self.topElementController.heightPerc(100*perc + "%");
         self.bottomElementController.heightPerc(100*(1-perc) + "%");

         self.bottomElementController.refresh();
         self.topElementController.refresh();

        return false;
      };
    }(this);
  }
});

module.exports = SeparatorContentVertical;
