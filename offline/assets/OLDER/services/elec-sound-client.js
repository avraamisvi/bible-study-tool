var BaseClass = require('base-class-extend');

var ElecSoundClient = BaseClass.extend({

  messageHandler: null,
  listeners: {},

  constructor: function(messageHandler) {
    this.messageHandler = messageHandler;
  },

  connect: function() {
    Socket.open(this);
  },

  play: function() {
    Socket.send(JSON.stringify({
      name: MessagesConstants.PLAY,
      start: 0 //TODO pegar o valor atual do cursor
    }));
  },

  stop: function() {
    Socket.send(JSON.stringify({
      name: MessagesConstants.STOP
    }));
  },

  play_instrument: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.PLAY_INSTRUMENT,
      instrumentItemId: data.instrumentItemId,
      note: data.note
    }));
  },

  create_project: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.CREATE_PROJECT,
      projectName: data.projectName
    }));
  },

  set_project_settings: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.SET_PROJECT_SETTINGS,
      settings: {
        timeLength: data.timeLength
      }
    }));
  },
  save_project: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.SAVE_PROJECT,
      filePath: data.filePath
    }));
  },
  add_trackline: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.ADD_TRACKLINE,
      trackLineId: data.trackLineId,
    	trackLineName: data.trackLineName,
    	position: data.position
    }));
  },
  add_trackitem: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.ADD_TRACKITEM,
    	trackLineId: data.trackLineId,
    	trackItemId: data.trackItemId,
    	instrumentItemId: data.instrumentItemId
    }));
  },
  remove_trackitem: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.REMOVE_TRACKITEM,
      trackLineId: data.trackLineId,
      trackItemId: data.trackItemId
    }));
  },
  add_instrument: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.ADD_INSTRUMENT,
      instrumentItemId: data.instrumentItemId,
    	instrumentId:  data.instrumentId,
    	position: data.position
    }));
  },
  remove_instrument: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.REMOVE_INSTRUMENT,
      instrumentItemId: data.instrumentItemId
    }));
  },
  list_instruments: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.LIST_INSTRUMENTS
    }));
  },
  get_instrument_config: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.GET_INSTRUMENT_CONFIG,
      instrumentItemId: data.instrumentItemId
    }));
  },
  set_instrument_mode: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.SET_INSTRUMENT_MODE,
      instrumentItemId: data.instrumentItemId,
    	pianoRoll: data.pianoRoll
    }));
  },
  set_instrument_amplitude: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.SET_INSTRUMENT_AMPLITUDE,
      instrumentItemId: data.instrumentItemId,
    	amplitude: data.amplitude
    }));
  },
  set_instrument_muted: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.SET_INSTRUMENT_MUTED,
      instrumentItemId: data.instrumentItemId,
    	muted: data.muted
    }));
  },
  add_pianoroll_entry: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.ADD_PIANOROLL_ENTRY,
      instrumentItemId: data.instrumentItemId,
      entryId: data.entryId,
    	note: data.note,
    	duration: data.duration,
    	when: data.when
    }));
  },
  set_pianoroll_entry: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.SET_PIANOROLL_ENTRY,
      instrumentItemId: data.instrumentItemId,
      entryId: data.entryId,
    	duration: data.duration,
    	when: data.when
    }));
  },
  remove_pianoroll_entry: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.REMOVE_PIANOROLL_ENTRY,
      instrumentItemId: data.instrumentItemId,
      entryId: data.entryId
    }));
  },
  set_instrument_configuration: function(data) {//TODO
    Socket.send(JSON.stringify({
      name: MessagesConstants.SET_INSTRUMENT_CONFIGURATION,
      configuration: data.configuration,
      instrumentItemId: data.instrumentItemId
    }));
  },
  
  set_instrument_loop_index_note: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.SET_INSTRUMENT_LOOP_INDEX_NOTE,
      instrumentItemId: data.instrumentItemId,
      index: data.index,
      note: data.note
    }));
  },

  add_track_line: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.ADD_TRACK_LINE,
      trackLineId: data.trackLineId,
    	trackLineName: data.trackLineName,
    	position: data.position
    }));
  },

  add_track_item: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.ADD_TRACK_ITEM,
      trackLineId: data.trackLineId,
    	trackItemId: data.trackItemId,
    	instrumentItemId: data.instrumentItemId,
    	start: data.start,
    	end: data.end
    }));
  },

  set_trackitem_info: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.SET_TRACKITEM_INFO,
      trackLineId: data.trackLineId,
    	trackItemId: data.trackItemId,
    	start: data.start,
    	end: data.end
    }));
  },

  remove_track_line: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.REMOVE_TRACK_LINE,
      trackLineId: data.trackLineId
    }));
  },
  remove_track_item: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.REMOVE_TRACK_ITEM,
      trackLineId: data.trackLineId,
    	trackItemId: data.trackItemId
    }));
  },
  open_project: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.OPEN_PROJECT,
      fileName: data.fileName
    }));
  },
  set_loop_index: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.SET_LOOP_INDEX,
      instrumentItemId: data.instrumentItemId,
    	index: data.index,
    	state: data.state
    }));
  },
  stop_instrument: function(data) {
    Socket.send(JSON.stringify({
      name: MessagesConstants.STOP_INSTRUMENT,
      instrumentItemId: data.instrumentItemId
    }));
  },
  shutdown: function() {
    Socket.send(JSON.stringify({name: MessagesConstants.SHUTDOWN}));
  }
});

var Socket = {
  socket: null,
  interface: null,
  port: 9000,

  open: function(interface) {

    this.interface = interface;
    this.socket = new WebSocket("ws://localhost:" + this.port);
    this.socket.onopen = function()
    {
       // Web Socket is connected
       console.log("Connected");
       Socket.interface.messageHandler.onConnect()
    };

    this.socket.onmessage = function (evt)
    {
      console.log(evt.data);
      msg = JSON.parse(evt.data);
      Socket.interface.messageHandler.onMessage(msg);
    };

    this.socket.onclose = function()
    {
       // websocket is closed.
       console.log("Connection is closed...");
    };

    this.socket.onerror = function(ev)
    {
       console.log("ERROR:" + ev);
    };
  },

  send: function(message) {
      this.socket.send(message);
      console.log(message)
  }
}

module.exports = ElecSoundClient;
