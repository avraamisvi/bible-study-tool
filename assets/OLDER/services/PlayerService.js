var BaseClass = require('base-class-extend');

var PlayerService = BaseClass.extend({

  constructor: function PlayerService() {
    window.playerService = this;

    this.connect();
  },

  connect: function() {
    Socket.open(this);
  },

  play: function(composition) {
    Socket.send(JSON.stringify({
      type: "PLAY",
      composition: composition
    }));
  },

  stop: function() {
    Socket.send(JSON.stringify({type:"STOP"}));
  }
});

var Socket = {
  socket: null,
  view: null,
  port: 8887,

  open: function(view) {

    this.view = view;
    this.socket = new WebSocket("ws://localhost:" + this.port);
    this.socket.onopen = function()
    {
       // Web Socket is connected
       console.log("Connected");
    };

    this.socket.onmessage = function (evt)
    {
       this.view.publish(evt.data);
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

module.exports = PlayerService;
