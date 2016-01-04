var BaseClass = require('base-class-extend');

var MessageHandler = BaseClass.extend({

  onConnectCallBack: null,
  listeners: {},

  constructor: function(callback) {
    this.onConnectCallBack = callback;
  },

  onConnect: function() {
    this.onConnectCallBack();
  },

  addMessageListener: function(lis) {
    id = new Date().getTime();

    this.listeners[id] = lis;

    return id;
  },

  removeMessageListener: function(id) {
    delete this.listeners[id];
  },

  onMessage: function(msg) {

    if(msg.name == MessagesConstants.LIST_INSTRUMENTS) {
      this.processListInstruments(msg);
    }
    else
    if(msg.name == MessagesConstants.CREATE_PROJECT) {
      this.processCreateProject(msg);
    }

    for(key in this.listeners) {
      this.listeners[key](msg);
    }
  },

  processListInstruments: function(msg) {
    console.log(msg);

    for(i = 0; i < msg.groups.length; i++) {
      workspace.libraryPanel.addGroup({
        id: msg.groups[i].name,
        label: msg.groups[i].name,
        instruments: msg.groups[i].instruments
      });
    }

    window.elecSoundClient.create_project({
      projectName: "New Project"
    });

    workspace.libraryPanel.refresh();
  },

  processCreateProject: function(msg) {
    if(msg.status = "OK") {
      workspace.configureCompositionPanel();
      workspace.configureInstrumentPanel();
    }
  },

});

module.exports = MessageHandler;
