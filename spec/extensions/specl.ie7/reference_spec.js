Screw.Unit(function(c) { with(c) {
  var head, body, main;

  before(function() {
    head = $('head');
    body = $('body');
    main = $('div#test_content');

    var load_ie7 = (typeof IE7 == 'undefined' && $.browser.msie);
    load_javascript('../../../lib/vendor/ie7.js',        load_ie7);
    load_javascript('../../../lib/vendor/ie7-recalc.js', load_ie7);
    
    if( ! $.browser.msie) {
      document.recalc = function() {};
    }
  });
  
  after(function() {
    // unload_javascripts();
    // unload_stylesheets();
    // unload_content();

    body.removeAttr('spec');
    main.removeAttr('attr');
  });

  describe("specl.ie7 reference (ie7-js)", function() {
    before(function() {
      main.html('<div class="inner">some content</div>');
    });
    
    describe("element[attr]", function() {
      before(function() {
        body.attr('spec', 'element[attr]');
        main.attr('attr', '');
        document.recalc();
      });
    
      it("applies styles", function() {
        var element = main.find('div.inner');
    
        expect(element.html()      ).to(equal, 'some content');
        expect(element.css('color')).to(match, /(rgb\(0, 128, 0\)|green)/);
      });
    });

    describe(">", function() {
      before(function() {
        body.attr('spec', '>');
        document.recalc();
      });
    
      it("applies styles", function() {
        var element = main.find('div.inner');
    
        expect(element.html()      ).to(equal, 'some content');
        expect(element.css('color')).to(match, /(rgb\(0, 0, 255\)|blue)/);
      });
    });
  });
}});