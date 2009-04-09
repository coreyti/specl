Screw.Unit(function() {
  describe("Specl.IE7", function() {
    var head, body, main;

    before(function() {
      head = $('head');
      body = $('body');
      main = $('div#test_dom');
    });

    describe(">", function() {
      after(function() {
        body.attr('class', '');
      });
      
      it("does something", pending, function() {
        // body.attr('class', '>');
        
        expect(main.find('div.inner').html()).to(equal, 'content');
        expect(main.find('div.inner').css('color')).to(match, /(rgb\(255, 0, 0\)|red)/);
      });
    });
  });
});
