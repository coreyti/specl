Screw.Unit(function() {
  describe("specl.ie7 extension", function() {
    var head, body, main;

    before(function() {
      head = $('head');
      body = $('body');
      main = $('div#content');

      load_javascript('../../../lib/extensions/specl.ie7.js');
    });

    after(function() {
      unload_javascripts();
    });

    describe("[attr]", function() {
      before(function() {
        body.attr('attr', 'attr');
      });
      
      after(function() {
        body.removeAttr('attr');
      });
    });

    describe(">", function() {
      it("does something", function() {
        // body.attr('class', '>');

        expect(main.find('div.inner').html()).to(equal, 'content');
        expect(main.find('div.inner').css('color')).to(match, /(rgb\(255, 0, 0\)|red)/);
      });
    });
  });
});
