var BaseClass = require('base-class-extend');
var $  = require('jquery');
var VerticalScrollBar  = require('../gui/vertical-scroll-bar');
var HorizontalScrollBar = require('../gui/horizontal-scroll-bar');
var TrackLine = require('../gui/track-line');
var ViewCommon = require('../gui/view-common');
var CompositionToolbar = require('../gui/composition-toolbar');

var CompositionPanel = BaseClass.extend({

  component: null,
  deslocamentoXFator: 15,//fator de deslocamento,deve ser calculado com base no tamanho da tela e area visivel etc
  horizontalBarinitialPosition: 0,
  verticalBarInitialPosition: 0,
  BORDER: 2,

  //############################### View ###########################################
  contentComposition: null,
  toolbar: null,
  separator: null,
  labels: null,

  trackContainer: null,
  secondsContainer: null,

  scroolbarVerticalFrame: null,
  scroolbarHorizontalFrame: null,

  scroolbarVerticalBar: null,
  scroolbarHorizontalBar: null,

  //######################## Controllers #################################

  tracklines: [],
  toolbarController: null,
  horizontalScrollBarController: null,
  verticalScrollBarController: null,

  //######################## States #################################

  trackItemsSelected: {},

  constructor: function() {
    this.load();

    /*$( window ).resize(function(self) {
      return function() {
        self.refresh(false);
      };
    }(this));*/
  },

  //Inicia as configuracoes internas, como constantes entre outros.
  initConfig: function(){
    /*var bar = $("#scroolbar-horizontal-bar");
    var barVertical = $("#scroolbar-vertical-bar");*/

    //Configuring listeners

    window.workspace.addDeletePressedListener(function(self){
      return function(ev) {
        if(self.hasFocus) {
          self.deleteSelectedTracksItems();
        }
      };
    }(this));

    this.contentComposition[0].onmouseenter=function(self){
      return function(ev) {
        self.hasFocus = true;
      };
    }(this);

    this.contentComposition[0].onmouseleave=function(self){
      return function(ev) {
        self.hasFocus = false;
      };
    }(this);
  },

  load: function() {

    this.contentComposition = $("#contentComposition");
    this.toolbar = $("#composition-toolbar");
    this.separator = $("#composition-internal-container-separator");
    this.labels = $("#composition-track-container-labels");

    this.trackContainer = $("#composition-track-container");
    this.secondsContainer = $("#composition-seconds-container");

    this.scroolbarVerticalFrame = $("#scroolbar-vertical-frame");
    this.scroolbarHorizontalFrame = $("#scroolbar-horizontal-frame");

    this.scroolbarVerticalBar = $("#scroolbar-vertical-bar");
    this.scroolbarHorizontalBar = $("#scroolbar-horizontal-bar");

    this.refresh(true);
    this.configureEvents();
    this.generateSeconds();
    this.initConfig();

  },

  refresh: function(init) {

    var contentWidth = this.contentComposition.width();
    var toolbarPos = this.toolbar.position();

    this.contentComposition.height(workspace.content.getCompositionPanelHeight());

    this.toolbar.width(contentWidth);

    this.separator.css({top: toolbarPos.top + this.toolbar.height() + this.BORDER});
    this.secondsContainer.css({
      top: this.separator.position().top,
      left: this.separator.position().left + this.separator.width()
    });

    this.labels.css({top: this.separator.position().top + this.separator.height() + this.BORDER});
    this.trackContainer.css({
      top: this.separator.position().top + this.separator.height() + this.BORDER,
      left: this.separator.position().left + this.separator.width()
    });

    // Scrollbar horizontal

    this.scroolbarHorizontalFrame.css({
      top: this.contentComposition.height()-this.scroolbarHorizontalFrame.height() + this.BORDER,
      left: 0
    });
    this.scroolbarHorizontalFrame.width(this.contentComposition.width()-12);//por que 12?
    /*this.scroolbarHorizontalBar.css({
        left: this.scroolbarHorizontalButtonLeft.position().left + 30
    });*/

    // Scrollbar vertical

    this.scroolbarVerticalFrame.height(this.contentComposition.height() - this.toolbar.height());
    this.scroolbarVerticalFrame.css({
      left: this.contentComposition.width()-this.scroolbarVerticalFrame.width() + 2,
      top: this.toolbar.height()
    });

    /*this.scroolbarVerticalBar.css({
        top: this.scroolbarVerticalButtonLeft.height()
    });*/

    if(init) {
      this.refreshSecontsTrackLine(5*60);//seconds
    }

    deltaH = 0;
    deltaV = 0;

    this.generateSeconds();
    this.createToolbar();

    this.refreshHorizontalhBar(deltaH);
    this.refreshVerticalhBar(deltaV);
    this.configureWheelTrack();
  },

  //should be used to resize all the track lines
  refreshSecontsTrackLine: function(secs) {
    wid = new ViewCommon().translateSecondsWidth(secs);

    //TODO pegar todos os tracks e recalcular o tamanho
    track = $(".composition-track");
    track.width(wid);
    this.secondsContainer.width(wid)
  },

  configureWheelTrack: function() {
    this.labels[0].onwheel = function(self){
      return function(ev) {
        self.verticalScrollBarController.processWheel(ev);
      };
    }(this);
    this.trackContainer[0].onwheel = function(self){
      return function(ev) {
        self.horizontalScrollBarController.processWheel(ev);
      };
    }(this);
  },

  fatorDeslocHor: 1,//talvez seja necessario para ajustar quando a barra for menor que 10px
  moveHorizontalTrackLine: function(desloc) {

      barw = this.scroolbarHorizontalBar.position().left;
      sw = this.scroolbarHorizontalFrame.width();

      desloc = this.fatorDeslocHor * (barw/sw)*-1;

      var posit = (this.trackContainer.width()*desloc);
      posit = posit + this.separator.width();

      this.trackContainer.css({
        left: posit
      });

      this.secondsContainer.css({
        left: posit
      });

      console.log("desloc vert:" + desloc);
  },

  fatorDeslocVert: 1,//talvez seja necessario para ajustar quando a barra for menor que 10px
  moveVerticalTrackLine: function(desloc) {

      barh = this.scroolbarVerticalBar.position().top;
      sh = this.scroolbarVerticalFrame.height();

      desloc = this.fatorDeslocVert * (barh/sh)*-1;

      var posit = (this.trackContainer.height()*desloc);
      posit = posit + this.separator.height() + this.toolbar.height();

      this.trackContainer.css({
        top: posit
      });

      this.labels.css({
        top: posit
      });

      console.log("desloc vert:" + desloc);
  },

  refreshHorizontalhBar: function(delta) {

    var tamanhoTotal = this.trackContainer.width() + 200;
    var tamanhoVisivel = (this.contentComposition.width() - this.separator.width());
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

  refreshVerticalhBar: function(delta) {

    var tamanhoTotal = this.trackContainer.height() + 40;
    var tamanhoVisivel = (this.contentComposition.height() - (this.toolbar.height() + this.separator.height()));
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

  refreshScrollBars: function() {
    this.refreshHorizontalhBar(0)
    this.refreshVerticalhBar(0);
  },

  configureEvents: function() {
    this.configureVerticalBarEvents();
    this.configureHorizontalBarEvents();
  },

  configureHorizontalBarEvents: function(){

    horizontal = new HorizontalScrollBar();
    horizontal.configure("#scroolbar-horizontal-bar", 0, function(self){
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

  configureVerticalBarEvents: function(){
    horizontal = new VerticalScrollBar();
    horizontal.configure("#scroolbar-vertical-bar", 0, function(self){
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

  updateCursorProgress: function(seconds) {

    $("#cursor-progress").css({
      left: new ViewCommon().translateSecondsWidth(seconds)
    })
  },

  generateSeconds: function() {
    this.secondsContainer.html('<div id="cursor-progress" class="cursor-progress"></div>');//TODO isso eh o melhor?
    seconds = workspace.seconds;//new ViewCommon().translateWidthSeconds(this.trackContainer.width());
    var mili = 0;
    //console.log(seconds);
    for(i = 0; i < seconds; i++) {

      mili = i*10;
      if(i % 10 == 0) {
        posit = (i/seconds) * new ViewCommon().translateSecondsWidth(seconds);//this.trackContainer.width()
        left = 0;

        this.secondsContainer.append(nunjucks.render(__dirname + '/templates/track-second-tmpl.html', {second:i, left: posit}));
        text = $("#track-second-text-" + i);

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

//############################ methods controllers ####################################
  heightPerc: function(height) {
    this.contentComposition.css({
      height: height
    });
  },

  /**
    It adds a new TrackLine
    {
      id: <track-line-id sem prefixo>
      label: track-line-label
    }
  */
  addTrackLine(config) {
    var line = new TrackLine();

    line.configure({
      id: config.id,
      label: config.label,
      composition: this,
      seconds: config.seconds,
      labelContainer: this.labels,
      lineContainer: this.trackContainer
    });

    this.tracklines[line.id] = line;

    //this.refresh(false);
    this.refreshScrollBars();

    //=================== SERVER =======================
    this.addTrackLineServer(config);
  },

  deleteTrackLine: function(line) {
    delete this.tracklines[line.id];

    this.refreshScrollBars();
  },

  deleteSelectedTracksItems: function() {
    for(ti in this.trackItemsSelected) {
      this.trackItemsSelected[ti].delete();
      delete this.trackItemsSelected[ti];
    }

    this.refreshScrollBars();
  },

  createToolbar: function() {
    this.toolbarController = new CompositionToolbar();
    this.toolbarController.create(this);
  },

  isWriteMode: function() {
    return this.toolbarController.isWriteMode();
  },

  setWriteMode: function(write) {
    this.toolbarController.setWriteMode(write);
  },

  selectTrackItem: function(item) {
    this.trackItemsSelected[item.id] = item;
  },

  unSelectTrackItem: function(item) {
    delete this.trackItemsSelected[item.id];
  },

  //=================== SERVER =======================

  addTrackLineServer: function(config) {
    window.elecSoundClient.add_trackline({
      trackLineId: config.id,
      trackLineName: config.label,
      position: 0
    })
  }

});

module.exports = CompositionPanel;
