var BaseClass = require('base-class-extend');
var InstrumentItem = require('../gui/instrument-item');
var InstrumentsToolbar = require('../gui/instruments-toolbar.js');
var VerticalScrollBar  = require('../gui/vertical-scroll-bar');

var InstrumentPanel = BaseClass.extend({

  toolbar: null,
  instruments: {},
  element: null,
  instrumentSelected: null,
  verticalBarInitialPosition: 0,
  scroolbarVerticalBar: null,
  content1: null,
  verticalScrollBarController: null,
  topPadding: 20,

  constructor: function() {
    this.create();
  },

  create: function() {
    this.content1 = $("#content1");
    this.element = $("#instrument-panel");//TODO unificar a geracao de scrollbar dentro da classe de scrollbar
    this.scroolbarVerticalFrame = $("#instrument-scroolbar-vertical-frame");
    this.scroolbarVerticalBar = $("#instrument-scroolbar-vertical-bar");
    this.element.html("");

    this.toolbar = new InstrumentsToolbar(this);


    this.configureVerticalBarEvents();
    this.moveVerticalTrackLine(0);
    this.refresh();
    this.configureWheelTrack();
  },

  refresh: function() {

    this.scroolbarVerticalFrame.height(this.content1.height() - this.toolbar.height());
    this.scroolbarVerticalFrame.css({
      left: this.content1.width()-this.scroolbarVerticalFrame.width() + 2,
      top: this.toolbar.height()
    });

/*    this.scroolbarVerticalButtonRight.css({
        top: this.scroolbarVerticalFrame.height() - (this.scroolbarVerticalButtonRight.height() + 6)
    });*/

    this.scroolbarVerticalBar.css({
        top: 0//this.scroolbarVerticalButtonLeft.height()
    });

    this.verticalBarInitialPosition = 0;//this.scroolbarVerticalBar.position().top;

    this.refreshVerticalBar(0);
  },

  configureVerticalBarEvents: function(){
    horizontal = new VerticalScrollBar();
    horizontal.configure("#instrument-scroolbar-vertical-bar", this.verticalBarInitialPosition, function(self){
      return function(y){

        if(self.scroolbarVerticalBar.height() + y >= self.scroolbarVerticalFrame.height()) {//TODO pq esse 30 ai? investigar
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

  fatorDesloc: 1,//talvez seja necessario para ajustar quando a barra for menor que 10px
  moveVerticalTrackLine: function(desloc) {

    console.log("entry desloc:" + desloc);

    barh = this.scroolbarVerticalBar.position().top;
    sh = this.scroolbarVerticalFrame.height();

    console.log("barh:" + barh);
    console.log("sh:" + sh);

    desloc = this.fatorDesloc * (barh/sh)*-1;

    var posit = (this.element.height()*desloc);
    posit = posit + this.toolbar.height() + this.topPadding;

    this.element.css({
      top: posit
    });

    console.log("desloc:" + desloc);
  },

  refreshVerticalBar: function(delta) {

    var tamanhoTotal = this.element.height() + this.topPadding;
    var tamanhoVisivel = (this.content1.height() - (this.toolbar.height() + this.topPadding));
    var tamanhoEscondido = tamanhoTotal - tamanhoVisivel;

    var perc = 1;

    if(this.element.height() > 0) {
        perc = tamanhoVisivel/tamanhoTotal;
    }

    tamBarra = this.scroolbarVerticalFrame.height() * perc;

    tamBarra = tamBarra > this.scroolbarVerticalFrame.height()? this.scroolbarVerticalFrame.height() : tamBarra;

    this.scroolbarVerticalBar.height(tamBarra);
  },

  configureWheelTrack: function() {
    this.content1[0].onwheel = function(self){
      return function(ev) {
        self.verticalScrollBarController.processWheel(ev);
      };
    }(this);
  },

  addInstrument: function(instrument) {
    inst = new InstrumentItem(this);
    inst.configure({
      owner: this,
      id: new Date().getTime(),
      instrument: instrument
    });
    this.instruments[inst.id] = inst;

    this.refreshVerticalBar(0);
  },

  select: function(inst) {
    if(this.instrumentSelected) {
      this.instrumentSelected.diselect();
    }

    this.instrumentSelected = inst;
  },

  diselect: function() {
    if(this.instrumentSelected) {
      this.instrumentSelected.diselect();
      this.instrumentSelected = null;
    }
  },

  deleteSelectedItem: function() {
    if(this.instrumentSelected) {
      this.instrumentSelected.delete();
      delete this.instruments[this.instrumentSelected.id];
      this.instrumentSelected = null;
    } else {
      window.workspace.warnDialog("Please select an instrument.")
    }
  },

  showSettingsSelectedItem: function() {
    if(this.instrumentSelected) {
      this.instrumentSelected.showSettings();
    } else {
      window.workspace.warnDialog("Please select an instrument.")
    }
  }

});

module.exports = InstrumentPanel;
