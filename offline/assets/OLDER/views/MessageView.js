//It connects to the timeline server
var BaseClass = require('base-class-extend');

var MessageView = BaseClass.extend({

  constructor: function MessageView() {
    window.messageView = this;
  },


  showError: function(message) {

    if(!$("#messageErrorPanel").length) {
      $(document.body).append(nunjucks.render(__dirname + '/templates/messageErrorTmpl.html', {title:"Error", message: message}));
    } else {
      $("#messageErrorPanelMessage").append('<br clear="all">'+message);
    }
  },

  showInfo: function(message) {

    if(!$("#messageInfoPanel").length) {
      $(document.body).append(nunjucks.render(__dirname + '/templates/messageInfoTmpl.html', {title:"Info", message: message}));
    } else {
      $("#messageInfoPanelMessage").append('<br clear="all">'+message);
    }
  },

  clickErrorPanel: function() {
    $("#messageErrorPanel").remove();
  },

  clickInfoPanel: function() {
    $("#messageInfoPanel").remove();
  },

  showInstrumentNotFoundError: function(name) {
    this.showError("Instrument " + name + " was not found in the system for this composition! The composition may not play properly.");
  }

});


module.exports = MessageView;
