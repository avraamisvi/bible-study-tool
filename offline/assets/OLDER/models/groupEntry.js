var BaseClass = require('base-class-extend');

var GroupEntry = BaseClass.extend({

  constructor: function (id, start) {
    this.id = id;
    this.start = start;
    this.duration = 1000;
  },

  get Start() { return this.start; },

  set Start(start) {
    this.start = start;
  },

  get Duration() { return this.duration; },

  set Duration(dur) {
    this.duration = dur;
  },

  get Id() { return this.id; },

  load: function(entry) {
    this.id = entry.id;
    this.start = entry.start;
    this.duration = entry.duration;    
  }
});

module.exports = GroupEntry;
