var BaseClass = require('base-class-extend');

var TrackLineItem = require('../gui/track-line-item');
var ViewCommon = require('../gui/view-common');

var PianoRollTrackItem = require('../gui/piano-roll-track-item');

var PianoRollTrack = BaseClass.extend({

  owner: null,
  items: {},
  note: null,
  element: null,

  constructor: function(config) {
    this.note = config.note;
    this.id = config.note;
    this.owner = config.owner;

    this.element = $("#piano-roll-track-" + this.id);

    this.configure();
  },

  configure: function() {

    this.element[0].onclick=function(self) {
      return function(ev) {

        if(!self.owner.isWriteMode())
          return;

        var time = new Date().getTime();

        var itm = new PianoRollTrackItem({
          id: time,
          owner: self,
          start: ev.layerX,
        });

        self.addItem(itm);
      };
    }(this);
  },

  addItem: function(item) {
    this.items[item.id] = item;
  },

  deleteItem: function(item) {
    delete this.items[item.id];
  }

});

module.exports = PianoRollTrack;
