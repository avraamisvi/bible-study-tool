var BaseClass = require('base-class-extend');

var InstrumentsLibraryGroupPanel = BaseClass.extend({

  header: null,
  body: null,
  element: null,
  group: null,
  owner: null,
  id: null,

  constructor: function(panel, group) {
    this.owner = panel;
    this.group = group;
    this.create();
  },

  create: function() {

    this.id = this.group.id;
    this.owner.element.append(nunjucks.render(__dirname + '/templates/instruments-library-group-tmpl.html', {id: this.id, group: this.group}));

    elementId="#instruments-library-group-panel-" + this.id;
    this.element = $(elementId);
    applyButtonEffect(elementId);//funcao global de efeito de botao TODO mudar para uma classe?

    this.header = $("#instruments-library-group-header-" + this.id);
    this.body = $("#instruments-library-group-body-" + this.id);

    this.header.click(function(self){
      return function(ev) {
        if(self.body.height() > 0) {
          self.body.height(0);
        } else {
          self.body.removeAttr("style");
        }

        self.owner.refreshVerticalBar();
      };
    }(this));

    $("[name=instruments-library-group-item-button-" + this.id + "]").click(function(self){
      return function(ev) {

        selectedInstrument = self.group.instruments[this.attributes["instrumentid"].value];

        window.workspace.instrumentPanel.addInstrument({
          id: this.attributes["instrumentid"].value,
          name: this.attributes["instrumentlabel"].value,
          notes: selectedInstrument.notes
        });
      };
    }(this));
  },

  height: function() {
    return this.element.height();
  },

  width: function() {
    return this.element.width();
  }
});

module.exports = InstrumentsLibraryGroupPanel;
