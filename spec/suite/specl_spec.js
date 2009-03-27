Screw.Unit(function() {
  describe("Specl", function() {
    var head, body;

    before(function() {
      $.get = function(url, callback) {
        var stylesheet = "" +
          "specify {                                            \n" +
            "-spec-filter   : 'fresnel'          Near.field;    \n" +
            "-spec-filter   : 'innermost'        Specl.filter;  \n" +
            "-spec-property : '-local-important' Specl.property;\n" +
            "-spec-property : '-local-iconic'    Specl.property;\n" +
          "}                                                    \n";

        callback(stylesheet);
      }
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

        it("defines the filters", function() {
          expect(Specl.filter_map['fresnel']).to(equal, undefined);
          
          Specl.transform(selector);
          expect(typeof $.expr[':']['fresnel']).to(equal, 'function');
        });

        it("defines the properties", function() {

        });
      });
    });

    describe(".load", function() {
      describe("given 'selector' and 'callback' arguments", function() {
        it("executes the callback, passing the CSS contents loaded from the selector-matching element", function() {
          var selector = 'link[type=text/css]';

          Specl.load(selector, function(element, css) {
            expect(element.href).to(match, 'application.css');
            expect(css.specify['-spec-filter'][0]).to(equal, "'fresnel' Near.field");
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
