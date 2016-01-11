var BaseClass = require('base-class-extend');
var ViewCommon = require('../gui/view-common');
var PianoRollTrack = require('../gui/piano-roll-track');

var PianoRollBoard = BaseClass.extend({

  owner: null,
  element: null,
  boardLoaded: null,
  tracks: null,
  itemsSelected: {},
  writeMode: false,

  constructor: function(owner) {
    this.owner = owner;
    this.create();
  },

  create: function() {

    this.boardLoaded = nunjucks.render(__dirname + '/templates/piano-roll-board-tmpl.html',
    {
      id: this.owner.id,
      notes: this.owner.notes//this.generate()//this.owner.instrument.instrument.notes
    });

  },

  isWriteMode: function() {
    return this.writeMode;
  },

  setWriteMode: function(write) {
    this.writeMode = write;
  },

  show: function() {
    this.element = $("#piano-roll-board-container");
    this.element.html("");
    this.element.append(this.boardLoaded);

    if(this.tracks) {
      //TODO reconfigurar
      /*
      for(trk in this.tracks) {
          this.tracks[trk].reconfigure();
      }
      */
    } else {

      this.tracks = {};

      for(i = 0; i < this.owner.notes.length; i++) {
          track = new PianoRollTrack({
            note: this.owner.notes[i].id,
            owner: this
          });
          this.tracks[this.owner.notes[i].id] = track;
      }
    }
  },

  onwheel: function(callback) {
    this.element[0].onwheel = callback;
  },

  refreshSeconds: function() {
    wid = new ViewCommon().translateSecondsWidth(workspace.seconds);
    this.element.width(wid)
  },

  width: function() {
    return this.element.width();
  },

  height: function() {
    return this.element.height();
  },

  left: function(pos) {

    if(pos) {
      this.element.css({
        left: pos
      });
    }

    return this.element.position().left;
  },

  top: function(pos) {

    if(pos) {
      this.element.css({
        top: pos
      });
    }

    return this.element.position().top;
  },

  selectItem: function(item) {
    this.itemsSelected[item.id] = item;
  },

  unSelectItem: function(item) {
    delete this.itemsSelected[item.id];
  },

  deleteSelectedItems: function() {
    for(ti in this.itemsSelected) {
      this.itemsSelected[ti].delete();
      delete this.itemsSelected[ti];
    }
  },

  playNote: function(note) {
    //=== SERVER ===
    window.elecSoundClient.play_instrument({
      instrumentItemId: this.id,
      note: this.initialLoopSeqIndex + note
    });
  },

});

module.exports = PianoRollBoard;
