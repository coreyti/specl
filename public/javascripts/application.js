(function(specl){
  with(specl) {
    filters['innermost'] = function() {
      return $(this.element).find('*').size() === 0;
    };
    
    properties['-local-iconic'] = function() {
      $(this.element).css({
        background: "url(" + this.args[0] + "/" + countries[$(this.element).text()].toLowerCase() + ".png) no-repeat"
      });
    };

    properties['-local-important'] = function() {
      $(this.element).css({ border: this.args[0] + ' solid ' + this.args[1] })
    };
  }
})(Specl);
