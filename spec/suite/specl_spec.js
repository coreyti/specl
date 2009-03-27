Screw.Unit(function() {
  describe("Specl", function() {
    var head, body;

    before(function() {
      // specl = new Specl();
      head = $('head');
      body = $('#test_content');

      body.html("");
      body.append('<link rel="stylesheet" type="text/css" href="public/stylesheets/application.css" />');
    });

    describe(".transform", function() {
      it("exists", function() {
        expect(typeof Specl.transform).to(equal, "function");
      });

      describe("given a selector argument", function() {
        var selector;

        before(function() {
          selector = 'link[type=text/css]';
        });

        it("removes the original element", function() {
          expect(body.find(selector).length).to(equal, 1);

          Specl.transform(selector);
          expect(body.find(selector).length).to(equal, 0);
        });

        // it("defines the filters", function() {
        //   expect(Specl.filters['with-salt']).to(equal, undefined);
        //   
        //   Specl.transform(selector);
        //   expect(Specl.filters['with-salt']).to(equal, 'foo');
        // });

        it("defines the properties", function() {

        });
      });
    });

    describe(".load", function() {
      describe("given 'selector' and 'callback' arguments", function() {
        it("executes the callback, passing the CSS contents loaded from the selector-matching element", function() {
          var selector = 'link[type=text/css]';

          Specl.load(selector, function(element, css) {
            // NOTE:
            //   this doesn't *really* work... the underlying AJAX
            //   is asynchronous, so any failure comes after the suite
            //   has finished.  It does show up as a JS error, but it
            //   would be better to fake the AJAX call.
            
            // puts(css);
            expect(element.href).to(match, 'application.css');
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
});
