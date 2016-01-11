var BaseClass = require('base-class-extend');

var $  = require('jquery');
var ViewCommon = require('../gui/view-common');

var PianoRollTrackItem = BaseClass.extend({

  owner: null,
  board: null,
  id: null,
  note: null,
  start: 0,
  frame: null,
  selected: false,
  instrument: null,
  instrumentItemId: null,
  onInstrumentItemDelete: null,
  onInstrumentItemChangeColor: null,

  constructor: function(config) {
    this.configure(config)
  },

  configure: function(config){
    this.owner = config.owner;
    this.board = config.owner.owner;
    this.id = config.id;
    this.note = config.owner.note;
    this.instrument = this.owner.owner.owner.instrument;
    this.instrumentItemId = this.owner.owner.owner.instrument.id;
    this.start = new ViewCommon().translateWidthSeconds(config.start);

    this.owner.element.append(nunjucks.render(__dirname + '/templates/piano-roll-item-tmpl.html', {
      note: this.id,
      instrument: this.instrumentItemId
    }));

    localid = "#piano-roll-item-" + this.id;

    this.frame = $(localid);

    var element = this.frame;
    var anchright = $("#piano-roll-item-anchor-right-" + this.id);

    anchright.css({
      left: element.width() - anchright.width()
    });

//###########################################
    element[0].onclick=function(self) {
      return function(ev) {

        if(!this.moved)
          self.select();

        this.moved = false;
        ev.stopImmediatePropagation();
        return false;
      };
    }(this);

    element.css({
      left: config.start
    });

    element[0].onmousedown = function(e) {
      this.moved = false;
      this.md = true;
      this.oldx = e.x;
      this.oldy = e.y;
      window.movingAnchor = this;
    }

    element[0].stopDragging = function(self){
      return function() {
        this.md = false;


        self.start = new ViewCommon().translateWidthSeconds(element.position().left);
        self.setInfoIntoServer();
      };
    }(this);

    element[0].updateDragging = function(self){
      return function(e) {
        //if(this.md) {
           this.moved = true;
           var dltx = e.x - this.oldx;
           this.oldx = e.x;

           newX = element.position().left + dltx;

           if(newX < 0) {
             newX = 0;
           }

           element.css({
             left: newX
           });

           //ev.stopImmediatePropagation();
        //}
      };
    }(this);

//###############################################

    anchright[0].onclick=function(ev) {
      ev.stopImmediatePropagation();
      return false;
    };

    anchright[0].onmousedown = function(e) {
      this.md = true;
      this.oldx = e.x;
      this.oldy = e.y;
      window.movingAnchor = this;
      e.stopImmediatePropagation();
    }

    anchright[0].stopDragging = function(self) {
      return function() {
        this.md = false;
        self.setInfoIntoServer();//depois de ajustado commita no server
      };
    }(this);

    anchright[0].updateDragging = function(self){
      return function(e) {

         var dltx = e.x - this.oldx;
         this.oldx = e.x;

         if(element.width() + dltx > 5) {
           element.width(element.width() + dltx);
           //itemLabel.width(element.width() - anchright.width());

           anchright.css({
             left: element.width() - anchright.width()
           });

        }
      };
    }(this);

    this.createIntoServer();
  },

  select: function() {

    this.selected = !this.selected;

    if(!this.selected) {
      this.board.unSelectItem(this);
    } else {
      this.board.selectItem(this);
    }

    this.frame.toggleClass("selected"); //piano-roll-item-selected
  },

  delete: function() {
    this.board.unSelectItem(this);
    this.owner.deleteItem(this);
    this.frame.remove();

    this.removeFromServer();
  },

  createIntoServer: function () {
    //=== SERVER ===
    window.elecSoundClient.add_pianoroll_entry({
      instrumentItemId: this.instrumentItemId,
      entryId: this.id,
      note: this.note,
      duration: new ViewCommon().translateWidthSeconds(this.frame.width()),
      when: this.start
    });
  },

  removeFromServer: function () {
    //=== SERVER ===
    window.elecSoundClient.remove_pianoroll_entry({
      entryId: this.id,
    	instrumentItemId: this.instrumentItemId,
    });
  },

  setInfoIntoServer: function () {

    var wd = this.frame.width();

    //=== SERVER ===
    window.elecSoundClient.set_pianoroll_entry({
      instrumentItemId: this.instrumentItemId,
      entryId: this.id,
      duration: new ViewCommon().translateWidthSeconds(wd),//TODO ver isso  <= 6? 1 : wd
      when: new ViewCommon().translateWidthSeconds(this.frame.position().left),
    });
  },

});

module.exports = PianoRollTrackItem;
