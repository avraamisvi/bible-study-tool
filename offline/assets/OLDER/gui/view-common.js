var BaseClass = require('base-class-extend');

var ViewCommon = BaseClass.extend({

  constructor: function() {
  },

  translateSecondsWidth: function(secs) {
    return secs*20;
  },

  translateWidthSeconds: function(wid) {
    return wid/20;
  }

});

module.exports = ViewCommon;
