Screw.Unit(function(c) { with(c) {
  describe("Specl", function() {
    var head, body, main, selector;

    before(function() {
      // specl = new Specl();
      Specl.TEST_MODE = true;

      head = $('head');
      body = $('body');
      main = $('div#test_content');

      selector = 'link#test_external';
      head.append('<link id="test_external" rel="stylesheet" type="text/css" href="suite.css" />');
    });

    after(function() {
      delete($.expr[':']['fresnel']);
      delete(Specl.property_extensions['-local-fraunhofer']);

      $('link#test_external').remove();
    });

    // it("determine a better way to provide the test styles, without `div#test_css`", pending);

    describe(".transform", function() {
      before(function() {
        main.html('<div class="inner">some content</div>');
      });

      it("exists", function() {
        expect(typeof Specl.transform).to(equal, "function");
      });

      describe("given a selector argument", function() {
        describe("the original element", function() {
          it("is removed", function() {
            expect(head.find(selector).length).to(equal, 1);

            Specl.transform(selector);
            expect(head.find(selector).length).to(equal, 0);
          });
        });

        describe("a filter definition", function() {
          it("is created", function() {
            expect(typeof $.expr[':']['fresnel']).to(equal, 'undefined');

            Specl.transform(selector);
            expect(typeof $.expr[':']['fresnel']).to(equal, 'function');
          });

          // it("works", pending, function() {
          //   expect(body.find('div:inline')).to(be_empty, 'length');
          //
          //   Specl.transform(selector);
          //   expect(body.find('div:inline')).to_not(be_empty, 'length');
          // });
        });

        describe("a property definition", function() {
          it("is created", function() {
            expect(typeof Specl.property_extensions['-local-fraunhofer']).to(equal, 'undefined');

            Specl.transform(selector);
            expect(typeof Specl.property_extensions['-local-fraunhofer']).to(equal, 'function');
          });
        });

        describe("standard css", function() {
          before(function() {
            main.addClass('style_01');
          });

          after(function() {
            main.removeClass('style_01');
          });

          it("still applies", function() {
            var element = main.find('div.inner');
            expect(element.css('color')).to(match, /(rgb\(0, 128, 0\)|green)/);

            Specl.transform(selector);
            expect(element.css('color')).to(match, /(rgb\(0, 128, 0\)|green)/);
          });
        });

        describe("broken style-switching due to setting element[style]", function() {
          it("fails", function() {
            var element = main.find('div.inner');

            main.attr('class', 'style_01');
            Specl.transform(selector);
            expect(element.css('color')).to(match, /(rgb\(0, 128, 0\)|green)/);

            main.attr('class', 'style_02');
            Specl.transform(selector);
            expect(element.css('color')).to(match, /(rgb\(0, 0, 255\)|blue)/);
          });
        });
      });
    });

    describe(".load", function() {
      describe("given 'selector' and 'callback' arguments", function() {
        it("executes the callback, passing the CSS contents loaded from the selector-matching element", function() {
          Specl.load(selector, function(element, css) {
            expect(element.href).to(match, 'suite.css');
            expect(css.specify['-spec-filter'][0]).to(equal, "'fresnel' Specl.filter");
          });
        });
      });
    });

    describe(".filter", function() {
      it("exists", function() {
        expect(typeof Specl.filter).to(equal, "function");
      });
    });
  });
}});
