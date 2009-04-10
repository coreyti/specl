Screw.Unit(function() {
  describe("specl.ie7 reference (ie7-js)", function() {
    var head, body, main;

    before(function() {
      head = $('head');
      body = $('body');
      main = $('div#content');
    });

    describe("[attr]", function() {
      it("applies the styles", function(self) {
        body.attr('mode', '[attr]');
        setup();

        delay(self, function() {
          expect(main.find('div.inner').css('color')).to(match, /(rgb\(0, 128, 0\)|green)/);
          cleanup();
        })
      });
    });

    describe(">", function() {
      it("applies the styles", function(self) {
        body.attr('mode', '>');
        setup();

        delay(self, function() {
          expect(main.find('div.inner').css('color')).to(match, /(rgb\(0, 0, 255\)|blue)/);
          cleanup();
        });
      });
    });

    delay = function(example, fn) {
      using(example).wait(1).and_then(function() {
        fn();
      });
    };

    setup = function() {
      load_javascript('../../../lib/vendor/ie7.js', $.browser.msie);
    };

    cleanup = function() {
      unload_javascripts();
      body.removeAttr('mode');
    };

    // describe("[attr]", function() {
    //   before(function() {
    //     body.attr('attr', 'attr');
    //     if(document.recalc) {
    //       document.recalc();
    //     }
    //   });
    //
    //   after(function() {
    //     // body.removeAttr('attr');
    //   });
    //
    //   it("styles", function() {
    //     expect($('div#content').find('div.inner').css('color')).to(match, /(rgb\(255, 0, 0\)|red)/);
    //   });
    // });

    // describe("[attr]", function() {
    //   before(function() {
    //     body.css('background-image', 'url(specl.ie7-start.png?' + new Date().getTime() + ')');
    //     body.attr('attr', 'attr');
    //     load_javascript('../../../lib/vendor/ie7.js');
    //   });
    //
    //   after(function() {
    //     body.removeAttr('attr');
    //     body.css('background-image', 'specl.ie7-stop.png');
    //     unload_javascripts();
    //   });
    //
    //   it("styles", function() {
    //     expect(body.find('div.inner').css('color')).to(match, /(rgb\(255, 0, 0\)|red)/);
    //   });
    // });

    // describe(">", function() {
    //   it("does something", function() {
    //     // body.attr('class', '>');
    //
    //     expect(main.find('div.inner').html()).to(equal, 'content');
    //     expect(main.find('div.inner').css('color')).to(match, /(rgb\(255, 0, 0\)|red)/);
    //   });
    // });
  });
});
