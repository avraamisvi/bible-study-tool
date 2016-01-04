var BaseClass = require('base-class-extend');
var CompositionPanel = require('../gui/composition-panel');
var InstrumentsLibraryPanel = require('../gui/instruments-library-panel.js');
var InstrumentPanel = require('../gui/instruments-panel.js');
var SeparatorContentHorizontal = require('../gui/separator-content-horizontal.js');
var ContentPanel = require('../gui/content-panel.js');

var ElecSoundClient = require('../services/elec-sound-client');
var MessageHandler =  require('../services/message-handler');
var PlayingStatusClient = require('../services/playing-status-client');

var Workspace = BaseClass.extend({

  libraryPanel: null,
  instrumentPanel: null,
  compositionPanel: null,
  content: null,//content-panel.js
  seconds: 5*60,
  deletePressListeners:{},
  changeColorListeners: {},
  separatorContent2Horizontal: null,
  content1: null,//TODO rename to 'right side panel'
  PADDING_TOP:55,
  projectName: null,

  constructor: function() {
  },

  play:function() {
    window.elecSoundClient.play();
  },

  stop:function() {
    window.elecSoundClient.stop();
  },

  load: function() {

    window.workspace = this;

    this.content1 = $("#content1");
    this.content1.height(this.getVisibleAreaHeight());//$(window).height() - this.PADDING_TOP

    this.content = new ContentPanel();
    this.content.refresh();

    this.libraryPanel = new InstrumentsLibraryPanel();
    this.compositionPanel = new CompositionPanel();
    this.instrumentPanel = new InstrumentPanel();
    this.separatorContent2Horizontal = new SeparatorContentHorizontal();

    this.configureSeparator();

    $(window).resize(function(self){
      return function(ev) {
        self.content.refresh();
        self.content1.height(self.getVisibleAreaHeight());
        self.instrumentPanel.refresh();
        self.libraryPanel.refresh();
        self.compositionPanel.refresh(false);
      }
    }(this));

    $(window).ready(function(self){//TODO por que tem que colocar isso aqui investigar
      return function(ev) {
        console.log("window loaded");
        self.content.refresh();
        self.instrumentPanel.refresh();
        self.libraryPanel.refresh();
      }
    }(this));

    window.onmousemove = function(ev) {
      if(this.movingAnchor) {
          this.movingAnchor.updateDragging(ev);
          ev.stopImmediatePropagation();
      }
    };

    window.onmouseup = function(ev) {
      if(this.movingAnchor) {
          this.movingAnchor.stopDragging();
          ev.stopImmediatePropagation();
      }
      this.movingAnchor = null;
    };

    window.onkeyup=function(self) {
      return function(ev) {
        if(ev.keyCode == 46 || ev.keyCode == 8) {
          self.processDeletePressed(ev);
        }
      };
    }(this);

    this.connectToServer();
  },

  configureCompositionPanel: function() {
    //TODO TESTE
    this.compositionPanel.addTrackLine({
        id: new Date().getTime(),
        label: "My Track",
        seconds: this.seconds
    });
  },

  configureInstrumentPanel: function() {
    //TODO TESTE
    /*this.instrumentPanel.addInstrument({
      id: new Date().getTime(),
      name: "teste 234"
    });
    this.instrumentPanel.addInstrument({
      id: new Date().getTime(),
      name: "teste 555"
    });

    for(i = 0; i < 20; i++) {
      this.instrumentPanel.addInstrument({
        id: new Date().getTime(),
        name: "teste 555"+i
      });
    }*/
  },

  loadInstruments: function(groups) {
    window.elecSoundClient.list_instruments();
  },

  processDeletePressed: function(ev) {
    for(lis in this.deletePressListeners) {
      this.deletePressListeners[lis](ev);
    }
  },

  addDeletePressedListener: function(listener) {//TODO colocar em um evento real
    this.deletePressListeners[listener.toString()]=listener;
  },

  addTrackLine:function(config) {
    config.seconds = this.seconds;
    config.id = new Date().getTime();
    this.compositionPanel.addTrackLine(config);
  },

  configureSeparator: function() {
    this.separatorContent2Horizontal.configure("#border-separator-content2", "#content", "#content1");
  },

  warnDialog: function(text) {
    alert(text);
  },

  //Deprecated
  getVisibleArea: function() {//TODO trocar pelo metodo abaixo
    return $(window).height() - this.PADDING_TOP;
  },

  getVisibleAreaHeight: function() {
    return $(window).height() - this.PADDING_TOP;
  },

  getVisibleAreaWidth: function() {
    return $(window).width();
  },

  connectToServer: function() {
    window.elecSoundClient = new ElecSoundClient(new MessageHandler(function(self){
      return function() {
        self.loadInstruments();
      };
    }(this)));
    window.elecSoundClient.connect();

    //SERVER PLAYING STATUS

    window.playingStatusClient = new PlayingStatusClient(function(self){
      return function(data){

        var secs = parseInt(data);

        if(!isNaN(secs)) {

          var seconds = parseFloat(data);
          var mili = Math.round((seconds - secs)*1000);

          var min = parseInt(secs/60);

          var rsecs = seconds / 60;
          var rsecs2 = parseInt(seconds / 60);
        //  console.log("rsecs:" + rsecs);
        //  console.log("rsecs2:" + rsecs2);
          rsecs = rsecs - rsecs2;
        //  console.log("rsecs - rsecs2:" + rsecs);
        //  console.log("rsecs - rsecs2:" + parseInt(rsecs*60));

          $("#seconds-display").html(addZeros(min, 2) + ":" + addZeros(parseInt(rsecs*60),2) + "." +  addZeros(mili,3));
        } else {
          $("#seconds-display").html("00:00.000");
        }

        self.compositionPanel.updateCursorProgress(parseFloat(data));

        if(self.content.pianoRollOpened) {
          self.content.pianoRollOpened.updateCursorProgress(parseFloat(data));
        }
      };
    }(this));

    playingStatusClient.connect();
  },

  refresh: function() {
    this.content.refresh();
    this.content1.height(self.getVisibleAreaHeight());
    this.instrumentPanel.refresh();
    this.libraryPanel.refresh();
    this.compositionPanel.refresh(false);
  }

});

module.exports = Workspace;
