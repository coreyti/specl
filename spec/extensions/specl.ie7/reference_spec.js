Screw.Unit(function(c) { with(c) {
  describe("specl.ie7 reference (ie7-js)", function() {
    var head, body, main, template, stylesheet, item_count, items;

    before(function() {
      item_count = 3;
      head = $('head');
      body = $('body');
      main = $('div#test_content');

      template   = Disco.build(Disco.Namespace("Specl::IE7").Template);
      stylesheet = Disco.build(Disco.Namespace("Specl::IE7").Stylesheet);

      // NOTE: we need one "dummy" item for sibling tests
      template.markup('<p class="item_0 ignore"></p>');

      var index = 0;
      while((index ++) < item_count) {
        template.markup('<p class="item_' + index + '">item ' + index + '</p>');

        stylesheet.define('body.child div#template > p.item_' + index, {
          color      : 'blue'
        });

        stylesheet.define('body.adjacent_sibling div#template p.item_' + (index - 1) + ' + p', {
          color      : 'red'
        });
        
        stylesheet.define('body.attr_exists div#template[attr] p.item_' + (index - 1) + ' + p', {
          color      : 'green'
        });

        // NOTE: one idea for timing is to use background images and
        // parse the request logs. however, IE seems to choke.  it's 
        // also probably not a great test since there the number of
        // concurrent requests allowed would likely create a bottleneck.
        // ...
        // background : 'url("/timing.png?selector=adjacent + sibling&item_count=' + index + '") no-repeat'
      }

      head.append(stylesheet);
      main.append(template);
      items = template.find('p:not(.ignore)');

      stylesheet.render();
    });

    after(function() {
      template.reset();
      stylesheet.reset();
      
      meta({});
    });

    describe("parent > child", function() {
      before(function() {
        meta({ body: 'child' });
        load_ie7();
      });

      it("applies styles", function() {
        expect(items.css('color')).to(match, /(rgb\(0, 0, 255\)|blue)/);
      });
    });

    describe("adjacent + sibling", function() {
      before(function() {
        meta({ body: 'adjacent_sibling' });
        load_ie7();
      });

      it("applies styles", function() {
        expect(items.eq(1).css('color')).to(match, /(rgb\(255, 0, 0\)|red)/);
      });
    });

    // describe("general ~ sibling", function() {
    //
    // });
    //
    // describe(".multiple.classes", function() {
    //
    // });
    //
    // describe(":hover", function() {
    //
    // });
    //
    // describe(":first-child", function() {
    //
    // });

    describe("[attr]", function() {
      before(function() {
        meta({ body: 'attr_exists', attr: 'anything' })
        load_ie7();
      });
    
      it("applies styles", function() {
        expect(items.eq(1).css('color')).to(match, /(rgb\(0, 128, 0\)|green)/);
      });
    });

    // describe("[attr='value']", function() {
    //
    // });
    //
    // describe("[attr=~'value']", function() {
    //
    // });
    //
    // describe("[attr|='value']", function() {
    //
    // });
    //
    // describe("[attr^='value']", function() {
    //
    // });
    //
    // describe("[attr$='value']", function() {
    //
    // });
    //
    // describe("[attr*='value']", function() {
    //
    // });

    meta = function(options) {
      body.attr    ('class', (options.body || null));
      template.attr('attr',  (options.attr || null))
    };

    load_ie7 = function() {
      if($.browser.msie) {
        if(typeof IE7 == 'undefined') {
          load_javascript('../../../lib/vendor/ie7.js');
        }
        else {
          IE7.recalc();
        }
      }
    };
  });
}});