var BaseClass = require('base-class-extend');

var SeparatorContentHorizontal = BaseClass.extend({

  elementId: null,
  content: null,
  contentDesloc: null,
  grabber: null,

  constructor: function() {
  },

  configure: function(elementId, content, contentDesloc) {
    this.elementId = elementId;
    this.content = $(content);
    this.contentDesloc = $(contentDesloc);

    this.grabber = separatorContent2 = $(elementId);

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
        
         perc = (e.x - self.content.position().left)/self.content.width();
         move = e.x;

         if(self.content.width() * perc >= 470) {
           perc = 470/self.content.width();
           move = 470 + self.content.position().left;
         } else if(self.content.width() * perc <= 144) {
           perc = 144/self.content.width();
           move = 144 + self.content.position().left;
         }

         self.contentDesloc.css({
           width: 100*perc + "%"
         })

         self.grabber.css({
           left: move
        });

         workspace.content.refresh();
         workspace.compositionPanel.refresh(false);
         workspace.instrumentPanel.refresh();
        return false;
      };
    }(this);
  }
});

module.exports = SeparatorContentHorizontal;
