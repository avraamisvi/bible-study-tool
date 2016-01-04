var BaseClass = require('base-class-extend');

var BibleViewer = BaseClass.extend({

  source: null,
  element: null,

  constructor: function(source) {
    this.source = source;
    this.element = $("#main");

    this.openChapter("genesis", "1");
  },

  openChapter: function(book, chap) {

    this.element.html(nunjucks.render(__dirname + '/templates/bible-tmpl.html', {
      chapter: this.source.books[book].chapters[chap],
      parseVerse: this.parseVerse
    }));

  },

  parseVerse: function(text) {
      try {
        items = text.match(/@[a-z]*#[G|H]\d*/i);

        if(items == null || items.length == 0)
          return text;

        for(i = 0; i < items.length; i++) {
          item = items[i];
          item = item.split("#");

          result = '<span onclick="workspace.openDictionary(\''+item[1]+'\');" class="word-dictionary-ref" data-dictionary-number="' + item[1] + '">' + item[0].substring(1) + '</span>';

          text = text.replace(items[i], result);
        }
      } catch(ex) {
        console.log(ex);
      }

    return text;
  }
});

module.exports = BibleViewer;
