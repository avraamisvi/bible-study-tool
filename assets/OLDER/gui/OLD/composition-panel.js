var BaseClass = require('base-class-extend');
var $  = require('jquery');
var GuiLoader  = require('../gui/gui-loader');
var VerticalScrollBar  = require('../gui/vertical-scroll-bar');
var HorizontalScrollBar = require('../gui/horizontal-scroll-bar');

var CompositionPanel = BaseClass.extend({
  component: null,
  deslocamentoXFator: 15,//fator de deslocamento,deve ser calculado com base no tamanho da tela e area visivel etc
  horizontalBarinitialPosition: 0,
  verticalBarInitialPosition: 0,

  constructor: function() {
    this.load();

    $( window ).resize(function(self) {
      return function() {
        self.refresh(false);
      };
    }(this));
  },

  //Inicia as configuracoes internas, como constantes entre outros.
  initConfig: function(){
    var bar = SVG.get("cmpPnlScrollBarHorizontalBar");
    var barVertical = SVG.get("cmpPnlScrollBarVerticalBar");

    this.horizontalBarinitialPosition = bar.x();
    this.verticalBarInitialPosition = barVertical.y();

  },

  load: function() {
    loader = new GuiLoader();

    loader.loadComponent("composition-panel.svg", "contentComposition",
    function(self) {
      return function(component) {
        self.component = component;
        self.refresh(true);
        self.initConfig();
        self.configureEvents();
      }
    }(this), function(e){
      console.log(e);
    })
  },

  refresh: function(init) {

    container = $("#contentComposition");
    w = container.width();
    h = container.height();

    frameHor = SVG.get("cmpPnlScrollBarHorizontalFrame");
    junction = SVG.get("cmpPnlScrollBarJunction");
    groupVert = SVG.get("cmpPnlScrollBarVerticalGroup");
    rightStop = SVG.get("cmpPnlScrollBarHorizontalRightStop");

    delta = (w-250) - frameHor.width();

    frameHor.size(w-250, frameHor.height());
    junction.x(junction.x() + delta);
    groupVert.x(groupVert.x() + delta);
    rightStop.x(rightStop.x() + delta);

    frameVer = SVG.get("cmpPnlScrollBarVerticalFrame");
    bottomStop = SVG.get("cmpPnlScrollBarVerticalBottomStop");

    deltaV = (h-50) - frameVer.height();

    frameVer.size(frameVer.width(), h-50);
    bottomStop.y(bottomStop.y() + deltaV);

    if(init) {
      this.refreshSecontsTrackLine(1*60);//seconds
    }

    this.refresHorizontalhBar(delta);
    this.refresVerticalhBar(deltaV);
  },

  refreshSecontsTrackLine: function(secs) {
    wid = (secs * 2)*50;
    secondsFrame = SVG.get("cmpPnlSecondsFrameBase");
    secondsFrame.size(wid, secondsFrame.height());

    //TODO pegar todos os tracks e recalcular o tamanho
    track = SVG.get("cmpPnlTrackLineBase1");
    track.size(wid, track.height());
  },

  moveHorizontalTrackLine: function(desloc) {

    desloc = desloc * this.deslocamentoXFator;
    /*if(desloc < 0) {
      desloc = 0;
    }*/

    //TODO pegar todos os tracks e recalcular o tamanho
    track = SVG.get("cmpPnlTrackLineBaseGroup");
    if(desloc != 0) {
      track.x(track.x()-desloc);
    } else {
      track.x(0);
    }
  },

  moveVerticalTrackLine: function(desloc) {

    desloc = desloc * this.deslocamentoXFator;

    //TODO pegar todos os tracks e recalcular o tamanho
    track = SVG.get("cmpPnlTrackLineBaseGroup");
    if(desloc != 0) {
      track.y(track.y()-desloc);
    } else {
      track.y(0);
    }
  },

  refresHorizontalhBar: function(delta) {
    container = $("#contentComposition");
    cwid = container.width();

    secondsFrame = SVG.get("cmpPnlSecondsFrameBase");
    wid = secondsFrame.width();

    desloc = wid - cwid;

    frame = SVG.get("cmpPnlScrollBarHorizontalFrame");
    bar = SVG.get("cmpPnlScrollBarHorizontalBar");

    bar.size(frame.width()-110, bar.height());

    if(desloc > 0) {
      desloc = desloc/10;//TODO calcular deslocamento e tamanho maximo
      bar.size(bar.width()-desloc, bar.height());
    }
  },

  refresVerticalhBar: function(delta) {

  },

  configureEvents: function() {
    this.configureVerticalBarEvents();
    this.configureHorizontalBarEvents();
  },

  configureHorizontalBarEvents: function(){

    horizontal = new HorizontalScrollBar();
    horizontal.configure("cmpPnlScrollBarHorizontalBar", this.horizontalBarinitialPosition, function(self){
      return function(dtx) {
        self.moveHorizontalTrackLine(dtx);
      };
    }(this));
  },

  configureVerticalBarEvents: function(){

    vertical = new VerticalScrollBar();
    vertical.configure("cmpPnlScrollBarVerticalBar", this.verticalBarInitialPosition, function(self) {
      return function(dtx) {
        self.moveVerticalTrackLine(dtx);
      };
    }(this));
  }

});

module.exports = CompositionPanel;
