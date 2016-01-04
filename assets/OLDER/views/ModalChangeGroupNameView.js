//Modal for group name edition
var BaseClass = require('base-class-extend');

var ModalChangeGroupNameView = BaseClass.extend({

  constructor: function ModalChangeGroupNameView() {
    window.modalChangeGroupNameView = this;
  },

  show: function(group) {

    if($("#modal-change-group-name").length) {
      return;
    }

    this.group = group;

    $(document.body).append(nunjucks.render(__dirname + '/templates/modalChangeGroupNameTmpl.html', {name: group.Name}));
  },

  cancel: function() {
    $("#modal-change-group-name").remove();
  },

  save: function() {
    this.group.Name = $("#modal-change-group-name-inputtext").val()
    $("#modal-change-group-name").remove();

    compositionView.updateGroupLabel(this.group);
  }

});

module.exports = ModalChangeGroupNameView;
