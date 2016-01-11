var BaseClass = require('base-class-extend');
var InstrumentsLibraryGroupPanel = require('../gui/instruments-library-group-panel.js');
var InstrumentsLibraryToolbar = require('../gui/instruments-library-toolbar.js');
var VerticalScrollBar  = require('../gui/vertical-scroll-bar');

var InstrumentsLibraryPanel = BaseClass.extend({

  toolbar: null,
  groups: {},
  element: null,
  instrumentSelected: null,
  verticalBarInitialPosition: 0,
  scroolbarVerticalBar: null,
  verticalScrollBarController: null,
  lateral: null,
  topPadding: 5,

  constructor: function() {
    this.create();
  },

  create: function() {
    this.lateral = $("#lateral");
    this.lateral.height(workspace.getVisibleAreaHeight());

    this.lateral.append(nunjucks.render(__dirname + '/templates/instruments-library-tmpl.html'));

    this.element = $("#instruments-library-panel");
    this.scroolbarVerticalFrame = $("#instruments-library-scroolbar-vertical-frame");
    this.scroolbarVerticalBar = $("#instruments-library-scroolbar-vertical-bar");
    this.element.html("");

    this.toolbar = new InstrumentsLibraryToolbar(this);

    this.configureVerticalBarEvents();
    //this.moveVertical(0);
    //this.refresh();
    this.configureWheelTrack();
  },

  //TODO temporario, so para testes, pois as notas estarao definidas no instrumento do lado o server e serao dinamicas
  generate: function(){
  	var octave = -5;
    var notes = [];

  	while(octave <= 5) {

      notes.push({id:notes.length, name:"C"+octave, half:false});
      notes.push({id:notes.length, name:"C#Db"+octave, half:true});
      notes.push({id:notes.length, name:"D"+octave, half:false});
      notes.push({id:notes.length, name:"D#/Eb"+octave, half:true});
      notes.push({id:notes.length, name:"E"+octave, half:false});
      notes.push({id:notes.length, name:"F"+octave, half:false});
      notes.push({id:notes.length, name:"F#/Gb"+octave, half:true});
      notes.push({id:notes.length, name:"G"+octave, half:false});
      notes.push({id:notes.length, name:"G#/Ab"+octave, half:true});
      notes.push({id:notes.length, name:"A"+octave, half:false});
      notes.push({id:notes.length, name:"A#/Bb"+octave, half:true});
      notes.push({id:notes.length, name:"B"+octave, half:false});

  		octave++
  	}

    return notes;
  },

  refresh: function() {

    this.lateral.height(workspace.getVisibleAreaHeight());

    this.scroolbarVerticalFrame.height(workspace.getVisibleAreaHeight() - this.toolbar.height());
    this.scroolbarVerticalFrame.css({
      left: this.lateral.width()-this.scroolbarVerticalFrame.width() + 2,
      top: this.toolbar.height()
    });

    this.scroolbarVerticalBar.css({
        top: 0
    });

    this.verticalBarInitialPosition = 0;

    this.refreshVerticalBar(0);
    this.moveVertical(0);
  },

  configureVerticalBarEvents: function(){
    horizontal = new VerticalScrollBar();
    horizontal.configure("#instruments-library-scroolbar-vertical-bar", this.verticalBarInitialPosition, function(self){
      return function(y){

        if(self.scroolbarVerticalBar.height() + y >= self.scroolbarVerticalFrame.height()) {
          return self.scroolbarVerticalFrame.height() - self.scroolbarVerticalBar.height();
        }

        //console.log(y);

        return y;
      };
    }(this), function(self){
      return function(dtx) {
        self.moveVertical(dtx);
      };
    }(this));

    this.verticalScrollBarController = horizontal;
  },

  fatorDesloc: 1,//talvez seja necessario para ajustar quando a barra for menor que 10px
  moveVertical: function(desloc) {

      barh = this.scroolbarVerticalBar.position().top;
      sh = this.scroolbarVerticalFrame.height();

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
    var tamanhoVisivel = (this.lateral.height() - (this.toolbar.height() + this.topPadding));
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
    this.lateral[0].onwheel = function(self){
      return function(ev) {
        self.verticalScrollBarController.processWheel(ev);
      };
    }(this);
  },

  addGroup: function(group) {
    inst = new InstrumentsLibraryGroupPanel(this, group);
    this.groups[group.id] = inst;
  }

});

module.exports = InstrumentsLibraryPanel;
