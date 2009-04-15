Screw.Unit(function(c) { with(c) {
  describe("specl.ie7 reference (ie7-js)", function() {
    var head, body, main, list, items;

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
      main.css({ 'font-size': '0px' });

      var template   = Disco.build(Disco.Namespace("Specl::IE7").Template);
      var stylesheet = Disco.build(Disco.Namespace("Specl::IE7").Stylesheet);
      
      var count = 50;
      while((count --) > 0) {
        template.markup('<li class="item_' + count + '">item ' + count + '</li>');

        stylesheet.define("ul#target[attr] li.item_" + count, {
          color      : 'green',
          background : 'url("../../../example/images/icons/flags/ad.png?' + count + '") no-repeat'
        });
      }

      head.append(stylesheet);
      main.append(template);

      list  = main.find('ul#target');
      items = list.find('li');
    });
    
    after(function() {
      // unload_javascripts();
      // unload_stylesheets();
      // unload_content();

      // body.removeAttr('spec');
      // list.removeAttr('attr');
    });

    describe("element[attr]", function() {
      before(function() {
        // body.attr('spec', 'element[attr]');
        list.attr('attr', '');
        document.recalc();
      });
    
      it("applies styles", function() {
        expect(items.css('color')).to(match, /(rgb\(0, 128, 0\)|green)/);
      });
    });

    // describe(">", function() {
    //   before(function() {
    //     body.attr('spec', '>');
    //     document.recalc();
    //   });
    // 
    //   it("applies styles", function() {
    //     expect(items.css('color')).to(match, /(rgb\(0, 0, 255\)|blue)/);
    //   });
    // });
  });
}});