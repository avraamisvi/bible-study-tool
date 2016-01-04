var BaseClass = require('base-class-extend');
var InstrumetSettingsDialog = require('../gui/instrument-settings-dialog');
var PianoRoll = require('../gui/piano-roll');
var InstrumentAmplitudeDialog = require('../gui/instrument-amplitude-dialog');
var InstrumetNotesDialog = require('../gui/instrument-notes-dialog');

var InstrumentItem = BaseClass.extend({

  id: null,
  instrument: null,
  element: null,
  labelButton: null,
  muted: false,
  piano: false,
  color: "#00796B",
  settingsDialog: null,
  notesDialog: null,
  selected: false,
  pianoroll: null,
  initialLoopSeqIndex: 69,//TODO REMOVER
  loopSequence:[],
  amplitude: 0.6,
  owner: null,

  LOOP_PLAY: 1,
	LOOP_NOT_PLAY: 0,

  constructor: function(owner) {
    this.owner = owner;
  },

  setMuteServer: function(){
    window.elecSoundClient.set_instrument_muted({
        instrumentItemId: this.id,
        muted: this.muted
      });
  },

  setAmplitudeServer: function(amplitude){

    this.amplitude = amplitude;

    window.elecSoundClient.set_instrument_amplitude({
        instrumentItemId: this.id,
        amplitude: this.amplitude
      });
  },

  setModeInServer: function(pianoRoll) {
    window.elecSoundClient.set_instrument_mode({
        instrumentItemId: this.id,
      	pianoRoll: pianoRoll
      });
  },

  playNote: function(note) {
    //=== SERVER ===
    window.elecSoundClient.play_instrument({
      instrumentItemId: this.id,
      note: this.loopSequence[note].note
    });
  },

  stopPlaying: function() {
    //=== SERVER ===
    window.elecSoundClient.stop_instrument({
      instrumentItemId: this.id
    });
  },

  setLoopIndex: function(index, state) {
    //=== SERVER ===
    window.elecSoundClient.set_loop_index({
      instrumentItemId: this.id,
    	index: index,
    	state: state
    });
  },

  createIntoServer: function () {
    //=== SERVER ===
    window.elecSoundClient.add_instrument({
      instrumentItemId: this.id,
    	instrumentId:  this.instrument.id,
    	position: 0 //TODO especificar posicao
    });
  },

  removeFromServer: function () {
    //=== SERVER ===
    window.elecSoundClient.remove_instrument({
      instrumentItemId: this.id
    });
  },

  configure: function(data) {
    console.log(data);
    this.owner = data.owner;
    this.instrument = data.instrument;
    this.id = new Date().getTime();//data.id;

    this.owner.element.append(nunjucks.render(__dirname + '/templates/instrument-item-tmpl.html', {
      id: this.id,
      label: this.instrument.name,
      sequenceLoopItems: this.generateSequenceLoopItems()
    }));

    this.element = $("#instrument-item-panel-" + this.id);
    this.labelButton = $("#instrument-item-label-" + this.id);
    this.sequencePanelElement = $("#instrument-item-loop-" + this.id);
    this.pianoPanelElement = $("#instrument-item-piano-seq-" + this.id);

    this.labelButton.click(function(self){
      return function(ev){

        if(self.owner.instrumentSelected == self) {
          self.owner.diselect();
        } else {
          self.select();
        }

      };
    }(this));


    this.pianoroll = new PianoRoll(this);

    this.pianoPanelElement.click(function(self){
      return function(ev){
        self.pianoroll.show();
      };
    }(this));

    this.element.find(".instrument-item-loop-seq").mousedown(function(self){
      return function(ev){
        //console.log($(this).attr("data-seq"));
        $(this).toggleClass("selected");

        state = $(this).hasClass("selected")?1:0;
        sequence = $(this).attr("data-seq");

        self.setLoopIndex(sequence - 1, state);
        self.playNote(parseInt(sequence) - 1);
      };
    }(this));

    this.element.find(".instrument-item-loop-seq").mouseup(function(self){
      return function(ev){
        self.stopPlaying();
      };
    }(this));

    this.element.find(".instrument-item-loop-seq").mouseenter(function(self){
      return function(ev){
        if(ev.buttons == 1 && ev.button == 0) {
          $(this).toggleClass("selected");

          state = $(this).hasClass("selected")?1:0;
          sequence = $(this).attr("data-seq");

          self.setLoopIndex(sequence - 1, state);
          self.playNote(parseInt(sequence) - 1);
        }
      };
    }(this));

    this.element.find(".instrument-item-loop-button").click(function(self){
      return function(ev){

        $(this).addClass("selected");

        sequence = parseInt($(this).attr("data-seq"));

        new InstrumetNotesDialog(self, sequence, function(self){
          return function(data) {
            $(self).removeClass("selected");
          };
        }(this), function(self){
          return function(data) {
            $(self).removeClass("selected");
          };
        }(this)).show();
      };
    }(this));

    this.element.mouseleave(function(self){
      return function(ev){
        //if(self.playing) {
          self.stopPlaying();
        //}
      };
    }(this));
    this.element.mouseup(function(self){
      return function(ev){
        //if(self.playing) {
          self.stopPlaying();
        //}
      };
    }(this));

    this.element.find("#instrument-item-check-" + this.id).click(function(self){
      return function(ev){
        /*$(this).toggleClass("selected");
        self.muted = !self.muted;
        self.setMuteServer();*/
        self.showAmplitudeDialog();
      };
    }(this));

    this.element.find("#instrument-item-piano-check-" + this.id).click(function(self){
      return function(ev){
        $(this).toggleClass("selected");
        self.piano = !self.piano;

        if(self.piano) {
          self.sequencePanelElement.css({display:"none"});
          self.pianoPanelElement.css({display:"block"});
        } else {
          self.sequencePanelElement.css({display:"block"});
          self.pianoPanelElement.css({display:"none"});
        }

        self.setModeInServer(self.piano);
      };
    }(this));


    this.settingsDialog = new InstrumetSettingsDialog(this, function(self){
      return function(fields){
        self.changeColor(fields.color);
        self.initialLoopSeqIndex = fields.initialLoopSeqIndex;
      };
    }(this),
    function(fields){
      //cancel
    }
    );

    this.createIntoServer();
  },

  diselect: function() {
    this.labelButton.removeClass("selected");
    this.selected = false;
  },

  select: function () {
    this.selected = true;
    this.owner.select(this);
    this.labelButton.addClass("selected");

    this.labelButton.css({
      "background-color": this.color
    });
  },

  delete : function() {
    this.element.remove();

    var event = new CustomEvent('InstrumentItemDelete-'+this.id, {"detail": {instrument: this.instrument.id}});
    document.dispatchEvent(event);

    this.removeFromServer();
  },

  showSettings: function() {
    this.settingsDialog.show();
  },

  showNotes: function() {
    this.notesDialog.show();
  },

  changeColor: function(color){
    this.color = color;

    this.labelButton.css({
      "background-color": color
    });

    //console.log('InstrumentItemChangeColor-'+this.id);

    var event = new CustomEvent(EventInstrumentItemChangeColor + this.id, {"detail": {color: color}});
    document.dispatchEvent(event);

  },

  showAmplitudeDialog: function() {
    new InstrumentAmplitudeDialog(this);
  },

  setAmplitude: function(amp) {

    var ele = this.element.find("#instrument-item-check-" + this.id);

    if(amp <= 0)
      ele.removeClass("selected");
    else if(!ele.hasClass("selected")) {
        ele.addClass("selected");
    }

    this.setAmplitudeServer(amp);
  },

  generateSequenceLoopItems: function() { //TODO carregar da library que vem do server, no construtor

    var items = [];

    for(i = 0; i < 16; i++) {
      items.push({ index: i + 1, note: 70 +  i});
    }

    console.log(items);

    this.loopSequence = items;

    return items;
  }
});

module.exports = InstrumentItem;
