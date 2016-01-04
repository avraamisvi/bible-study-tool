//It connects to the timeline server
var BaseClass = require('base-class-extend');


function updater() {
  requestAnimationFrame(updater);
  window.timeLineView.publish();
}

var TimeLineView = BaseClass.extend({

  constructor: function TimeLineView() {
    this.instruments = {};
    this.connect();
    this.position = "0";
    this.updateNeedle = false;

    window.timeLineView = this;

    requestAnimationFrame(updater);
  },

  startUpdater: function() {
    this.updateNeedle = true;
    this.position = "0";
  },

  stopUpdater: function() {
    this.updateNeedle = false;
    this.position = "0";
  },

  set Position(pos) {
    this.position = pos;
  },

  connect: function() {
    Socket.open(this);
  },

  publish: function() {
    if(this.updateNeedle) {
      //TODO publish to other views
      compositionView.setTimePosition(parseFloat(this.position));

      if(window.pianoRollView) {
        //console.log(window.pianoRollView)
        pianoRollView.setTimePosition(parseFloat(this.position));
      }
    }
  }

});

var Socket = {
  socket: null,
  view: null,
  port: 8886,

  open: function(view) {

    this.view = view;
    var socket = new WebSocket("ws://localhost:" + this.port);
    socket.onopen = function()
    {
       // Web Socket is connected
       console.log("Connected");
    };

    socket.onmessage = function (evt)
    {
      //Socket.view.publish(evt.data);
      Socket.view.Position = evt.data;
      //console.log(evt.data)
    };

    socket.onclose = function()
    {
       // websocket is closed.
       console.log("Connection is closed...");
    };
  }
}

module.exports = TimeLineView;
