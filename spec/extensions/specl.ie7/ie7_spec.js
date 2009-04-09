Screw.Unit(function() {
  load_script = function(uri) {
    $('head').append('<script class="test_script" type="text/javascript" src="' + uri + '"></script>');
  };
  
  load_styles = function(uri) {
    $('head').append('<link class="test_styles" rel="stylesheet" type="text/css" href="' + uri + '" />');
  };

  load_styles('/spec/suite/performance_spec/base.css');
  load_script('/spec/suite/performance_spec/ie7.js');
  load_script('/spec/suite/performance_spec/suite.js');
});
