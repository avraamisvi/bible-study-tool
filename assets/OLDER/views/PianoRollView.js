var BaseClass = require('base-class-extend');
var Composition = require("../models/composition.js")

/*
  Funcionalidades da view pianoroll
*/
var PianoRollView = BaseClass.extend({

  constructor: function PatternsView(instrument) {
    this.mode = -1;
    this.instrument = instrument;
  },

  isEditionMode: function() {
    return this.mode == 1;
  },

  isDeletionMode: function() {
    return this.mode == 0;
  },

  toggleModeEdition: function() {

    this.removeModeSelection();

    if(this.mode == 1) {
      this.mode = -1;
    } else {
      this.mode = 1;
      $("#pianoRollButtonWrite").addClass("piano-roll-toolbar-button-selected");
    }
  },

  toggleModeDeletion: function() {
    this.removeModeSelection();

    if(this.mode == 0) {
      this.mode = -1;
    } else {
      this.mode = 0;
      $("#pianoRollButtonDelete").addClass("piano-roll-toolbar-button-selected");
    }
  },

  /*
    remove the class from the current selected button.
  */
  removeModeSelection: function() {
    var remove = null;

    if(this.mode == 1) {
      remove = "#pianoRollButtonWrite";
    } else if(this.mode == 0) {
      remove = "#pianoRollButtonDelete";
    }

    if(remove) {
      $(remove).removeClass("piano-roll-toolbar-button-selected");
    }
  },

  generateSeconds: function() {
    ret = [];

    for(var i = 1; i <= 600; i++) {
      ret.push(i)
    }

    return ret;
  },

  setNodeInTimeline: function(noteId, duration, start) {
      this.instrument.setNote(noteId, duration, start);
  },

  addNodeInTimeline: function(note, duration, start) {
    if(this.mode == 1) {
      return this.instrument.addNote(note, duration, start);
    }

    return null;
  },

  removeNodeFromTimeline: function(noteId) {
    if(this.mode == 0) {
      this.instrument.removeNote(noteId);
    }
  },

  close: function() {
    $("#pianoRollWindowPanel").remove();
  },

  openWindow: function() {

    $("#contentPianoRoll").append(nunjucks.render(__dirname + '/templates/pianoRollTmpl.html'));

    this.creatCanvas();
    this.setScrollBars();
  },

  loadInstrumentPianoEntries: function() {
    Grid.loadEntries(this.instrument, this);
  },

  creatCanvas:function() {

    w = $("#pianoRollContent").width()
    h = $("#pianoRollContent").height()

    $("#pianoRollCanvas").prop("width", w-15);
    $("#pianoRollCanvas").prop("height", h);

    Grid.create(this.instrument.Notes, this);
    this.loadInstrumentPianoEntries();
  },

  setScrollBars: function() {
    wid = $("#compositionHorizontalScroolBar").width();
    $("#pianoRollHorizontalBarDragger").attr("max", wid);
    $("#pianoRollHorizontalBarDragger").attr("min", 0);

    hei = $("#pianoRollVerticalScroolBar").height();
    $("#pianoRollVerticalBarDragger").attr("max", hei);
    $("#pianoRollVerticalBarDragger").attr("min", 0);
    $("#pianoRollVerticalBarDragger").val(hei);
  },

  horizontalBarChange: function() {
    wid = $("#pianoRollHorizontalScroolBar").width();
    val = $("#pianoRollHorizontalBarDragger").val();

    console.log("val:" + val + " wid:" + wid);

    Grid.handleMoveHorizontalScroll(val/wid);
  },

  verticalBarChange: function() {

    max = $("#pianoRollVerticalBarDragger").attr("max");
    val = $("#pianoRollVerticalBarDragger").val();

    Grid.handleMoveVerticalScroll((max-val)/max);
  },

  horizontalBarWheel: function(event) {
    console.log(event)
    max = $("#pianoRollHorizontalBarDragger").attr("max");
    val = $("#pianoRollHorizontalBarDragger").val();

    val = parseFloat(val) + parseFloat(event.wheelDelta>0?2:-2);

    if(val > max)
      val = max

    if(val < 0)
        val = 0

    $("#pianoRollHorizontalBarDragger").val(val);

    this.horizontalBarChange();
  },

  verticalBarWheel: function(event) {
    console.log(event)
    max = $("#pianoRollVerticalBarDragger").attr("max");
    val = $("#pianoRollVerticalBarDragger").val();

    val = parseFloat(val) + parseFloat(event.wheelDelta>0?2:-2);

    if(val > max)
      val = max

    if(val < 0)
        val = 0

    $("#pianoRollVerticalBarDragger").val(val);

    this.verticalBarChange();
  },

  setTimePosition: function(time) {
      Grid.setTimePosition(time);
  },

  resetTimeNeedle: function() {
    Grid.resetTimeNeedle();
  }

});

