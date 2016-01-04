var BaseClass = require('base-class-extend');

var PlayingStatusClient = BaseClass.extend({

  callback: null,

  constructor: function(callback) {
    this.callback = callback;
  },

  connect: function() {
    Socket.open(this);
  },

  update: function(data) {
    if(this.callback)
      this.callback(data);
  }

});

var Socket = {
  socket: null,
  interface: null,
  port: 9009,//TODO config

  open: function(interface) {

    this.interface = interface;
    this.socket = new WebSocket("ws://localhost:" + this.port);
    this.socket.onopen = function()
    {
       // Web Socket is connected
       console.log("Connected playing");
       //Socket.interface.messageHandler.onConnect()
    };

    this.socket.onmessage = function (evt)
    {
      Socket.interface.update(evt.data)
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
  }
}

module.exports = PlayingStatusClient;
