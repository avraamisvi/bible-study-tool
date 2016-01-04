var BaseClass = require('base-class-extend');
var PianoRollBoard = require('../gui/piano-roll-board');
var ViewCommon = require('../gui/view-common');
var VerticalScrollBar  = require('../gui/vertical-scroll-bar');
var HorizontalScrollBar = require('../gui/horizontal-scroll-bar');
var SeparatorContentVertical = require('../gui/separator-content-vertical.js');

var PianoRoll = BaseClass.extend({

  id: null,
  instrument: null,

  secondsElement: null,
  separatorElement: null,

  buttonSettings: null,
  toolbarElement: null,

  element: null,
  panelLoaded: null,
  board: null,

  scroolbarVerticalFrame: null,
  scroolbarHorizontalFrame: null,

  scroolbarVerticalBar: null,
  scroolbarHorizontalBar: null,

  verticalScrollBarController: null,
  horizontalScrollBarController: null,

  keyLabelsElement: null,
  notes: null,
  buttonWrite: null,

  constructor: function(instrument) {
    this.instrument = instrument;
    this.create();
  },

  create: function() {
    this.id = new Date().getTime();
    this.element = $("#contentPianoRoll");
    this.panelLoaded = nunjucks.render(__dirname + '/templates/piano-roll-tmpl.html', {
      id: this.id,
      instrument: this.instrument,
      notes: this.generateNotes() //TODO criar um static notes
      });

    this.board = new PianoRollBoard(this);

    window.workspace.addDeletePressedListener(function(self){
      return function(ev) {
        if(self.hasFocus) {
          self.board.deleteSelectedItems();
        }
      };
    }(this));
  },

  show: function() {

    workspace.content.pianoRollOpened = this;

    this.element.css({
      height: "50%"
    });

    this.element.html("");
    this.element.append(this.panelLoaded);


    this.keyLabelsElement = $("#piano-roll-notes-container-labels");
    this.toolbarElement = $("#piano-roll-toolbar");
    this.separatorElement = $("#piano-roll-internal-container-separator");
    this.secondsElement = $("#piano-roll-seconds-container");

    this.scroolbarVerticalFrame = $("#scroolbar-vertical-frame-" + this.id);
    this.scroolbarHorizontalFrame = $("#scroolbar-horizontal-frame-" + this.id);

    this.scroolbarVerticalBar = $("#scroolbar-vertical-bar-" + this.id);
    this.scroolbarHorizontalBar = $("#scroolbar-horizontal-bar-" + this.id);

    this.board.show();

    this.refresh();
    workspace.compositionPanel.refresh(false);

    this.generateSeconds();
    this.configureEvents();

    this.element.find(".piano-roll-key").mousedown(function(self){
      return function(ev) {
        //console.log($(this).attr("data-note"));
        self.playNote(parseInt($(this).attr("data-note")));
      }
    }(this));

    $(this.element).mouseup(function(self){
      return function(ev){
        self.stopPlaying();
      };
    }(this));

    this.element.find(".piano-roll-key").mouseleave(function(self){
      return function(ev){
        //if(self.playing) {
          self.stopPlaying();
        //}
      };
    }(this));

    this.element[0].onmouseenter=function(self){
      return function(ev) {
        self.hasFocus = true;
      };
    }(this);

    this.element[0].onmouseleave=function(self){
      return function(ev) {
        self.hasFocus = false;
      };
    }(this);

    this.buttonWrite = this.element.find("#piano-roll-toolbar-button-write-mode");
    this.buttonWrite[0].onclick = function(self) {
        return function(ev){
            self.toggleWriteMode();
        };
    }(this);

    this.buttonDelete = $("#piano-roll-toolbar-button-delete-item");
    this.buttonDelete.click(function(self){
      return function(e) {
        self.board.deleteSelectedItems();
      }
    }(this));

    this.moveVerticalManualy(this.scroolbarVerticalFrame.height() * 0.5);
    this.moveHorizontalTrackLine(0);

    this.configureWheelTrack();

    this.separatorContentVertical = new SeparatorContentVertical();
    this.separatorContentVertical.configure("#piano-roll-dragger", workspace.compositionPanel, this);
  },

  toggleWriteMode: function() {
    this.setWriteMode(!this.board.isWriteMode());
  },

  setWriteMode: function(write) {

    this.board.setWriteMode(write);

    if(this.board.isWriteMode()) {
        this.buttonWrite.addClass("mini-toolbar-button-down");
    } else {
        this.buttonWrite.removeClass("mini-toolbar-button-down");
    }
  },

  refresh: function() {
    var toolbarPos = this.toolbarElement.position();

    var top = toolbarPos.top + this.toolbarElement.height();

    this.separatorElement.css({top: top});
    this.secondsElement.css({
      top: top,
      left: this.separatorElement.position().left + this.separatorElement.width()
    });//76px

    this.scroolbarVerticalFrame.height(this.element.height() - this.toolbarElement.height());
    this.scroolbarVerticalFrame.css({
      left: this.element.width()-this.scroolbarVerticalFrame.width(),
      top: this.toolbarElement.height()
    });

    this.scroolbarHorizontalFrame.css({
      top: this.element.height()-this.scroolbarHorizontalFrame.height(),
      left: 0
    });
    this.scroolbarHorizontalFrame.width(this.element.width());

    this.keyLabelsElement.css({
      top: this.toolbarElement.height() + this.separatorElement.height()
    });

    this.board.top(this.toolbarElement.height() + this.separatorElement.height());

    this.refreshSeconds();
    this.refreshScrollBars();
    //workspace.compositionPanel.refresh(false);

    this.moveVerticalManualy(this.scroolbarVerticalFrame.height() * 0.5);
  },

  refreshHorizontalBar: function(delta) {

    var tamanhoTotal = this.secondsElement.width() + 200;
    var tamanhoVisivel = (this.element.width() - this.separatorElement.width());
    var tamanhoEscondido = tamanhoTotal - tamanhoVisivel;

    var perc = 1;

    if(tamanhoTotal > 0) {
        perc = tamanhoVisivel/tamanhoTotal;
    }

    tamBarra = this.scroolbarHorizontalFrame.width() * perc;
    tamBarra = tamBarra > this.scroolbarHorizontalFrame.width()? this.scroolbarHorizontalFrame.width() : tamBarra;

    this.scroolbarHorizontalBar.width(tamBarra);
    this.scroolbarHorizontalBar.css({
      left: 0
    });
  },

  refreshVerticalBar: function(delta) {

    var tamanhoTotal = this.keyLabelsElement.height() + 100;
    var tamanhoVisivel = (this.element.height() - (this.toolbarElement.height() + this.separatorElement.height()));
    var tamanhoEscondido = tamanhoTotal - tamanhoVisivel;

    var perc = 1;

    if(tamanhoTotal > 0) {
        perc = tamanhoVisivel/tamanhoTotal;
    }

    tamBarra = this.scroolbarVerticalFrame.height() * perc;
    tamBarra = tamBarra > this.scroolbarVerticalFrame.height()? this.scroolbarVerticalFrame.height() : tamBarra;

    this.scroolbarVerticalBar.height(tamBarra);
    this.scroolbarVerticalBar.css({
      top: 0
    });
  },

  fatorDeslocHor: 1,//talvez seja necessario para ajustar quando a barra for menor que 10px
  moveHorizontalTrackLine: function(desloc) {

      barw = this.scroolbarHorizontalBar.position().left;
      sw = this.scroolbarHorizontalFrame.width();

      desloc = this.fatorDeslocHor * (barw/sw)*-1;

      var posit = (this.secondsElement.width()*desloc);
      posit = posit + this.separatorElement.width();

      this.secondsElement.css({
        left: posit
      });

      this.board.left(posit);

      console.log("desloc vert:" + desloc);
  },

  moveVerticalManualy: function(pos) {///-1302.93px
      this.scroolbarVerticalBar.css({
        top: pos
      });

      this.moveVerticalTrackLine(0);
  },

  fatorDeslocVert: 1,//talvez seja necessario para ajustar quando a barra for menor que 10px
  moveVerticalTrackLine: function(desloc) {

      barh = this.scroolbarVerticalBar.position().top;
      sh = this.scroolbarVerticalFrame.height();

      desloc = this.fatorDeslocVert * (barh/sh)*-1;

      var posit = (this.keyLabelsElement.height()*desloc);
      posit = posit + this.separatorElement.height() + this.toolbarElement.height();

      this.keyLabelsElement.css({
        top: posit
      });

      this.board.top(posit);
  },

  configureVerticalBarEvents: function(){
    horizontal = new VerticalScrollBar();
    horizontal.configure("#scroolbar-vertical-bar-" + this.id, 0, function(self){
      return function(y){
        console.log("y:"+y);
        if(self.scroolbarVerticalBar.height() + y >= self.scroolbarVerticalFrame.height()) {
          return self.scroolbarVerticalFrame.height() - self.scroolbarVerticalBar.height();
        }

        return y;
      };
    }(this), function(self){
      return function(dtx) {
        self.moveVerticalTrackLine(dtx);
      };
    }(this));

    this.verticalScrollBarController = horizontal;
  },

  configureHorizontalBarEvents: function(){

    horizontal = new HorizontalScrollBar();
    horizontal.configure("#scroolbar-horizontal-bar-" + this.id, 0, function(self){
      return function(x){
        console.log(x);
        if(self.scroolbarHorizontalBar.width() + x >= self.scroolbarHorizontalFrame.width()) {
          return self.scroolbarHorizontalFrame.width() - self.scroolbarHorizontalBar.width();
        }

        return x;
      };
    }(this), function(self){
      return function(dtx) {
        self.moveHorizontalTrackLine(dtx);
      };
    }(this));

    this.horizontalScrollBarController = horizontal;
  },

  configureWheelTrack: function() {
    this.keyLabelsElement[0].onwheel = function(self){
      return function(ev) {
        self.verticalScrollBarController.processWheel(ev);
      };
    }(this);
    this.board.onwheel(function(self){
      return function(ev) {
        self.horizontalScrollBarController.processWheel(ev);
      };
    }(this));
  },


  configureEvents: function () {
    this.configureVerticalBarEvents();
    this.configureHorizontalBarEvents();
  },

  refreshScrollBars: function() {
    this.refreshHorizontalBar(0)
    this.refreshVerticalBar(0);
  },

  //should be used to resize all board and seconds
  refreshSeconds: function() {
    wid = new ViewCommon().translateSecondsWidth(workspace.seconds);
    this.secondsElement.width(wid)
    console.log(wid);
    this.board.refreshSeconds();
  },

  hide: function() {
    this.element.html("");
    this.element.css({
      height: 0
    });

    workspace.content.pianoRollOpened = null;
    workspace.compositionPanel.refresh(false);
  },

  height: function() {
    return this.element.height();
  },

  heightPerc: function(height) {
    this.element.css({
      height: height
    });
  },

  generateNotes: function(){
  	var octave = -5;
    var notes = [];

  	while(octave <= 5) {

      notes.push({id:notes.length, name:"C ("+octave + ")", half:false});
      notes.push({id:notes.length, name:"C#Db ("+octave + ")", half:true});
      notes.push({id:notes.length, name:"D ("+octave + ")", half:false});
      notes.push({id:notes.length, name:"D#/Eb ("+octave + ")", half:true});
      notes.push({id:notes.length, name:"E ("+octave + ")", half:false});
      notes.push({id:notes.length, name:"F ("+octave + ")", half:false});
      notes.push({id:notes.length, name:"F#/Gb ("+octave + ")", half:true});
      notes.push({id:notes.length, name:"G ("+octave + ")", half:false});
      notes.push({id:notes.length, name:"G#/Ab ("+octave + ")", half:true});
      notes.push({id:notes.length, name:"A ("+octave + ")", half:false});
      notes.push({id:notes.length, name:"A#/Bb ("+octave + ")", half:true});
      notes.push({id:notes.length, name:"B (" + octave + ")", half:false});

  		octave++
  	}

    this.notes = notes;
    return notes;
  },

  updateCursorProgress: function(seconds) {

    $("#cursor-progress-piano").css({
      left: new ViewCommon().translateSecondsWidth(seconds)
    })
  },

  generateSeconds: function() {
    this.secondsElement.html('<div id="cursor-progress-piano" class="cursor-progress"></div>');
    seconds = workspace.seconds;//new ViewCommon().translateWidthSeconds(this.trackContainer.width());
    var mili = 0;
    //console.log(seconds);
    for(i = 0; i < seconds; i++) {

      mili = i*10;
      if(i % 10 == 0) {
        posit = (i/seconds) * new ViewCommon().translateSecondsWidth(seconds);//this.trackContainer.width()
        left = 0;

        this.secondsElement.append(nunjucks.render(__dirname + '/templates/piano-roll-second-tmpl.html', {second:i, left: posit}));
        text = $("#piano-roll-second-text-" + i);

        if(i == 0) {
          left = 2;
        } else {
          left = (text.width() + 2) * -1;
        }

        text.css({
          left: left
        });

      }
    }
  },

  //=== SERVER ===

  playNote: function(note) {
    //=== SERVER ===
    window.elecSoundClient.play_instrument({
      instrumentItemId: this.instrument.id,
      note: note
    });
  },

  stopPlaying: function() {
    //=== SERVER ===
    window.elecSoundClient.stop_instrument({
      instrumentItemId: this.instrument.id
    });
  },
});

module.exports = PianoRoll;
