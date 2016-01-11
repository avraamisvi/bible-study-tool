var BaseClass = require('base-class-extend');
var Group = require("../models/group.js")
var Instrument = require("../models/instrument.js")

/*
  Funcionalidades da view pianoroll
*/
var CompositionView = BaseClass.extend({

  constructor: function() {
    this.mode = -1;
    this.groups = {};
    this.groupsId = 0;
    this.selectedGroupId = 1;

    this.groupsSize = 0;

    this.prevGroupId = -1;

    for(var ii = 0; ii < 3; ii++) {
      this.groupsId++;
      this.groupsSize++;
      this.groups[this.groupsId] = new Group("Group #"+ii, this.groupsId);

    /*  this.groups[this.groupsId].PrevGroupId = this.prevGroupId;

      if(this.prevGroupId > 0)
        this.groups[this.prevGroupId].NextGroupId = this.groupsId;

      this.prevGroupId = this.groupsId;*/
    }

  //  this.registerEventsHandles();

  },

  /*registerEventsHandles: function() {
    document.addEventListener("UpdateTimeNeedleEvent", function(self) {
      return function(ev){
        self.setTimePosition(parseFloat(ev.detail))
      }
    }(this), false)

  },*/

  log: function() {
    Grid.log();
  },

  getGroupsSize: function() {
    return this.groupsSize;
  },

  isEditionMode: function() {
    return this.mode == 1;
  },

  isDeletionMode: function() {
    return this.mode == 0;
  },

  open: function(id) {

    if(window.compositionView) {
      //window.compositionView.close();
      return;
    }

    window.compositionView = this;

    $("#contentComposition").append(nunjucks.render(__dirname + '/templates/compositionTmpl.html'));

    this.creatCanvas();
    this.setScrollBars();

    this.setTimePosition(0.0);
  },

  /*
    Remove instrument from all groups
  */
  removeInstrumentFromAllGroups: function(instrument) {
    for(grp in this.groups) {
      this.groups[grp].removeInstrument(instrument);
    }
  },

  /**
    put or removes an instrument from a selected group
  **/
  toggleGroupInstrument: function(instrumentId) {
    if(this.selectedGroupId) {
      if(this.groups[this.selectedGroupId].toggleInstrument(window.patternsView.Instruments[instrumentId]) > 0) {
        window.patternsView.showInstrumentOnGroup([instrumentId]);
      } else {
        window.patternsView.removeInstrumentOnGroup([instrumentId]);
      }
    }
  },

  creatCanvas:function() {

    w = $("#compositionContent").width()
    h = $("#compositionContent").height()

    $("#compositionCanvas").prop("width", w-15);
    $("#compositionCanvas").prop("height", h);

    Grid.clear();
    Grid.create(this.groups, this);
  },

  toggleModeEdition: function() {

    this.removeModeSelection();

    if(this.mode == 1) {
      this.mode = -1;
    } else {
      this.mode = 1;
      $("#compositionButtonWrite").addClass("composition-toolbar-button-selected");
    }
  },

  toggleModeDeletion: function() {
    this.removeModeSelection();

    if(this.mode == 0) {
      this.mode = -1;
    } else {
      this.mode = 0;
      $("#compositionButtonDelete").addClass("composition-toolbar-button-selected");
    }
  },

  /*
    remove the class from the current selected button.
  */
  removeModeSelection: function() {
    var remove = null;

    if(this.mode == 1) {
      remove = "#compositionButtonWrite";
    } else if(this.mode == 0) {
      remove = "#compositionButtonDelete";
    }

    if(remove) {
      $(remove).removeClass("composition-toolbar-button-selected");
    }
  },

  createGroup: function() {

    this.mode = 1;//edition TODO remover essa necessidade

    this.groupsId++;
    this.groups[this.groupsId] = new Group("Group #"+this.groupsId, this.groupsId);

    Grid.createLine(this.groups[this.groupsId]);
    this.groupsSize++;

    this.mode = -1;//no edition
  },

  removeGroup: function() {//TODO
    if(this.groups[this.selectedGroupId]) {

      //Grid.removeLine(this.groups[this.selectedGroupId]);//TODO criar metodo para remover um por um

      delete this.groups[this.selectedGroupId];
      this.groupsSize--;

      if(Object.keys(this.groups).length > 0) {
          this.selectedGroupId = Object.keys(this.groups)[0];
      } else {
        this.selectedGroupId = -1;
      }

      this.refreshGroups();
    }
  },

  editGroupName: function(groupId) {
    if(window.modalChangeGroupNameView)
      window.modalChangeGroupNameView.show(this.groups[groupId]);
  },

  updateGroupLabel: function(group) {
    Grid.updateGroupLabel(group);
  },

  selectGroupInstruments: function(groupId) {
    this.selectedGroupId = groupId;
    window.patternsView.showInstrumentOnSelectedGroup(this.groups[this.selectedGroupId])
  },

  setScrollBars: function() {
    wid = $("#compositionHorizontalScroolBar").width();
    $("#compositionHorizontalBarDragger").attr("max", wid);
    $("#compositionHorizontalBarDragger").attr("min", 0);

    hei = $("#compositionVerticalScroolBar").height();
    $("#compositionVerticalBarDragger").attr("max", hei);
    $("#compositionVerticalBarDragger").attr("min", 0);
    $("#compositionVerticalBarDragger").val(hei);
  },

  horizontalBarChange: function() {
    wid = $("#compositionHorizontalScroolBar").width();
    val = $("#compositionHorizontalBarDragger").val();

    console.log("val:" + val + " wid:" + wid);

    Grid.handleMoveHorizontalScroll(val/wid);
  },

  verticalBarChange: function() {

    max = $("#compositionVerticalBarDragger").attr("max");
    val = $("#compositionVerticalBarDragger").val();

    Grid.handleMoveVerticalScroll((max-val)/max);
  },

  horizontalBarWheel: function(event) {
    console.log(event)
    max = $("#compositionHorizontalBarDragger").attr("max");
    val = $("#compositionHorizontalBarDragger").val();

    val = parseFloat(val) + parseFloat(event.wheelDelta>0?2:-2);

    if(val > max)
      val = max

    if(val < 0)
        val = 0

    $("#compositionHorizontalBarDragger").val(val);

    this.horizontalBarChange();
  },

  verticalBarWheel: function(event) {
    console.log(event)
    max = $("#compositionVerticalBarDragger").attr("max");
    val = $("#compositionVerticalBarDragger").val();

    val = parseFloat(val) + parseFloat(event.wheelDelta>0?2:-2);

    if(val > max)
      val = max

    if(val < 0)
        val = 0

    $("#compositionVerticalBarDragger").val(val);

    this.verticalBarChange();
  },

  setTimePosition: function(time) {

    min = Math.floor(time);
    sec = Math.floor((time - min)*60);

    $("#time-display").html("" + min + ":" + sec);

    Grid.setTimePosition(time);
  },

  play: function() {
    console.log("play?")

    Grid.resetTimeNeedle()

    if(pianoRollView)
      pianoRollView.resetTimeNeedle();

    playerService.play(this.generateCompostion());
    timeLineView.startUpdater();
  },

  stop: function() {
    console.log("stop?")

    playerService.stop();
    timeLineView.stopUpdater();
  },

  save: function() {
    console.log("save?")

    fileService.saveComposition(this.generateCompostionToSave());
  },

  saveAs: function() {
    console.log("saveAs")

    fileService.saveAsComposition(this.generateCompostionToSave());
  },

  load: function() {
    fileService.openLoadDialog(function(self){
      return function(composition) {
        console.log(composition)
        self.loadCompostion(composition)
      }
    }(this))
  },

  //Loads a composition
  loadCompostion: function(composition) {//TODO move this to a "Composition parser class"
    this.groupsId = composition.groupsId;
    this.groupsSize = composition.groupsSize;

    patternsView.loadFromFile(composition);

    messageView.showInfo("Loading groups...");

    for(gp in composition.groups) {
      messageView.showInfo("Adding Group " + composition.groups[gp].name);
      this.createGroupFromFile(composition.groups[gp]);
    }

    this.refreshGroups();
  },

  refreshGroups: function() {

    try {
      this.creatCanvas();

      var index = 0;
      for(gp in this.groups) {

        for(entry in this.groups[gp].Entries) {
          Grid.putGroupEntry(this.groups[gp], this.groups[gp].Entries[entry], index);
        }

        index++;
      }
    } catch(ex) {
      console.log(ex);
    }
  },

  createGroupFromFile: function(grp) {
    gp = new Group("", 0);
    gp.load(grp);
    this.groups[grp.id] = gp;
  },

  //Creates a composition
  generateCompostionToSave: function() {//TODO move this to a "Composition parser class"
    var groupsLocal = this.groups;
    return {
              groupsId: this.groupsId,
              groupsSize: this.groupsSize,
              instrumentsId: window.patternsView.InstrumentsId,
              instruments: window.patternsView.Instruments,
              groups: groupsLocal
          };
  },

  //Creates a composition
  generateCompostion: function() {//TODO move this to a "Composition parser class"
    var groupsLocal = this.groups;
    return {
            orchestra:{
              header:"",
              instruments: window.patternsView.Instruments,
            },//end orchestra

            score:{
              groups: groupsLocal
            }//end score
          };
  }

});

