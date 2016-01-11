var BaseClass = require('base-class-extend');
var Instrument = require("../models/instrument.js")

var InstrumentsListView = BaseClass.extend({

  constructor: function InstrumentsListView() {
    this.instruments = {};
    this.load();
  },

  load: function() {
    Socket.open(this);
  },

  getInstrumentDefinition: function(name) {
    return this.instruments[name];
  },

  loadInstruments: function(instruments) {
    console.log(instruments)

    messageView.showInfo("Loading registered instruments...");

    this.instruments = instruments;
    this.createList();
  },

  open: function() {
    window.instrumentsListView = this;

    if(this.instruments)
      this.createList();
  },

  createList: function() {

    $("#lateral").html("");

    for(instname in this.instruments) {

      instrument = this.instruments[instname];

      if(!$("#instrument_list_category_"+instrument.category).length) {
        $("#lateral").append(nunjucks.render(__dirname + '/templates/instrumentsListCategoryTmpl.html', {title: instrument.category}));
      }

      $("#instrument_list_category_"+instrument.category+"_items").append(nunjucks.render(__dirname + '/templates/instrumentsItemTmpl.html', instrument));

    }
  },

  showCategory: function(title) {
    $("#instrument_list_category_"+title+"_items").toggle();
  },

  addInstrument: function(name) {//put an instrument in the patterns window

    this.instrumentsId++;

    data = this.instruments[name]
    instr = new Instrument(this.instrumentsId, name, data.type);

    instr.initOptions(data.options);

    patternsView.addInstrument(instr);
  },

  verifyInstrumentExists: function(name) {//show error if an instrument do not exists
    if(!this.instruments[name]) {
      messageView.showInstrumentNotFoundError(name);
      return false;
    }

    return true;
  }

});

var Socket = {
  socket: null,
  view: null,

  open: function(view) {

    this.view = view;
    var socket = new WebSocket("ws://localhost:8887");
    socket.onopen = function()
    {
       // Web Socket is connected, send data using send()
       socket.send(Socket.createListInstruments());
       console.log("Message is sent...");
    };

    socket.onmessage = function (evt)
    {
       view.loadInstruments(JSON.parse(evt.data));
       console.log("Message is received...");
    };

    socket.onclose = function()
    {
       // websocket is closed.
       console.log("Connection is closed...");
    };
  },

  createListInstruments: function() {
    return JSON.stringify({type:"LIST"});
  }
}


module.exports = InstrumentsListView;
