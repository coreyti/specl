Screw.Unit(function(c) { with(c) {
  var head, body, main;

  before(function() {
    head = $('head');
    body = $('body');
    main = $('div#test_content');
  });
  
  after(function() {
    unload_javascripts();
    unload_stylesheets();
    unload_content();

    body.removeAttr('spec');
    main.removeAttr('attr');
  });
  
  describe("specl.ie7 extension", function() {
    before(function() {
      // load_content(function(builder) {
      //   with(builder) {
      //     div("some content");
      //   }
      // });

      main.html('<div class="inner">some content</div>');
      load_javascript('../../../lib/specl.js');
      load_javascript('../../../lib/extensions/specl.ie7.js');

      // Specl.TEST_MODE = true;
    });

    describe("bootstrapping (not IE7 stuff)", function() {
      before(function() {
        body.attr('spec', 'bootstrapping');
        // Specl.transform('link#test_stylesheet');
      });
    
      it("applies styles", function() {
        var element = main.find('div.inner');
    
        expect(element.html()      ).to(equal, 'some content');
        expect(element.css('color')).to(match, /(rgb\(0, 0, 255\)|blue)/);
      });
    });

    describe("element[attr]", function() {
      before(function() {
        body.attr('spec', 'element[attr]');
        main.attr('attr', '');
        // Specl.transform('link#test_stylesheet');
      });
    
      it("applies styles", function() {
        var element = main.find('div.inner');
    
        expect(element.html()      ).to(equal, 'some content');
        expect(element.css('color')).to(match, /(rgb\(0, 128, 0\)|green)/);
      });
    });
  });
}});