var Grid = {

  stage: null,
  secondsContainer: null,
  groupsContainer: null,
  timelineContainer: null,
  needleContainer: null, //container for the needle that indicates the time position
  timeNeedle: null,
  entry_width: 95,
  seconds_width: 100,
  seconds_height: 15,
  group_height: 30,
  group_width: 70,
  min_seconds: 600,
  compositionView: null,
  groupSelection: null,
  oldX: 0,
  oldY: 0,
  deltaXAcc:0,//keeps the real delta of X ( including the deltaFactor)
  deltaYAcc: 0,
  deltaFactor: 1,
  anchor_width: 5,
  self: null,
  groupLabelSelected: null,

  clear: function() {
    this.secondsContainer= null;
    this.groupsContainer= null;
    this.timelineContainer= null;
    this.entry_width= 95;
    this.seconds_width= 100;
    this.seconds_height= 15;
    this.group_height= 30;
    this.group_width= 70;
    this.min_seconds= 600;
    this.compositionView= null;
    this.groupSelection= null;
    this.oldX= 0;
    this.oldY= 0;
    this.deltaXAcc=0;
    this.deltaYAcc= 0;
    this.deltaFactor= 1;
    this.anchor_width= 5;
    this.self= null;
    this.groupLabelSelected = null;

    if(this.stage)
      this.stage.removeAllChildren();
  },

  /*
    Create a new line group
  */
  createLine:function(group) {

      var groupId = group.Id;

      var rect = new createjs.Shape();
      rect.graphics.beginFill("#263c4a")
      .beginStroke("#1a262d")
      .drawRect(0, 0, this.seconds_width*this.min_seconds, this.group_height);

      rect.x = this.group_width;
      rect.y = (this.compositionView.getGroupsSize()*this.group_height)+this.seconds_height;

      rect.name = "track_line_" + groupId;

      this.timelineContainer.addChild(rect);

      rect.group = group;
      rect.timeline = true;

      rect.on("click", function(self) {
        return function(ev) {
          self.putGroup(ev);
        }
      }(this));


    this.createGroupLabel(group);
    this.stage.update();
  },

  /*
    Create a new label, used with createLine
  */
  createGroupLabel: function(groupEnt) {

        var rect = new createjs.Shape();//DeepSkyBlue
        rect.graphics
        .beginFill("gray")
        .beginStroke("#cbc8c8")
        .drawRect(0, 0, this.group_width, this.group_height);

        var label = new createjs.Text(groupEnt.Name, "bold 9px Arial", "black");
        label.name = "group_label_" + groupEnt.Id;
        label.textAlign = "center";
        label.textBaseline = "middle";
        label.x = 30;
        label.y = this.group_height/2;

        var group = new createjs.Container();
        group.name = "group_label_box_" + group.Id;
        group.x = 0;
        group.y = (this.compositionView.getGroupsSize()*this.group_height)+this.seconds_height;
        group.groupId = groupEnt.Id;
        group.addChild(rect, label);

        group.on("click", function(self, shap) {
          return function(ev) {

            self.selectedGroup = this;

            compositionView.selectGroupInstruments(groupEnt.Id);

            self.setSelectionGroupLabel(shap);

            //self.groupSelection.y = ev.currentTarget.y-self.group_height/2
            self.stage.update();
          }
        }(this, rect));

        group.on("dblclick", function(self, shap) {
          return function(ev) {
            compositionView.editGroupName(this.groupId);
          }
        }(this, rect));

        this.groupsContainer.addChild(group);
  },

  /*
    Show if a grouplabel is selected or not
  */
  setSelectionGroupLabel: function(shape) {

    if(this.groupLabelSelected == shape) {
      return;
    } else if(this.groupLabelSelected) {

      this.groupLabelSelected.graphics.clear();
      this.groupLabelSelected.graphics
      .beginFill("gray")
      .beginStroke("#cbc8c8")
      .drawRect(0, 0, this.group_width, this.group_height);
    }

    if(shape) {
      shape.graphics.clear();
      shape.graphics
      .beginFill("lightgreen")
      .beginStroke("#cbc8c8")
      .drawRect(0, 0, this.group_width, this.group_height);
    }


    this.groupLabelSelected = shape;

    this.stage.update();
  },

  updateGroupLabel: function(group) {
    groupBox = this.groupsContainer.getChildByName("group_label_box_" + group.Id);
    label = groupBox.getChildByName("group_label_" + group.Id);
    label.text = group.Name;

    this.updateGroupsContainer();
    this.stage.update();
  },

  /**
    remove one line from the stage
  */
  removeLine: function() {
    //TODO
    this.stage.update();
  },

  /*
    Create all, used to initialize
  */
  create: function(groups, compositionView) {

      console.log("create");

      this.compositionView = compositionView;

      if(!this.stage) {
        this.stage = new createjs.Stage("compositionCanvas");
        this.stage.enableMouseOver();
      }

      this.timelineContainer = new createjs.Container();

      var i = 0;
      for(var groupId in groups) {

        var rect = new createjs.Shape();
        rect.graphics.beginFill("#263c4a")
        .beginStroke("#1a262d")
        .drawRect(0, 0,
          this.seconds_width*this.min_seconds,
          this.group_height);

        rect.x = this.group_width;
        rect.y = (i*this.group_height)+this.seconds_height;

        rect.name = "track_line_" + groupId;

        this.timelineContainer.addChild(rect);

        rect.group = groups[groupId];
        rect.timeline = true;

        rect.on("click", function(self) {
          return function(ev) {
            self.putGroup(ev);
          }
        }(this));

        i++;
    }

    this.stage.addChild(this.timelineContainer);


    this.createGroupsLabel(groups);
    this.createSeconds();
    this.createNeedleTimePosition();
    this.stage.update();

    this.cacheContainers();
  },

  cacheContainers: function() {

    //console.log(this.seconds_width*this.min_seconds);
    //console.log((this.compositionView.getGroupsSize() * this.group_height) + this.seconds_height);

    this.timelineContainer.cache(0,0, this.getCanvasWidth(), this.getCanvasHeight());
    this.secondsContainer.cache(0,0, this.getCanvasWidth(), this.seconds_height);
    this.groupsContainer.cache(0,0,this.group_width, this.getCanvasHeight());
  },

  createSeconds: function() {

      console.log("create seconds");

      this.secondsContainer = new createjs.Container();

      for(var i = 0; i < 600; i++) {

        var rect = new createjs.Shape();
        rect.graphics.beginFill("#03131c")
        .beginStroke("#1a262d")
        .drawRect(0, 0, this.seconds_width, this.seconds_height);

        rect.name = "second_"+i;
        rect.second = i;

        rect.on("click", function(self) {
          return function(ev) {
          }
        }(this));

        var label = new createjs.Text(i+1, "bold 9px Arial", "white");
        label.name = "group_sec_label_"+i;
        label.textAlign = "right";
        label.textBaseline = "middle";
        label.x = 95;
        label.y = this.seconds_height/2;

        var second = new createjs.Container();
        second.name = "group_second_" + i;
        second.x = this.seconds_width*i+this.group_width;
        second.y = 0;
        second.addChild(rect, label);

        this.secondsContainer.addChild(second);
    }

    this.stage.addChild(this.secondsContainer);
    //stage.update();
  },

  createGroupsLabel: function(groups) {

      console.log("createGroupsLabel");

      this.groupsContainer = new createjs.Container();

      var i = 0;
      for(var groupId in groups) {

        var rect = new createjs.Shape();//DeepSkyBlue
        rect.graphics
        .beginFill("gray")
        .beginStroke("#cbc8c8")
        .drawRect(0, 0, this.group_width, this.group_height);

        var label = new createjs.Text(groups[groupId].Name, "bold 9px Arial", "black");
        label.name = "group_label_" + groups[groupId].Id;
        label.textAlign = "center";
        label.textBaseline = "middle";
        label.x = 30;
        label.y = this.group_height/2;
        label.maxWidth = this.group_width;

        var group = new createjs.Container();
        group.name = "group_label_box_" + groups[groupId].Id;
        group.x = 0;
        group.y = (i*this.group_height)+this.seconds_height;
        group.groupId = groupId;
        group.addChild(rect, label);

        group.on("click", function(self, shap) {
          return function(ev) {

            self.selectedGroup = this;

            compositionView.selectGroupInstruments(this.groupId);

            console.log(ev.target)
            self.setSelectionGroupLabel(shap);

            self.updateGroupsContainer();
            self.stage.update();
          }
        }(this, rect));


        group.on("dblclick", function(self, shap) {
          return function(ev) {
            compositionView.editGroupName(this.groupId);
          }
        }(this, rect));


        this.groupsContainer.addChild(group);

        i++;
      }

      this.stage.addChild(this.groupsContainer);
      console.log("createGroupsLabel fim");
  },

  translateWidthToDuration: function(w) {
    return (w*1000)/this.entry_width;
  },

  translatePositionXToSecond: function(x) {
    return (x*1000)/(this.seconds_width);
  },

  setGroup: function(groupEntry, x, width) {
    groupEntry.Duration = this.translateWidthToDuration(width);
    groupEntry.Start = this.translatePositionXToSecond(x-this.group_width);
  },

  /*
    puts a new note into timeline.
  */
  putGroup: function(event) {

    var group = event.target.group;//, x, index, line
    line = event.target;
    x = event.stageX;
    y = event.stageY;

    x = x + this.deltaXAcc;
    console.log("putGroup:" + x);
    console.log("putGroup:" + y);
    console.log(line);

    groupEntry = group.addEntry(this.translatePositionXToSecond(x));

    if(!this.compositionView.isEditionMode())
      return;

    var rect = new createjs.Shape();
    rect.graphics
    .beginFill("#0055d4")
    .beginStroke("#003b92")
    .drawRect(0, 0,
    this.entry_width, this.group_height);

    rect.x = x;
    rect.y = line.y;

    rect.group = group;
    rect.groupEntry = groupEntry;
    rect._length = this.entry_width;
    rect.timelineX = x;
    rect.notMoved = true;

    rect.on("click", function(self){
      return function(ev) {
        targ = ev.target;

        if(self.compositionView.isDeletionMode()) {
          self.timelineContainer.removeChild(targ);
          self.timelineContainer.removeChild(targ.noteAnchor);
          targ.group.removeEntry(targ.groupEntry);
          self.updateTimeLine();
          self.stage.update();
        }
      }
    }(this));

    rect.on("pressmove",function(self) {
        return function(evt) {

          targ = evt.currentTarget;

          delta = self.handleDrag(targ, evt.stageX);
          targ.noteAnchor.x = targ.noteAnchor.x + delta;
          targ.noteAnchor.notMoved = true;

          self.setGroup(targ.groupEntry, targ.x, targ._length);

          if(targ.x - targ._length/2 > 70) {

          }

          self.updateTimeLine();
          self.stage.update();
      }
    }(this));

    this.timelineContainer.addChildAt(rect, this.timelineContainer.getChildIndex(line)+1);

  //===================Anchor==============================

    var anchor = new createjs.Shape();
    anchor.graphics.beginFill("#003b92")//index*this.notes_height+this.seconds_height
    .drawRect(0, 0, this.anchor_width, this.group_height);

    anchor.x = x+this.entry_width;
    anchor.y = line.y;

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
            sample.graphics
            .beginFill("#0055d4")
            .beginStroke("#003b92")
            .drawRect(0, 0, sample._length, self.group_height);

            self.setGroup(sample.groupEntry, sample.x, sample._length);

            self.updateTimeLine();
            self.stage.update();
          }
      }
    }(this));

    anchor.sample = rect;
    rect.noteAnchor = anchor;

    this.timelineContainer.addChildAt(anchor, this.timelineContainer.getChildIndex(line)+2);

    this.timelineContainer.updateCache();
    this.stage.update();
  },

  translateStartToPosition: function(x) {
    return (x*this.seconds_width)/1000;
  },

  translateDurationToWidth: function(dur) {
    return (dur*this.entry_width)/1000;
  },

  putGroupEntry: function(group, groupEntry, groupIndex) {//TODO reduzir codigo identico

    line = this.timelineContainer.getChildByName("track_line_" + group.Id);
    group_entry_width = this.translateDurationToWidth(groupEntry.Duration);
    x = this.translateStartToPosition(groupEntry.Start) + this.group_width;
    y = groupIndex * this.group_height;//????


    console.log("putGroupEntry:" + x);
    console.log("putGroupEntry:" + y);
    console.log("group_entry_width:" + group_entry_width);
    console.log(line);
    console.log(groupEntry);

    var rect = new createjs.Shape();
    rect.graphics
    .beginFill("#0055d4")
    .beginStroke("#003b92")
    .drawRect(0, 0, group_entry_width, this.group_height);

    rect.x = x;
    rect.y = line.y;

    rect.group = group;
    rect.groupEntry = groupEntry;
    rect._length = group_entry_width;
    rect.timelineX = x;
    rect.notMoved = true;

    rect.on("click", function(self){
      return function(ev) {
        targ = ev.target;

        if(self.compositionView.isDeletionMode()) {
          self.timelineContainer.removeChild(targ);
          self.timelineContainer.removeChild(targ.noteAnchor);
          targ.group.removeEntry(targ.groupEntry);
          self.stage.update();
        }
      }
    }(this));

    rect.on("pressmove",function(self) {
        return function(evt) {

          targ = evt.currentTarget;
          delta = self.handleDrag(targ, evt.stageX)
          targ.noteAnchor.x = targ.noteAnchor.x + delta + this.deltaXAcc * -1;
          targ.noteAnchor.notMoved = true;

          self.setGroup(targ.groupEntry, targ.x, targ._length);

          self.updateTimeLine();
          self.stage.update();
      }
    }(this));

    this.timelineContainer.addChildAt(rect, this.timelineContainer.getChildIndex(line)+1);

  //===================Anchor==============================

    var anchor = new createjs.Shape();
    anchor.graphics.beginFill("#003b92")//index*this.notes_height+this.seconds_height
    .drawRect(0, 0, this.anchor_width, this.group_height);

    anchor.x = x + group_entry_width;
    anchor.y = line.y;

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
            sample.graphics
            .beginFill("#0055d4")
            .beginStroke("#003b92")
            .drawRect(0, 0, sample._length, self.group_height);

            self.setGroup(sample.groupEntry, sample.x, sample._length);

            self.updateTimeLine();
            self.stage.update();
          }
      }
    }(this));

    anchor.sample = rect;
    rect.noteAnchor = anchor;

    this.timelineContainer.addChildAt(anchor, this.timelineContainer.getChildIndex(line)+2);

    this.timelineContainer.updateCache();
    this.stage.update();
  },

  handleMoveHorizontalScroll: function(percX) {

      stageX = ((this.seconds_width * this.min_seconds)*percX);

      console.log("COMPOSITION>>>>>>>>>>>>>>>>>>>>>>handleMoveHorizontalScroll stageX: " + stageX + " percX:" + percX)

      delta = (stageX - this.oldX);

      this.needleContainer.x -= this.deltaFactor*delta;
      this.secondsContainer.x -= this.deltaFactor*delta;
      this.timelineContainer.x -= this.deltaFactor*delta;

      this.deltaXAcc += delta*this.deltaFactor;
      this.oldX = stageX;

      this.secondsContainer.cache(this.secondsContainer.x*-1, this.secondsContainer.y*-1, this.getCanvasWidth(), this.seconds_height);

      this.timelineContainer.cache(this.timelineContainer.x*-1, this.timelineContainer.y*-1,
         this.getCanvasWidth(), this.getCanvasHeight());

      this.stage.update();
  },

  handleMoveVerticalScroll: function(percY) {

    stageY = ((this.group_height * this.compositionView.getGroupsSize())*percY);

    delta = (stageY - this.oldY);

    this.groupsContainer.y -= this.deltaFactor*delta;
    this.timelineContainer.y -= this.deltaFactor*delta;

    this.deltaYAcc += delta*this.deltaFactor;
    this.oldY = stageY;

    this.groupsContainer.cache(this.groupsContainer.x*-1, this.groupsContainer.y*-1, this.getCanvasWidth(), this.getCanvasHeight());
    //this.timelineContainer.updateCache();
    this.timelineContainer.cache(this.timelineContainer.x*-1, this.timelineContainer.y*-1,
       this.getCanvasWidth(), this.getCanvasHeight());

    this.stage.update();
  },

  updateSecondsContainer: function() {
    this.secondsContainer.cache(this.secondsContainer.x*-1, this.secondsContainer.y*-1, this.getCanvasWidth(), this.seconds_height);
  },

  updateTimeLine: function() {
    this.timelineContainer.cache(this.timelineContainer.x*-1, this.timelineContainer.y*-1,
       this.getCanvasWidth(), this.getCanvasHeight());
  },

  updateGroupsContainer: function() {
    this.groupsContainer.cache(this.groupsContainer.x*-1, this.groupsContainer.y*-1, this.getCanvasWidth(), this.getCanvasHeight());
  },

  getCanvasHeight: function() {
    return $("#compositionCanvas").height();
  },

  getCanvasWidth: function() {
    return $("#compositionCanvas").width();
  },

  createNeedleTimePosition: function() {

          console.log("createNeedleTimePosition");

          this.needleContainer = new createjs.Container();
          bounds = this.stage.getBounds();

          this.timeNeedle = new createjs.Shape();

          this.timeNeedle.graphics
          .beginFill("lightgreen")
          .beginStroke("#cbc8c8")
          .drawRect(0, 0, 2, $("#compositionCanvas").height());

          this.timeNeedle.x = this.group_width;

          this.needleContainer.addChild(this.timeNeedle);

          this.stage.addChild(this.needleContainer);

          console.log("createNeedleTimePosition fim");
  },

  setDraggerPosition: function(pageX) {

      wid = $("#compositionHorizontalScroolBar").width();

      sliderWidth = (this.seconds_width * this.min_seconds) + this.group_width; //this.getCanvasWidth();
      value = pageX / sliderWidth;

      max = $("#compositionHorizontalBarDragger").attr("max");
      val = $("#compositionHorizontalBarDragger").val();

      val = (parseFloat(value) * wid);

      if(val > max)
        val = max

      if(val < 0)
          val = 0

      $("#compositionHorizontalBarDragger").val(val);
  },

  resetTimeNeedle: function() {
    this.timeNeedle.x = this.group_width;

    this.deltaNeedle = 0;
    this.timesNeedleDelta = 1;
    this.oldXNeedle = 0;
    this.initPlay = true;

    this.handleMoveHorizontalScroll(0);
    this.setDraggerPosition(0);

    this.log();
  },

  log: function() {//TODO remover
    console.log("deltaNeedle:" + this.deltaNeedle);
    console.log("timesNeedleDelta:" + this.timesNeedleDelta);
    console.log("oldXNeedle:" + this.oldXNeedle);
    console.log("this.timeNeedle.x:" + this.timeNeedle.x);
  },

  deltaNeedle:0,
  timesNeedleDelta:1,
  oldXNeedle:0,
  initPlay: true,

  setTimePosition: function(time) {

    this.oldXNeedle = this.timeNeedle.x;

    var timeDesloc = (time * this.seconds_width) + this.group_width;

    this.timeNeedle.x = timeDesloc;

    this.deltaNeedle += (timeDesloc - this.oldXNeedle);

    this.setDraggerPosition(timeDesloc);

    if(this.deltaNeedle >= this.getCanvasWidth()) {

      deslocX = (this.getCanvasWidth() * this.timesNeedleDelta);
      draggerPositionFactor = 1;

      this.handleMoveHorizontalScroll(timeDesloc/(this.seconds_width * this.min_seconds));

      this.deltaNeedle = 0;
      this.timesNeedleDelta++;
    } else {
      this.stage.update();
    }
  },

  handleDrag: function(targ, stageX) {

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

module.exports = CompositionView;
