var BaseClass = require('base-class-extend');
var Draggable  = require('../gui/draggable');

var InstrumetNotesDialog = BaseClass.extend({

  element: null,
  instrument: null,
  saveCallback: null,
  cancelCallback: null,
  configurationMessageListenerId: null,
  index: null,
  octave: 0,
  note: 70,
  notesGrid: {},
  octaveGrid: {},
  loopSequenceIndex: 0,
  note: 70,

  constructor: function(instrument, index, saveCallback, cancelCallback) {
    this.instrument = instrument;
    this.saveCallback = saveCallback;
    this.cancelCallback = cancelCallback;
    this.loopSequenceIndex = index; //indice do loop seq
    this.note = this.instrument.loopSequence[index-1].note;//nota do loop, subtraio pq o loop comeca em 1
    this.notesGrid = this.getNoteGrid();

    this.generateOctave();
    this.octave = this.octaveGrid[this.note];
  },

  configure: function() {

    if(this.instrument.owner.instrumentNotesDialog) {
        this.instrument.owner.instrumentNotesDialog.hide();
    }

    this.instrument.owner.instrumentNotesDialog = this;

    this.instrument.element.append(nunjucks.render(__dirname + '/templates/instrument-notes-dialog-tmpl.html', {
      id: this.instrument.id,//TODO 0.o
      name: this.instrument.instrument.name,
      index: this.loopSequenceIndex,
      notes: this.getNotes()
    }));

    this.element = $("#instrument-notes-dialog-" + this.instrument.id);

    this.element.find(".instrument-notes-dialog-note-panel").mousedown(function(self){
      return function(ev){
        //console.log($(this).attr("data-seq"));
        //$(this).toggleClass("selected");

        index = $(this).attr("data-index");

        $(".instrument-notes-dialog-note-panel-check").css({
          display: "none"
        });

        $("#instrument-notes-dialog-note-panel-check-" + index + "-" +self.instrument.id).css({
          display: "block"
        });

        //state = $(this).hasClass("selected")?1:0;
        noteName = $(this).attr("data-note");
        self.note = self.getNoteForIndex(noteName);
        self.instrument.loopSequence[self.loopSequenceIndex-1].note = self.note;

        //self.setLoopIndex(sequence - 1, state);
        self.playNote(self.note);
      };
    }(this));

    this.element.find(".instrument-notes-dialog-note-panel").mouseup(function(self){
      return function(ev){
        self.stopPlaying();
      };
    }(this));

    applyButtonEffect("#instrument-notes-dialog-" + this.instrument.id);//funcao global de efeito de botao TODO mudar para uma classe?

    this.element.find("#instrument-notes-dialog-ok-buttom-" + this.instrument.id).click(function(self){
      return function(ev) {
        self.saveCallback(self.getFields());
        self.hide();
        self.saveIntoServer();
      }
    }(this));

    var octaveField = this.element.find("#instrument-notes-dialog-field-octave-" + this.instrument.id);
    octaveField.val(this.octave);
    octaveField.change(function(self){
      return function(ev) {
        self.octave = $(this).val();
      };
    }(this))

    new Draggable("#instrument-notes-dialog-" + this.instrument.id, function(ev) {
      //nope
    },
    function(x, y){
      return {x: x, y: y};
    });
  },

  getNoteForIndex: function(note) {
    return this.notesGrid[note + this.octave].note;
  },

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

  //TODO estou usando indice 1 do lado do cliente e indice 0 do lado do server, isso eh necessario?
  saveIntoServer: function() {
    //=== SERVER ===
    window.elecSoundClient.set_instrument_loop_index_note({
      instrumentItemId: this.instrument.id,
      index: this.loopSequenceIndex - 1, //ver TODO acima
      note: this.note
    });
  },

  show: function() {
    this.configure();
    //this.getConfigurationFromServer();
  },

  hide: function() {
    this.element.remove();
    //this.removeConfigurationMessageListener();
  },

  getFields: function() {
    return {
      /*color: this.element.find("#instrument-name-dialog-field-color").val(),
      initialLoopSeqIndex: parseInt(this.element.find("#instrument-name-dialog-field-loop-index").val()),
      speed: this.parseLoopSpeed(this.element.find("[name='instrument-name-dialog-field-loop-speed']:checked").val())*/
    };
  },

  parseLoopSpeed: function(data) {
    return parseInt(data) > 1? 0.6 : 0.3;
  },

  isSelected: function(noteBase) {
    return (this.notesGrid[noteBase + this.octave].note == this.note)? "display:block;": "display:none;";
  },

  getNotes: function() {
    return [
    {name:"C",index:1, selected: this.isSelected("C"), half:false},
    {name:"C#Db",index:2, selected: this.isSelected("C#Db"), black: "black", lineStyle: 'style="display:block;"', half:true},//C#Db
    {name:"D",index:3,selected: this.isSelected("D"), half:false},
    {name:"D#/Eb" ,index:4, selected: this.isSelected("D#/Eb"), black: "black", lineStyle: 'style="display:block;"', half:true},//D#/Eb
    {name:"E",index:5, selected: this.isSelected("E"), border: "border", half:false},
    {name:"F",index:6, selected: this.isSelected("F"), half:false},
    {name:"F#/Gb",index:7, selected: this.isSelected("F#/Gb"), black: "black", lineStyle: 'style="display:block;"', half:true},//F#/Gb
    {name:"G",index:8, selected: this.isSelected("G"), half:false},
    {name:"G#/Ab",index:9, selected: this.isSelected("G#/Ab"), black: "black", lineStyle: 'style="display:block;"', half:true},//G#/Ab
    {name:"A",index:10, selected: this.isSelected("A"), half:false},
    {name:"A#/Bb",index:11, selected: this.isSelected("A#/Bb"), black: "black", lineStyle: 'style="display:block;"', half:true},//A#/Bb
    {name:"B",index:12, selected: this.isSelected("B"), half:false}
    ]
  },

  getNoteGrid: function() { //TODO MOVER ISSO PARA UMA CLASSE UTIL STATIC
  	var octave = -5;
    var notes = {};
    var counter = 0;

  	while(octave <= 5) {

      notes["C"+octave]={note: counter++, name:"C"+octave, half:false};
      notes["C#Db"+octave]={note: counter++, name:"C#Db"+octave, half:true};
      notes["D"+octave]={note: counter++, name:"D"+octave, half:false};
      notes["D#/Eb"+octave]={note: counter++, name:"D#/Eb"+octave, half:true};
      notes["E"+octave]={note: counter++, name:"E"+octave, half:false};
      notes["F"+octave]={note: counter++, name:"F"+octave, half:false};
      notes["F#/Gb"+octave]={note: counter++, name:"F#/Gb"+octave, half:true};
      notes["G"+octave]={note: counter++, name:"G"+octave, half:false};
      notes["G#/Ab"+octave]={note: counter++, name:"G#/Ab"+octave, half:true};
      notes["A"+octave]={note: counter++, name:"A"+octave, half:false};
      notes["A#/Bb"+octave]={note: counter++, name:"A#/Bb"+octave, half:true};
      notes["B"+octave]={note: counter++, name:"B"+octave, half:false};

  		octave++
  	}

    return notes;
  },

  //TODO pegar a octave por uma formula e colocar num util
  generateOctave: function() {
    var octave = -5;
    var notes = {};
    var counter = 0;

  	while(octave <= 5) {

      notes[counter++]=octave;
      notes[counter++]=octave;
      notes[counter++]=octave;
      notes[counter++]=octave;
      notes[counter++]=octave;
      notes[counter++]=octave;
      notes[counter++]=octave;
      notes[counter++]=octave;
      notes[counter++]=octave;
      notes[counter++]=octave;
      notes[counter++]=octave;
      notes[counter++]=octave;

  		octave++
  	}

    this.octaveGrid = notes;
  }

});

module.exports = InstrumetNotesDialog;
