//Modal for instrument edition
var BaseClass = require('base-class-extend');

var ModalChangeInstrumentOptionsView = BaseClass.extend({

  constructor: function ModalChangeInstrumentNameView() {
    window.modalChangeInstrumentOptionsView = this;
  },

  show: function(instrument) {

    if($("#modal-change-instrument-options").length) {
      return;
    }

    this.instrument = instrument;

    $(document.body).append(nunjucks.render(__dirname + '/templates/modalChangeInstrumentOptionsTmpl.html', {label: instrument.Label}));

    this.createControls();
  },

  cancel: function() {
    $("#modal-change-instrument-options").remove();
  },

  save: function() {
    this.instrument.Label = $("#modal-change-instrument-name-inputtext").val()
    $("#inst_id_" + this.instrument.Id + "_button").html(this.instrument.Label);

    this.saveOptions();

    $("#modal-change-instrument-options").remove();
  },

  createControls: function() {

    var instrumentDef = instrumentsListView.getInstrumentDefinition(this.instrument.Name);

    for(var i = 0; i < instrumentDef.controls.length; i++) {

      if(!instrumentDef.controls[i])
        continue;

      var option = instrumentDef.options[instrumentDef.controls[i].option];
      var control = instrumentDef.controls[i];
      var instrVal = this.instrument.Options[control.option];

      console.log(option);

      if(control.type == "radios") {
        $("#modal-change-instrument-panel-options").append(nunjucks.render(__dirname + '/templates/instrument/radiosTmpl.html', {instrumentValue: instrVal, control: control, option: option}));
      } else if(control.type == "range") {
        $("#modal-change-instrument-panel-options").append(nunjucks.render(__dirname + '/templates/instrument/rangeTmpl.html', {instrumentValue: instrVal, control: control, option: option}));
      } else if(control.type == "spinner") {
        $("#modal-change-instrument-panel-options").append(nunjucks.render(__dirname + '/templates/instrument/spinnerTmpl.html', {instrumentValue: instrVal, control: control, option: option}));
      } else if (control.type == "combobox") {
        $("#modal-change-instrument-panel-options").append(nunjucks.render(__dirname + '/templates/instrument/comboTmpl.html', {instrumentValue: instrVal, control: control, option: option}));
      } else if (control.type == "checkbox") {
        $("#modal-change-instrument-panel-options").append(nunjucks.render(__dirname + '/templates/instrument/checkboxTmpl.html', {instrumentValue: instrVal, control: control, option: option}));
      }

    }
  },

  saveOptions: function() {
    var instrumentDef = instrumentsListView.getInstrumentDefinition(this.instrument.Name);

    for(var i = 0; i < instrumentDef.controls.length; i++) {

      if(!instrumentDef.controls[i])
        continue;

      var option = instrumentDef.options[instrumentDef.controls[i].option];
      var control = instrumentDef.controls[i];

      if(control.type == "radios") {
        this.saveRadios(control, option);
      } else if(control.type == "checkbox") {
        this.saveOptionCheckbox(control.type, control.option)
      } else {
        this.saveOption(control.type, control.option)
      }
    }
  },

  saveOption: function(type, name) {
    optionVal = $("#" + type + "_" + name).val()
    this.instrument.Options[name] = optionVal;
  },

  saveOptionCheckbox: function(type, name) {
    optionVal = $("#" + type + "_" + name).is(":checked")? 1 : 0;
    this.instrument.Options[name] = optionVal;
  },

  saveRadios: function(control, option) {
    for(radio in control.value) {
      checked = $("#radios_" + control.option + "_" + radio.position).is(":checked");
      if(checked) {
        this.instrument.Options[control.option] = option.list[radio.position];
        break;
      }
    }
  }

});

module.exports = ModalChangeInstrumentOptionsView;
