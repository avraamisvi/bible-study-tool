var BaseClass = require('base-class-extend');

var ContentPanel = BaseClass.extend({

  moveAnchor: null,
  element: null,
  pianoRollOpened: null,

  constructor: function() {
    this.configure();

    $( window ).resize(function(self) {
      return function() {
        self.refresh();
      };
    }(this));
  },

  refresh: function() {
      this.element.height(workspace.getVisibleAreaHeight());

      if(this.pianoRollOpened) {
        this.pianoRollOpened.refresh();
      }
  },

  configure: function() {
    this.element = $("#content");

    this.element[0].onmousemove = function(self) {
      return function(ev) {
        if(self.movingAnchor) {
            console.log(ev);
            self.movingAnchor.updateDragging(ev);
            ev.stopImmediatePropagation();
        }
      }
    }(this);

    this.element[0].onmouseup = function(self) {
      return function(ev) {
        if(self.movingAnchor) {
            self.movingAnchor.stopDragging();
            ev.stopImmediatePropagation();
        }
        self.movingAnchor = null;
      };
    }(this);
  },

  height: function() {
    return this.element.height();
  },

  //TODO is this the most adequate approach?
  getCompositionPanelHeight: function() {

    if(this.pianoRollOpened) {
      heig = 1 - (this.pianoRollOpened.height()/this.height());
      heig = heig * 100;
      return heig + "%";
    } else {
      return "100%";
    }
  }

});

module.exports = ContentPanel;