var Grid = {

  keys_width: 50,//key_width
  notes_height: 15,//key_height
  seconds_height: 15,
  min_seconds: 600,
  stage: null,
  pianoRoll: null,
  width_time_base: 55,//tamanho em pixel da entrada no piano roll (o rect criado e inserdo no timelineContainer)
  width_sec_base: 100,//tamanho em pixel dos segundos
  secondsContainer: null,
  keysContainer: null,
  timelineContainer: null,
  timelineEntriesContainer: null,
  oldX: 0,
  oldY: 0,
  deltaXAcc:0,//keeps the real delta of X ( including the deltaFactor)
  deltaYAcc: 0,
  deltaFactor: 1,
  loadingMode: false,//indicates if it is necessary to add the note entry into the instrument.
  loadingNoteId: 0,//note id being loaded
  gridIndexLines: {},
  needleContainer: null,
  timeNeedle: null,
  notesLength: 1,

  create: function(notes, pianoRoll) {

      this.pianoRoll = pianoRoll;
      this.stage = new createjs.Stage("pianoRollCanvas");
      this.stage.enableMouseOver();

      this.notesLength = notes.length;

      this.timelineContainer = new createjs.Container();
      this.timelineEntriesContainer = new createjs.Container();

      //for: create keys
      for(var i = 0; i < notes.length; i++) {

        var rect = new createjs.Shape();
        rect.graphics.beginFill("#263c4a")
        .beginStroke("#1a262d")
        .drawRect(50, i*this.notes_height+this.seconds_height, 100*600, this.notes_height);

        //stage.addChild(rect);
        this.timelineContainer.addChild(rect);

        this.gridIndexLines[notes[i].name]={index:i, line:rect};

        rect.note = notes[i].name;
        rect.gridIndex = i;
        rect.timeline = true;//indicates if it is a timeline for put the notes

        rect.on("click", function(self) {
          return function(ev) {
            targ = ev.target;
            //console.log(ev)
            if(targ && targ.timeline) {
              //console.log(ev.stageX);
              self.putNote(targ.note, ev.stageX, targ.gridIndex, targ);
            }
          }
        }(this));
    }

    this.stage.addChild(this.timelineContainer);
    this.stage.addChild(this.timelineEntriesContainer);

    this.updateTimeLine();

    this.createKeys(notes);
    this.createSeconds();

    this.createNeedleTimePosition();

    this.stage.update();
  },

  createSeconds: function() {

      this.secondsContainer = new createjs.Container();

      for(var i = 0; i < 600; i++) {

        var rect = new createjs.Shape();
        rect.graphics.beginFill("#03131c")
        .beginStroke("#1a262d")
        .drawRect(0, 0, this.width_sec_base, this.notes_height);

        rect.note = "second_"+i;
        rect.second = i;
        rect.second = true;

        rect.on("click", function(self) {
          return function(ev) {
          }
        }(this));

        var label = new createjs.Text(i+1, "bold 9px Arial", "white");
        label.name = "piano_sec_label_"+i;
        label.textAlign = "right";
        label.textBaseline = "middle";
        label.x = 95;
        label.y = this.notes_height/2;

        var second = new createjs.Container();
        second.name = "piano_second_" + i;
        second.x = this.width_sec_base*i+50;
        second.y = 0;
        second.addChild(rect, label);

        this.secondsContainer.addChild(second);
    }

    this.updateSecondsContainer();
    this.stage.addChild(this.secondsContainer);
  //  this.stage.update();
  },

  createKeys: function(notes) {

      this.keysContainer = new createjs.Container();

      for(var i = 0; i < notes.length; i++) {

        var rect = new createjs.Shape();//DeepSkyBlue
        rect.graphics
        .beginFill("white")
        .beginStroke("#cbc8c8")
        .drawRect(0, 0, 50, this.notes_height);

        if(notes[i].half){
          rect.graphics
          .beginFill("black")
          .drawRect(0, 0, 20, this.notes_height);
        }

        var label = new createjs.Text(notes[i].name, "bold 9px Arial", "black");
        label.name = "piano_key_label_"+notes[i].name;
        label.textAlign = "right";
        label.textBaseline = "middle";
        label.x = 40;
        label.y = this.notes_height/2;

        var key = new createjs.Container();
        key.name = "piano_key_" + notes[i].name;
        key.x = 0;
        key.y = (i*this.notes_height)+this.seconds_height;
        key.addChild(rect, label);

        this.keysContainer.addChild(key);
        //stage.addChild(key);
      }

      this.updateKeysContainer();
      this.stage.addChild(this.keysContainer);
  },

  translateWidthToDuration: function(w) {
    return (w*1000)/this.width_time_base;
  },

  translatePositionXToSecond: function(x) {
    return (x*1000)/this.width_sec_base;
  },

  /*
    Set note into timeline
    internal use.
  */
  setNote: function(noteId, x, duration) {
         startX = this.translatePositionXToSecond(x);

         //console.log("startX:" + startX)

         this.pianoRoll.setNodeInTimeline(noteId,
          this.translateWidthToDuration(duration),
          startX);
  },

  addNote: function(note, x, duration) {
         return this.pianoRoll.addNodeInTimeline(note,
          this.translateWidthToDuration(duration),
          this.translatePositionXToSecond(x));
  },

  /*
    puts a new note into timeline.
  */
  putNote: function(note, x, index, line) {

    if(!this.pianoRoll.isEditionMode())
      return;

    x = x + this.deltaXAcc;//this.deltaAcc
    localDuration = 100;

    var noteId = null;

    if(this.loadingMode) {
      noteId = this.loadingNoteId;
      localDuration = this.loadingDuration;
    } else {//if not load mode, so add a new note into instrument
      noteId = this.addNote(note, x, this.width_time_base);
      localDuration = this.width_time_base;
    }

    //console.log("putNote:" + note + " at " + x + " id:" + noteId + " duration:" + localDuration);

    var rect = new createjs.Shape();
    rect.graphics.beginFill("DeepSkyBlue")
    .drawRect(0, 0, localDuration, this.notes_height);

    rect.x = x;
    rect.y = (index*this.notes_height)+this.seconds_height;
    rect.note = note;
    rect.noteId = noteId;
    rect.instrumentId = 1;
    rect.instrument = {};
    rect._length = localDuration;
    rect.timelineX = x;
    rect.notMoved = true;

    rect.on("click", function(self){
      return function(ev) {
        targ = ev.target;

        if(self.pianoRoll.isDeletionMode()) {
          self.timelineContainer.removeChild(targ);
          self.timelineContainer.removeChild(targ.noteAnchor);
          self.pianoRoll.removeNodeFromTimeline(targ.noteId);

          self.updateTimeLineEntries();
          self.stage.update();
        }
      }
    }(this));

    rect.on("pressmove",function(self) {
        return function(evt) {

          targ = evt.currentTarget;
          delta = self.handleDrag(targ, evt.stageX)
          targ.noteAnchor.x = targ.noteAnchor.x + delta;
          targ.noteAnchor.notMoved = true;

          self.setNote(targ.noteId, targ.x, targ._length);

          self.updateTimeLineEntries();
          self.stage.update();
      }
    }(this));

    //this.timelineContainer.addChildAt(rect, this.timelineContainer.getChildIndex(line)+1);
    this.timelineEntriesContainer.addChild(rect);

//===================Anchor==============================

    var anchor = new createjs.Shape();
    anchor.graphics.beginFill("DeepSkyBlue")
    .drawRect(0, 0, 5, this.notes_height);

    anchor.x = x+localDuration;
    anchor.y = index*this.notes_height+this.seconds_height

    anchor.on("mouseover", function(self){
      return function(ev) {
        $('html,body').css('cursor','col-resize');
      }
    }(this));

    anchor.on("mouseout", function(self){
      return function(ev) {
        $('html,body').css('cursor','');
      }
    }(this));

    anchor.oldX = 0;
    anchor.notMoved = true;

    anchor.on("pressmove",function(self) {
        return function(evt) {

          targ = evt.currentTarget;

          delta = self.handleDrag(targ, evt.stageX);

          if(delta != 0) {
            sample = targ.sample;

            sample._length = sample._length + delta;

            sample.graphics.clear();
            sample.graphics.
            beginFill("DeepSkyBlue")
            .drawRect(0,0,
              sample._length,self.notes_height);

            //console.log("sample.x:" + sample.x);

            self.setNote(sample.noteId, sample.x, sample._length);
          }

          self.updateTimeLineEntries();
          self.stage.update();
      }
    }(this));

    anchor.sample = rect;
    rect.noteAnchor = anchor;

    //this.timelineContainer.addChildAt(anchor, this.timelineContainer.getChildIndex(line)+2);
    this.timelineEntriesContainer.addChild(anchor);
    this.updateTimeLineEntries();

    this.stage.update();
  },

  updateSecondsContainer: function() {
    this.secondsContainer.cache(this.secondsContainer.x*-1, this.secondsContainer.y*-1, this.getCanvasWidth(), this.seconds_height);
  },

  updateTimeLine: function() {
    this.timelineContainer.cache(this.timelineContainer.x*-1, this.timelineContainer.y*-1,
       this.getCanvasWidth(), this.getCanvasHeight());
  },

  updateTimeLineEntries: function() {
    this.timelineEntriesContainer.cache(this.timelineEntriesContainer.x*-1, this.timelineEntriesContainer.y*-1,
       this.getCanvasWidth(), this.getCanvasHeight());
  },

  updateKeysContainer: function() {
    this.keysContainer.cache(this.keysContainer.x*-1, this.keysContainer.y*-1, this.keys_width, this.getCanvasHeight());
  },

  handleMoveHorizontalScroll: function(percX) {

      stageX = ((this.width_sec_base * this.min_seconds)*percX);

      delta = (stageX - this.oldX);

      console.log(">>>>>>>>>>>>>>>>>>>>>>handleMoveHorizontalScroll stageX: " + stageX + " percX:" + percX)

      this.secondsContainer.x -= this.deltaFactor*delta;
      this.timelineContainer.x -= this.deltaFactor*delta;
      this.timelineEntriesContainer.x -= this.deltaFactor*delta;
      this.needleContainer.x -= this.deltaFactor*delta;

      this.deltaXAcc += delta*this.deltaFactor;
      this.oldX = stageX;

      ////console.log("handleMoveHorizontalScroll:" + this.deltaXAcc);

      this.updateSecondsContainer();
      this.updateTimeLine();
      this.updateTimeLineEntries();

      this.stage.update();
  },

  handleMoveVerticalScroll: function(percY) {

    stageY = ((this.notes_height * this.notesLength)*percY);

    delta = (stageY - this.oldY);

    this.keysContainer.y -= this.deltaFactor*delta;
    this.timelineContainer.y -= this.deltaFactor*delta;
    this.timelineEntriesContainer.y -= this.deltaFactor*delta;

    this.deltaYAcc += delta*this.deltaFactor;
    this.oldY = stageY;

    this.updateKeysContainer();
    this.updateTimeLine();
    this.updateTimeLineEntries();

    this.stage.update();
  },

  loadEntries: function(instrument, view) {
    //id:{id:this.notesId, note: note, duration: duration, start: start}
    this.loadingMode = true;

      view.toggleModeEdition();

      for(nEntryId in instrument.Piano){
        this.loadingNoteId = nEntryId;

        index = this.gridIndexLines[instrument.Piano[nEntryId].note].index;
        line = this.gridIndexLines[instrument.Piano[nEntryId].note].line;

        start = instrument.Piano[nEntryId].start;
        x = this.startToPosition(start);

        note = instrument.Piano[nEntryId].note;

        this.loadingDuration = this.durationToWidth(instrument.Piano[nEntryId].duration);

        this.putNote(note, x, index, line);
      }
    this.loadingMode = false;
    view.toggleModeEdition();
  },

  startToPosition: function(x) {
    return (x*this.width_sec_base)/1000;
  },

  durationToWidth: function(dur) {
    return (dur*this.width_time_base)/1000;
  },

  getCanvasHeight: function() {
    return $("#pianoRollCanvas").height();
  },

  getCanvasWidth: function() {
    return $("#pianoRollCanvas").width();
  },

  createNeedleTimePosition: function() {

          console.log("createNeedleTimePosition");

          this.needleContainer = new createjs.Container();
          bounds = this.stage.getBounds();

          this.timeNeedle = new createjs.Shape();

          this.timeNeedle.graphics
          .beginFill("lightgreen")
          .beginStroke("#cbc8c8")
          .drawRect(0, 0, 2, this.getCanvasHeight());

          this.timeNeedle.x = this.group_width;

          this.needleContainer.addChild(this.timeNeedle);

          this.stage.addChild(this.needleContainer);

          console.log("createNeedleTimePosition fim");
  },

  deltaNeedle:0,
  timesNeedleDelta:1,
  oldXNeedle:0,

  resetTimeNeedle: function() {
    this.timeNeedle.x = this.keys_width;

    this.deltaNeedle = 0;
    this.timesNeedleDelta = 1;
    this.oldXNeedle = 0;

    this.handleMoveHorizontalScroll(0);
    this.setDraggerPosition(0);

    console.log("resetTimeNeedle");
    this.log();
  },

  log: function() {//TODO remover
    console.log("deltaNeedle:" + this.deltaNeedle);
    console.log("timesNeedleDelta:" + this.timesNeedleDelta);
    console.log("oldXNeedle:" + this.oldXNeedle);
    console.log("this.timeNeedle.x:" + this.timeNeedle.x);
  },

  setDraggerPosition: function(pageX) {

    wid = $("#pianoRollHorizontalScroolBar").width();

    sliderWidth = (this.width_sec_base * this.min_seconds) + this.keys_width; //this.getCanvasWidth();
    value = pageX / sliderWidth;

    max = $("#pianoRollHorizontalBarDragger").attr("max");
    val = $("#pianoRollHorizontalBarDragger").val();

    val = (parseFloat(value) * wid);

    if(val > max)
      val = max

    if(val < 0)
        val = 0

    $("#pianoRollHorizontalBarDragger").val(val);
  },

  setTimePosition: function(time) {

    this.oldXNeedle = this.timeNeedle.x;

    if(!this.oldXNeedle) {
      this.resetTimeNeedle();
    }

    var timeDesloc = (time * this.width_sec_base) + this.keys_width;

    this.timeNeedle.x = timeDesloc;

    this.deltaNeedle += (timeDesloc - this.oldXNeedle);

    this.setDraggerPosition(timeDesloc);

    if(this.deltaNeedle >= this.getCanvasWidth()) {

      var deslocX = (this.getCanvasWidth() * this.timesNeedleDelta);
      var draggerPositionFactor = 1;

      this.handleMoveHorizontalScroll(timeDesloc/(this.width_sec_base * this.min_seconds));

      this.deltaNeedle = 0;
      this.timesNeedleDelta++;
    } else {
      this.stage.update();
    }
  },

  handleDrag: function (targ, stageX) {

    newX = stageX + this.deltaXAcc;

    if(targ.notMoved) {
      delta = 0;
      targ.notMoved = false;
    } else {
      delta = newX - targ.oldX;
    }

    targ.x = targ.x + delta;
    targ.oldX = newX;

    return delta;
  }

}

module.exports = PianoRollView;
