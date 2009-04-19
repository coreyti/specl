Screw.Unit(function(c) { with(c) {
  describe("specl.ie7 reference (ie7-js)", function() {
    var head, body, main, template, stylesheet;

    before(function() {
      var load_ie7 = (typeof IE7 == 'undefined' && $.browser.msie);
      load_javascript('../../../lib/vendor/ie7.js',        load_ie7);
      load_javascript('../../../lib/vendor/ie7-recalc.js', load_ie7);

      if( ! $.browser.msie) {
        document.recalc = function() {};
      }

      head = $('head');
      body = $('body');
      main = $('div#test_content');
      main.css({ 'font-size': '8px' });

      template   = Disco.build(Disco.Namespace("Specl::IE7").Template);
      stylesheet = Disco.build(Disco.Namespace("Specl::IE7").Stylesheet);

      head.append(stylesheet);
      main.append(template);
    });

    after(function() {
      template.reset();
      stylesheet.reset();
    });

    describe("element[attr]", function() {
      var count;
      
      before(function() {
        count = 50;

        var index = 0;
        while((index ++) < count) {
          template.markup('<p class="item_' + index + '">item ' + index + '</p>');

          stylesheet.define('div#template[attr] p.item_' + index, {
            color      : 'green',
            background : 'url("/timing.png?selector=element[attr]&count=' + index + '") no-repeat'
          });
        }

        template.attr('attr', '');
        document.recalc();
      });

      it("applies styles", function() {
        var items = template.find('p');

        expect(items.length).to(equal, count);
        expect(items.css('color')).to(match, /(rgb\(0, 128, 0\)|green)/);
      });
    });

    describe(">", function() {
      var count;

      before(function() {
        count = 50;
        
        var index = 0;
        while((index ++) < count) {
          template.markup('<p class="item_' + index + '">item ' + index + '</p>');

          stylesheet.define('div#template > p.item_' + index, {
            color      : 'blue',
            background : 'url("/timing.png?selector=>&count=' + index + '") no-repeat'
          });
        }

        document.recalc();
      });

      it("applies styles", function() {
        var items = template.find('p');

        expect(items.length).to(equal, count);
        expect(items.css('color')).to(match, /(rgb\(0, 0, 255\)|blue)/);
      });
    });
  });
}});