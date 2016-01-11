var BaseClass = require('base-class-extend');
var Draggable = require('../gui/draggable');

var InstrumentAmplitudeDialog = BaseClass.extend({

  element: null,
  instrumentItem: null,
  amplitude: 0,

  constructor: function(instrumentItem) {
    this.instrumentItem = instrumentItem;
    this.configure();
  },

  configure: function() {

    this.amplitude = this.instrumentItem.amplitude;

    this.instrumentItem.element.append(nunjucks.render(__dirname + '/templates/instrument-amplitude-dialog-tmpl.html', {
      id: this.instrumentItem.id
    }));

    this.element = $("#instrument-amplitude-dialog-panel-"+this.instrumentItem.id);

    drag = new Draggable("#instrument-amplitude-dialog-panel-"+this.instrumentItem.id, function(self){
      return function(dtx,dty){//ondrag
      }
    }(this),function(self){
      return  function(newX, newY){//maxPosition

        if(newY >= 8) {
          newY = 8;
        }

        if(newY < -80) {
          newY = -80;
        }
        return {x:newX,y:newY};
      };
    }(this));
    drag.setOnlyY(true);

    drag = new Draggable("#instrument-amplitude-dialog-slider-buttom-"+this.instrumentItem.id, function(self){
      return function(dtx,dty){//ondrag
      }
    }(this),function(self){
      return  function(newX, newY){//maxPosition

        if(newY >= 104) {
          newY = 104;
        }

        if(newY < 8) {
          newY = 8;
        }

        x = newY - 8;
        y=(100 * x)/96

        self.amplitude = y/100;

        return {x:newX,y:newY};
      };
    }(this));

    drag.setOnlyY(true);

    $("#instrument-amplitude-dialog-slider-buttom-"+this.instrumentItem.id).css({
      top: (this.amplitude * 96)+8
    })

    $("#instrument-amplitude-dialog-ok-buttom-"+this.instrumentItem.id).click(function(self){
      return function(ev) {
        self.instrumentItem.setAmplitude(self.amplitude);
        self.element.remove();
      };
    }(this))
  }
});

module.exports = InstrumentAmplitudeDialog;
