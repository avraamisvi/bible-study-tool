var BaseClass = require('base-class-extend');
var Composition = require("../models/composition.js")
var Instrument = require("../models/instrument.js")
var PianoRollView = require("./PianoRollView.js")

/*
  Funcinoaldiades da view patterns
*/
var PatternsView = BaseClass.extend({
  constructor: function PatternsController() {
    this._instruments = {};
    this._instruments_id = 0;
    this.instrumentSelected = null;
  },

  clear: function() {
    this._instruments = {};
    this._instruments_id = 0;
    this.instrumentSelected = null;
    $("#patternWindowBody").html("");
  },

  loadFromFile: function(composition) {

    messageView.showInfo("Loading project instruments...");

    this.clear();

    this._instruments_id = composition.instrumentsId;

    for(ins in composition.instruments) {

      messageView.showInfo("Adding Instrument " + composition.instruments[ins].label);

      instrumentsListView.verifyInstrumentExists(composition.instruments[ins].name);//defined in the window

      this.createInstrumentFromFile(composition.instruments[ins]);
    }
  },

  createInstrumentFromFile: function(instr) {
    instrument = new Instrument(instr.id, instr.name, instr.type);
    instrument.load(instr)
    this.addInstrumentFromFile(instrument);
  },

  get InstrumentsId() {
    return this._instruments_id;
  },

  set InstrumentsId(val) {
    this._instruments_id = val;
  },

  /*
    Loads an instrument from file
  */
  addInstrumentFromFile: function addInstrument(instrument) {

    this._instruments[instrument.id] = instrument;

    $("#patternWindowBody").append(nunjucks.render(__dirname + '/templates/instrumentTmpl.html',{dat: {patterns: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], instr: instrument}}));

    if(instrument.Mode == 1) {
      instrument.Mode = 0;//simulo o change mode
      this.changeMode(instrument.Id);
    } else {
      this.refreshSelectedInstrumentPattern(instrument.Id);
    }
  },

  addInstrument: function addInstrument(instrument) {
    this._instruments_id++;

    this._instruments[this._instruments_id] = instrument;
    instrument.id = this._instruments_id;

    $("#patternWindowBody").append(nunjucks.render(__dirname + '/templates/instrumentTmpl.html',{dat: {patterns: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], instr: instrument}}));
  },

  refreshSelectedInstrumentPattern: function(id) {

    var temp_instr = this._instruments[id];

    for(idx = 0; idx < temp_instr.Pattern.length; idx++) {
        if(temp_instr.Pattern[idx] == 1) {
          $("#inst_id_"+ temp_instr.Id + "_pattern"+idx).addClass("panel-instrument-pattern-selected");
        } else {
          $("#inst_id_"+ temp_instr.Id + "_pattern"+idx).removeClass("panel-instrument-pattern-selected");
        }
    }
  },

  removeInstrument: function removeInstrument(id) {
    $("#inst_id_"+id).remove();
    $("#break_instr_id_"+id).remove();

    compositionView.removeInstrumentFromAllGroups(this._instruments[id]);

    delete this._instruments[id];
  },

  get Instruments() { return this._instruments; },

  changeMode: function(id) {
    display = "inst_id_"+id+"_display";
    pattern = "inst_id_"+id+"_patterns";
    inst = this._instruments[id];

    if(inst.Mode == 0) {
      $("#"+display).show();
      $("#"+pattern).hide();
      $("#inst_id_"+ id + "_pattern_mode_check").addClass("panel-instrument-mode-pianoroll-check");
      inst.Mode = 1;
    } else {
      $("#"+display).hide();
      $("#"+pattern).show();
      $("#inst_id_"+ id + "_pattern_mode_check").removeClass("panel-instrument-mode-pianoroll-check");
      inst.Mode = 0;

      this.refreshSelectedInstrumentPattern(id);
    }
  },

  select: function select(id) {

    $("#inst_id_"+ id + "_check").removeClass("panel-instrument-check-selected");

    if(this.instrumentSelected != null && this.instrumentSelected.id == id) {
      this.instrumentSelected = null;
    } else {
      this.instrumentSelected = null;
      this.instrumentSelected = this._instruments[id];
      $("#inst_id_"+ id + "_check").addClass("panel-instrument-check-selected");
    }
  },

  showInstrumentOnGroup: function(instrumentsId) {

    $(".panel-instrument-group-selected").removeClass("panel-instrument-group-selected");

    for(i = 0; i < instrumentsId.length; i++) {
      $("#inst_id_"+ instrumentsId[i] + "_group").addClass("panel-instrument-group-selected");
    }
  },

  showInstrumentOnSelectedGroup: function(group) {
    $(".panel-instrument-group-selected").removeClass("panel-instrument-group-selected");

    for(instrId in group.Instruments) {
      $("#inst_id_"+ instrId + "_group").addClass("panel-instrument-group-selected");
    }
  },

  removeInstrumentOnGroup: function(instrumentsId) {
    for(i = 0; i < instrumentsId.length; i++) {
      $("#inst_id_"+ instrumentsId[i] + "_group").removeClass("panel-instrument-group-selected");
    }
  },

  selectPattern: function selectPattern(id, ptn) {
    if(this._instruments[id].Pattern[ptn] > 0) {
      this._instruments[id].Pattern[ptn] = 0;
      $("#inst_id_"+ id + "_pattern"+ptn).removeClass("panel-instrument-pattern-selected");
    } else {
      this._instruments[id].Pattern[ptn] = 1;
      $("#inst_id_"+ id + "_pattern"+ptn).addClass("panel-instrument-pattern-selected");
    }
  },

  openPianoRoll: function(id) {

    if(window.pianoRollView) {
      window.pianoRollView.close();
    }

    window.pianoRollView = new PianoRollView(this._instruments[id]);
    window.pianoRollView.openWindow();
  },

  createWindow: function createPatternWindow() {
    window.patternsView = this;
    $("#content1").append(nunjucks.render(__dirname + '/templates/patternTmpl.html'));
  },

  openInstrumentsOptions: function(id) {
    modalChangeInstrumentOptionsView.show(this._instruments[id]);
  }
});


module.exports = PatternsView;
