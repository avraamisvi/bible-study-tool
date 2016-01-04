var BaseClass = require('base-class-extend');

var $  = require('jquery');
var ViewCommon = require('../gui/view-common');

var TrackLineItem = BaseClass.extend({

  owner: null,
  id: null,
  start: 0,
  frame: null,
  selected: false,
  instrument: null,
  instrumentItemId: null,
  onInstrumentItemDelete: null,
  onInstrumentItemChangeColor: null,

  constructor: function() {
  },

  configure: function(config){
    this.owner = config.owner;
    this.id = config.id;
    this.instrument = config.instrument;
    this.instrumentItemId = config.instrumentItemId;//TODO rever isso, id do instrument item
    this.start = new ViewCommon().translateWidthSeconds(config.start);

    //TODO mover a criação do tracklineitem para dentro do tracklineitem class
    $("#composition-track-" + this.owner.id).append(nunjucks.render(__dirname + '/templates/track-item-tmpl.html', {
      time: this.id, //TODO renomear para id no template
      label: this.instrument.name,
      instrument: this.instrumentItemId,//instrument.id,
      header_color: config.color.header,
      body_color: config.color.body
      }));

    localid = "#track-line-item-"+this.id;

    this.frame = $(localid);

    var element = this.frame;
    var anchright = $("#track-line-item-anchor-right-" + this.id);
    var itemLabel = $("#track-line-item-label-" + this.id);

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

    this.onInstrumentItemChangeColor = function(self) {
      return function(ev) {
        self.changeColor(ev);
      };
    }(this);

    this.onInstrumentItemDelete = function(self) {
      return function(ev) {
        self.delete();
      };
    }(this);

    //console.log('Esperado: ' + EventInstrumentItemChangeColor + this.instrumentItemId);

    document.addEventListener(EventInstrumentItemDelete + this.instrumentItemId, this.onInstrumentItemDelete, false);
    document.addEventListener(EventInstrumentItemChangeColor + this.instrumentItemId, this.onInstrumentItemChangeColor, false);
    document.addEventListener(EventTrackLineDelete + this.owner.id, this.onInstrumentItemDelete, false);

    this.createIntoServer();
  },

  select: function() {

    this.selected = !this.selected;

    if(!this.selected) {
      this.owner.composition.unSelectTrackItem(this);
    } else {
      this.owner.composition.selectTrackItem(this);
    }

    this.frame.toggleClass("track-line-item-selected");
  },

  delete: function() {
    this.owner.composition.unSelectTrackItem(this);
    this.owner.deleteItem(this);
    this.frame.remove();

    document.removeEventListener(EventInstrumentItemDelete + this.instrumentItemId, this.onInstrumentItemDelete, false);
    document.removeEventListener(EventInstrumentItemChangeColor + this.instrumentItemId, this.onInstrumentItemChangeColor, false);

    this.removeFromServer();
  },

  changeColor: function(ev) {

    color = computeTrackLineItemColor(ev.detail.color);

    this.color = color;

    $("[name=track-line-item-" + this.instrumentItemId + "]").each(function(color) {
      return function() {
        this.style["background-color"] = color.body;
      }
    }(color));

    $("[name=track-line-item-label-header-" + this.instrumentItemId + "]").css({
      "background-color": color.header
    });

  },

  createIntoServer: function () {
    //=== SERVER ===
    window.elecSoundClient.add_track_item({
      trackLineId: this.owner.id,
    	trackItemId: this.id,
    	instrumentItemId: this.instrumentItemId,
    	start: this.start,
    	end: this.start + new ViewCommon().translateWidthSeconds(this.frame.width())
    });
  },

  removeFromServer: function () {
    //=== SERVER ===
    window.elecSoundClient.remove_track_item({
      trackLineId: this.owner.id,
    	trackItemId: this.id,
    });
  },

  setInfoIntoServer: function () {
    //=== SERVER ===
    window.elecSoundClient.set_trackitem_info({
      trackLineId: this.owner.id,
    	trackItemId: this.id,
    	start: this.start,
    	end: this.start + new ViewCommon().translateWidthSeconds(this.frame.width())
    });
  },

});

module.exports = TrackLineItem;
