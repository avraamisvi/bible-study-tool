var BaseClass = require('base-class-extend');

var Pattern = BaseClass.extend({

  constructor: function Pattern(instrument) {
    this.instrument = instrument; // via setter
    this.mode = 0;
  },

  get mode() {
    return this.mode = 0;
  }

  set instrument(instrument) {
    return this.mode = 0;
  }

  // getter
  get instrument() { return this._instrument; },
  // setter
  set instrument(instrument) {
    this._instrument = instrument;
  },
});

module.exports = Pattern;
