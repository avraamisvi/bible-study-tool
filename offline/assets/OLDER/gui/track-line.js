var BaseClass = require('base-class-extend');

var TrackLineItem = require('../gui/track-line-item');
var ViewCommon = require('../gui/view-common');

var TrackLine = BaseClass.extend({

  composition: null,
  items: [],
  id: null,
  label: "new track",
  deleteButton: null,
  frame: null,
  frameLabel: null,
  color: 0,

  constructor: function() {
  },

  createView: function(labelContainer, lineContainer) {
    var line = '<div class="composition-track" id="composition-track-' + this.id +'"></div>'
    var label = nunjucks.render(__dirname + '/templates/track-line-label-tmpl.html', {id:this.id, label: this.label});

    labelContainer.append(label);
    lineContainer.append(line);

    this.frame = $("#composition-track-" + this.id);
    this.frameLabel = $("#composition-track-label-" + this.id);

    this.frame.width(new ViewCommon().translateSecondsWidth(window.workspace.seconds));

    this.deleteButton = this.frameLabel.find("#track-line-item-label-delete-button-"+this.id);
    this.deleteButton.click(function(self){
      return function(e){
        self.delete();
      };
    }(this));
  },

  configure: function(config){

    this.id = config.id;
    this.composition = config.composition;
    this.label = config.label;
    this.seconds = config.seconds;

    this.createView(config.labelContainer, config.lineContainer);

    $("#composition-track-" + this.id)[0].onclick=function(self) {
      return function(ev) {

        if(!self.composition.isWriteMode())
          return;

        if(!workspace.instrumentPanel.instrumentSelected) {
          workspace.warnDialog("Please, select an instrument.");
          return;
        }

        instrument = workspace.instrumentPanel.instrumentSelected.instrument;
        instSelected = workspace.instrumentPanel.instrumentSelected;
        localColor = computeTrackLineItemColor(instSelected.color);

        var time = new Date().getTime();

        var tckitm = new TrackLineItem();
        tckitm.configure({
          id: time,
          owner: self,
          instrument: instSelected.instrument,//TODO encapsular o id do instrumento no id do panel?
          instrumentItemId: instSelected.id,
          start: ev.layerX,
          color: localColor
        });

        self.addItem(tckitm);
      };
    }(this);

    var textlabel = $("#track-label-text-" + config.id);
    var textlabelContent = $("#track-label-text-content-"+config.id);

    textlabelContent.keypress(function(e) {

      if(e.which == 13) {
        this.blur();
      }

      return e.which != 13;
    });

    textlabelContent.blur(function(self) {
      return function(e) {
        ret = $(this).html().length > 0;

        if(!ret) {
          window.workspace.warnDialog('The name of a trackline could not be "empty".');
          this.innerHTML = self.label;
        }

        if(this.innerHTML.length > 30) {
          window.workspace.warnDialog('The name of a trackline could not have more than 30 characters.');
          this.innerHTML = self.label;
          ret = false;
        }

        if(ret)
          self.label = this.innerHTML;

        return ret;
      }
    }(this));

    if(TrackLine.counterTrackClass > 0) {
      this.frameLabel.addClass("composition-track-label-color" + TrackLine.counterTrackClass);
      textlabel.addClass("track-label-text-color" + TrackLine.counterTrackClass);
    }

    this.color = TrackLine.counterTrackClass;

    TrackLine.counterTrackClass++;
    if(TrackLine.counterTrackClass > 3) {
      TrackLine.counterTrackClass = 0;
    }

    this.createIntoServer();
  },

  addItem: function(item) {
    this.items[item.id] = item;
  },

  deleteItem: function(item) {
    delete this.items[item.id];
  },

  delete: function(item) {
    this.composition.deleteTrackLine(this);
    this.frame.remove();
    this.frameLabel.remove();

    dispachCustomEvent(EventTrackLineDelete + this.id, {});

    this.removeFromServer();
  },

  createIntoServer: function () {
    //=== SERVER ===
    window.elecSoundClient.add_track_line({
      trackLineId: this.id,
      trackLineName: this.label,
    	position: 0
    });
  },

  removeFromServer: function () {
    //=== SERVER ===
    window.elecSoundClient.remove_track_line({
      trackLineId: this.id
    });
  },

});

TrackLine.counterTrackClass = 0;

module.exports = TrackLine;
