var BaseClass = require('base-class-extend');

var Instrument = BaseClass.extend({

  constructor: function Instrument(id, name, type) {
    this.notesId = 0;
    this.id = id;
    this.name = name;
    this.label = name;
    this.type = type;
    this.mode = 0;

    this.pattern = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    this.octave = 1;//octave level
    this.piano = {};//note: {id:this.notesId, note: note, duration: duration, start: start}
    this.notes = [];

    this.options = {};

    this.generate();
  },

  generate: function(){
  	var octave = -5;
  	while(octave <= 5) {

      this.notes.push({name:"C"+octave, half:false});
      this.notes.push({name:"C#Db"+octave, half:true});
      this.notes.push({name:"D"+octave, half:false});
      this.notes.push({name:"D#/Eb"+octave, half:true});
      this.notes.push({name:"E"+octave, half:false});
      this.notes.push({name:"F"+octave, half:false});
      this.notes.push({name:"F#/Gb"+octave, half:true});
      this.notes.push({name:"G"+octave, half:false});
      this.notes.push({name:"G#/Ab"+octave, half:true});
      this.notes.push({name:"A"+octave, half:false});
      this.notes.push({name:"A#/Bb"+octave, half:true});
      this.notes.push({name:"B"+octave, half:false});

  		octave++
  	}
  },

  get Options() {
    return this.options;
  },

  initOptions: function(options) {
    for(option in options) {
      this.options[option] = options[option].value;
    }
  },

  get Notes() {
    return this.notes;
  },

  set Notes(notes) {
    this.notes = notes;
  },

  get Label() {
    return this.label;
  },

  set Label(lab) {
    this.label = lab;
  },

  get Pattern() {
    return this.pattern;
  },

  set Pattern(pat) {
    this.pattern = pat;
  },

  addNote: function(note, duration, start) {
    this.notesId++;
    this.piano[this.notesId] = {id:this.notesId, note: note, duration: duration, start: start};

    return this.notesId;
  },//TODO com erro de proposito para me lembrar

  setNote: function(id, duration, start) {
    console.log("NOTE ID:" + id)
    this.piano[id] = {id:id, note: this.piano[id].note, duration: duration, start: start};
  },

  removeNote: function(noteId) {
    delete this.piano[noteId];
  },

  get Piano() {
    return this.piano;
  },

  get Octave() {
    return this.octave;
  },

  set Octave(oc) {
    this.octave = oc;
  },

  get Mode() {
    return this.mode;
  },

  set Mode(mode) {
    this.mode = mode;
  },

  get Type() {
    return this.type;
  },

  set Type(type) {
    this.type = type;
  },

  get Name() {
    return this.name;
  },

  set Name(name) {
    this.name = name;
  },

  get Id() {
    return this.id;
  },

  set Id(id) {
    this.id = id;
  },

  load: function(instr) {
    this.notesId = instr.notesId;
    this.id = instr.id;
    this.name = instr.name;
    this.label = instr.label;
    this.type = instr.type;
    this.mode = instr.mode;
    this.pattern = instr.pattern;
    this.octave = instr.octave;
    this.piano = instr.piano;
    this.notes = instr.notes;

    console.log(instr);
  }

});

module.exports = Instrument;
