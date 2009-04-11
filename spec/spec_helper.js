load_javascript = function(uri, condition) {
  if(condition == undefined || condition) {
    $('head').append('<script class="test_script" type="text/javascript" src="' + uri + '"></script>');
  }
};

load_stylesheet = function(uri, condition) {
  if(condition == undefined || condition) {
    $('head').append('<link class="test_styles" rel="stylesheet" type="text/css" href="' + uri + '" />');
  }
};

unload_content = function() {
  $('div#test_content > *').remove();
}

unload_javascripts = function() {
  $('head').find('script.test_script').remove();
};

unload_stylesheets = function() {
  $('head').find('link.test_styles').remove();
};

raises_exception = function(fn) {
  try {
    fn();
  }
  catch(e) {
    return true;
  }
  return false;
};

puts = function(message) {
  if(console && console.info) {
    console.info(message);
  }
};
