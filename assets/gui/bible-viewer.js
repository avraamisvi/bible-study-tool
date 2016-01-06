var BaseClass = require('base-class-extend');
var fs = require('fs');

var BibleViewer = BaseClass.extend({

  source: null,
  element: null,

  constructor: function(source) {
    this.source = source;
    this.element = $("#main");

    this.openChapter(Object.keys(this.source.books)[0], "1");
  },

  openChapter: function(book, chap) {

    chapter_file = workspace.DEFAULT_MODULE_DIR + this.source.id + "/" + book + "/" + this.source.books[book].chapters[chap].file;
    var chapter_content = JSON.parse(fs.readFileSync(chapter_file, 'utf8'));

    this.element.html(nunjucks.render(__dirname + '/templates/bible-tmpl.html', {
      chapter: chapter_content,
      source: this.source,
      parseVerse: this.parseVerse
    }));

  },

  parseVerse: function(text) {
      try {
        items = text.match(/[a-z]*#[G|H]\d*/gi);
        ///
        if(items == null || items.length == 0)
          return text;

        for(i = 0; i < items.length; i++) {
          item = items[i];
          item = item.split("#");

          result = '<span onclick="workspace.showDictionaryEntry(\''+item[1]+'\', \''+item[0]+'\');" class="word-dictionary-ref" data-dictionary-number="' + item[1] + '">' + item[0] + '</span>';

          text = text.replace(items[i], result);
        }

        items = text.match(/\/[a-z|0-9]*\//gi);

        if(items == null || items.length == 0)
          return text;

        for(i = 0; i < items.length; i++) {
          item = items[i];
          result = '<span class="word-not-in-original" >' + item.substring(1,item.length-1) + '</span>';
          text = text.replace(items[i], result);
        }

      } catch(ex) {
        console.log(ex);
      }

    return text;
  }
});

module.exports = BibleViewer;
