(function(specl){
  with(specl) {
    filter('innermost', function() {
      return $(this.element).find('*').size() === 0;
    });
    
    property('-local-iconic', function() {
      $(this.element).css({
        background: "url(" + this.args[0] + "/" + countries[$(this.element).text()].toLowerCase() + ".png) no-repeat"
      });
    });
    
    property('-local-important', function(){
      $(this.element).css({ border: this.args[0] + ' solid ' + this.args[1] })
    });
  }
})(Specl);

$().ready(function() {
  Specl.transform('link[type=text/css]');
});