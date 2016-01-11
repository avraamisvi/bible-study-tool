var BaseClass = require('base-class-extend');
var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

var MainMenuView = BaseClass.extend({//todo balao de mensagem indicando operacao

  constructor: function MainMenuView() {
    window.fileService = this;
    this.menu = null;
  },

  createMenu: function() {
    window.mainMenuView = this;

        var template = [
      {
        label: 'File',
        submenu: [
          {
            label: 'New Project',
            selector: 'orderFrontStandardAboutPanel:'
          },
          {
            label: 'Open',
            accelerator: 'Ctrl+S',
            click: function() { compositionView.load() }
          },
          {
            type: 'separator'
          },
          {
            label: 'Save',
            accelerator: 'Ctrl+S',
            click: function() { compositionView.save() }
          },
          {
            label: 'Save As...',
            accelerator: 'Ctrl+Shift+S',
            click: function() { compositionView.saveAs(); }
          },
          {
            type: 'separator'
          },
          {
            label: 'Hide Electron',
            accelerator: 'Command+H',
            selector: 'hide:'
          },
          {
            label: 'Hide Others',
            accelerator: 'Command+Shift+H',
            selector: 'hideOtherApplications:'
          },
          {
            label: 'Show All',
            selector: 'unhideAllApplications:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            selector: 'terminate:'
          },
        ]
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'Command+Z',
            selector: 'undo:'
          },
          {
            label: 'Redo',
            accelerator: 'Shift+Command+Z',
            selector: 'redo:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Cut',
            accelerator: 'Command+X',
            selector: 'cut:'
          },
          {
            label: 'Copy',
            accelerator: 'Command+C',
            selector: 'copy:'
          },
          {
            label: 'Paste',
            accelerator: 'Command+V',
            selector: 'paste:'
          },
          {
            label: 'Select All',
            accelerator: 'Command+A',
            selector: 'selectAll:'
          }
        ]
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Reload',
            accelerator: 'Command+R',
            click: function() { remote.getCurrentWindow().reload(); }
          },
          {
            label: 'Toggle DevTools',
            accelerator: 'Alt+Command+I',
            click: function() { remote.getCurrentWindow().toggleDevTools(); }
          },
        ]
      },
      {
        label: 'Window',
        submenu: [
          {
            label: 'Minimize',
            accelerator: 'Command+M',
            selector: 'performMiniaturize:'
          },
          {
            label: 'Close',
            accelerator: 'Command+W',
            selector: 'performClose:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Bring All to Front',
            selector: 'arrangeInFront:'
          }
        ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'About EleCsound',
            selector: 'orderFrontStandardAboutPanel:'
          }
        ]
      }
    ];

    this.menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(this.menu);
  }

});

module.exports = MainMenuView;
