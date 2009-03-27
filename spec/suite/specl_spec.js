Screw.Unit(function() {
  describe("Specl", function() {
    var head, body;

    before(function() {
      // specl = new Specl();

      head = $('div#test_css');
      body = $('div#test_dom');
      body.html("");

      $.orig_get = $.get;
      $.get = function(url, callback) {
        callback(head.find('style').text());
      }
    });
    
    after(function() {
      $.get = $.orig_get;
      delete($.expr[':']['fresnel']);
      
      $('link#test_external').remove();
    });

    describe(".transform", function() {
      it("exists", function() {
        expect(typeof Specl.transform).to(equal, "function");
      });

      describe("given a selector argument", function() {
        var selector;

        before(function() {
          selector = 'link[type=text/css]';
          head.append('<link id="test_external" rel="stylesheet" type="text/css" href="public/stylesheets/application.css" />');
        });

        it("removes the original element", function() {
          expect(head.find(selector).length).to(equal, 1);

          Specl.transform(selector);
          expect(head.find(selector).length).to(equal, 0);
        });

        it("defines the filters", function() {
          expect(typeof $.expr[':']['fresnel']).to(equal, 'undefined');
          
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
});
