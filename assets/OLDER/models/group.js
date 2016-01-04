var BaseClass = require('base-class-extend');
var GroupEntry = require("../models/groupEntry.js")

var Group = BaseClass.extend({

  constructor: function (name, id) {
    this.name = name;
    this.id = id;
    this.instruments = {};
    this.entriesId = 0;
    this.entries = {};

    this.nextGroupId = 0;
    this.prevGroupId = 0;
  },

  get NextGroupId() {
    return this.nextGroupId;
  },

  set NextGroupId(id) {
    this.nextGroupId = id;
  },

  get PrevGroupId() {
    return this.prevGroupId;
  },

  set PrevGroupId(id) {
    this.prevGroupId = id;
  },

  get Entries() { return this.entries; },

  addEntry: function(start) {
    this.entriesId++;

    entry = new GroupEntry(this.entriesId, start);
    this.entries[this.entriesId] = entry;

    return entry;
  },

  removeEntry: function(entry) {
    delete this.entries[entry.Id];
  },

  get Name() { return this.name; },

  set Name(name) {
    this.name = name;
  },

  get Id() { return this.id; },

  set Id(id) {
    this.id = id;
  },

  get Instruments() { return this.instruments; },

  toggleInstrument: function(instrument) {

    if(this.instruments[instrument.Id]) {
      this.removeInstrument(instrument);
      return -1;//removed == -1
    } else {
      this.addInstrument(instrument);
      return 1;//added = 1
    }

    return 0;//none
  },

  addInstrument: function(instrument) {
    this.instruments[instrument.Id] = instrument.Name;
  },

  removeInstrument: function(instrument) {
    ret = (this.instruments[instrument.Id]? true : false);

    if(ret)
      delete this.instruments[instrument.Id];

    return ret;
  },

  load: function(grp) {
    this.name = grp.name;
    this.id = grp.id;
    this.instruments = grp.instruments;
    this.entriesId = grp.entriesId;

    for(en in grp.entries) {
      entry = new GroupEntry(0, 0);
      entry.load(grp.entries[en]);
      this.entries[entry.Id] = entry;
    }
  }

});

module.exports = Group;
