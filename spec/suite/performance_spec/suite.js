Screw.Unit(function() {
  describe("Specl", function() {
    describe("performance", function() {
      var head, body;

      before(function() {
        head  = $('head');
        body  = $('div#test_dom');
      });
      
      after(function() {
        unload_stylesheet(head);
      });
      
      it("loads stylesheets", function() {
        var href = '/spec/suite/performance_spec/base.css';
        expect(head.find('.test_stylesheet').length).to(equal, 0);

        load_stylesheet(head, href);
        expect(head.find('.test_stylesheet').length).to(equal, 1);
      });
      
      it("unloads stylesheets", function() {
        expect(head.find('.test_stylesheet').length).to(equal, 0);
      });

      load_stylesheet = function(target, href) {
        target.append('<link class="test_stylesheet" rel="stylesheet" type="text/css" href="' + href + '" />');
      };

      unload_stylesheet = function(target, href) {
        var selector = href ? 'link[href=' + href + ']' : 'link.test_stylesheet';
        target.find(selector).remove();
      };
    });
  });
});
