var BaseClass = require('base-class-extend');
var Draggable  = require('../gui/draggable');

var InstrumetSettingsDialog = BaseClass.extend({

  element: null,
  instrument: null,
  saveCallback: null,
  cancelCallback: null,
  configurationMessageListenerId: null,

  constructor: function(instrument, saveCallback, cancelCallback) {
    this.instrument = instrument;
    this.saveCallback = saveCallback;
    this.cancelCallback = cancelCallback;
  },

  configure: function() {

    $(document.body).append(nunjucks.render(__dirname + '/templates/instrument-settings-dialog-tmpl.html', {
      id: this.instrument.instrument.id,//TODO 0.o
      color: this.instrument.color,
      name: this.instrument.instrument.name
    }));

    this.element = $("#instrument-settings-dialog");

    applyButtonEffect("#instrument-settings-dialog");//funcao global de efeito de botao TODO mudar para uma classe?

    this.element.find("#instrument-settings-dialog-save-button").click(function(self){
      return function(ev) {
        self.saveCallback(self.getFields());
        self.hide();
        self.saveIntoServer();
      }
    }(this));

    this.element.find("#instrument-settings-dialog-cancel-button").click(function(self){
      return function(ev) {
        self.cancelCallback(self.getFields());
        self.hide();
      }
    }(this));

    new Draggable("#instrument-settings-dialog", function(ev) {
      //nope
    },
    function(x, y){
      return {x: x, y: y};
    });

  },

  show: function() {
    this.configure();
    this.getConfigurationFromServer();
  },

  hide: function() {
    this.element.remove();
    this.removeConfigurationMessageListener();
  },

  getFields: function() {
    return {
      color: this.element.find("#instrument-name-dialog-field-color").val(),
      initialLoopSeqIndex: parseInt(this.element.find("#instrument-name-dialog-field-loop-index").val()),
      speed: this.parseLoopSpeed(this.element.find("[name='instrument-name-dialog-field-loop-speed']:checked").val())
    };
  },

  parseLoopSpeed: function(data) {
    return parseInt(data) > 1? 0.6 : 0.3;
  },

  getConfigurationFromServer: function () {

    this.configurationMessageListenerId = window.elecSoundClient.
    messageHandler.addMessageListener(function(self){
      return function(msg) {
        console.log(msg)
        if(msg.instrumentItemId == self.instrument.id) {
          $("#instrument-name-dialog-field-loop-index").val(msg.configuration.initialLoopSeqIndex);
        }
      };
    }(this))

    //=== SERVER ===
    window.elecSoundClient.get_instrument_config({
      instrumentItemId: this.instrument.id
    });

  },

  removeConfigurationMessageListener: function () {
    this.configureListenerId = window.elecSoundClient.
    messageHandler.removeMessageListener(this.configurationMessageListenerId);
  },

  saveIntoServer: function() {

    localFields = this.getFields();

    window.elecSoundClient.set_instrument_configuration({
      instrumentItemId: this.instrument.id,
      configuration:{
        color: hexToRgb(localFields.color),
        initialLoopSeqIndex: localFields.initialLoopSeqIndex,
        speed: localFields.speed,
        fields:{}
      }
    });
  },

});

module.exports = InstrumetSettingsDialog;
