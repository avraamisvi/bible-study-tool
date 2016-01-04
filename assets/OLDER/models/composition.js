var BaseClass = require('base-class-extend');

var Composition = BaseClass.extend({

  constructor: function Composition(value) {
    this.value = value; // via setter
  },

  // getter
  get value() { return this._value; },
  // setter
  set value(value) {
    this._value = value;
  },
});

module.exports = Composition;
