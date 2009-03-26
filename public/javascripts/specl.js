$().ready(function() {
  $().specl(function(css) {
    $('link').remove();

    var property_extensions   = {};
    var property_applications = {};

    for(var selector in css) {
      // console.debug('selector:', selector, css[selector]);

      if(selector == 'specify') {
        for(var property in css[selector]) {
          console.debug(property);
          if(property == '-spec-filter') {
            var config = css[selector][property];
            var parsed = /^['"]([^'"]+)['"][\s]+(.*)/.exec(config);
            var select = parsed[1];
            var handle = "return " + parsed[2];

            $.expr[':'][select] = function(context) { return Function(handle).call({ element: context }); };
          }
          // else if(property == '-spec-property') {
          else if(/^-spec-property/.test(property)) {
            var config = css[selector][property];
            var parsed = /^['"]([^'"]+)['"][\s]+(.*)/.exec(config);
            var prop   = parsed[1];
            var lala   = parsed[2];
            
            console.debug('adding', lala);

            property_extensions[prop] = Function(lala);
          }
        }
      }
      else {
        // console.debug(selector);

        for(var property in css[selector]) {
          if(/^-local/.test(property)) {
            if( ! property_applications[property]) {
              property_applications[property] = [];
            }

            // console.debug('  ', property);
            // console.debug('  ', css[selector][property].split(' '));

            property_applications[property].push({ selector: selector, args: css[selector][property].split(' ') });
          }
        }

        $(selector).css(css[selector]);
      }
    }

    console.debug('applications', property_applications);
    console.debug('extensions  ', property_extensions);

    for(var extension in property_applications) {
      // console.debug('applying extension', extension, property_applications[extension]);

      for(var i in property_applications[extension]) {
        var application = property_applications[extension][i];

        $(application.selector).each(function() {
          property_extensions[extension].apply({ element: this, args: application.args });
        });

        // $(application.selector).css({ border: application.args[0] + ' solid ' + application.args[1] });
      }
    }
  });
});


(function($) {
  $.fn.specl = function(callback, parse_attributes) {
    // console.debug('> specl');

    var parse = function(string) {
      $.parse(string, callback);
    }

    this.load_css('link[type=text/css]').each(function() {
      // only get the stylesheet if it's not disabled, it won't trigger cross-site security (doesn't start with anything like http:) and it uses the appropriate media)
      // if (!this.disabled && !/\w+:/.test($(this).attr('href')) && $.parsecss.mediumApplies(this.media)) $.get(this.href, parse);
      if( ! this.disabled && ! /\w+[:]/.test($(this).attr('href'))) {
        $.get(this.href, parse);
      }
    });

    return this;
  };

  $.fn.load_css = function(selector) {
    // console.debug('> load_css');

    var result = this.filter(selector).add(this.find(selector));
    result.prevObject = result.prevObject.prevObject;

    return result;
  };

  $.parse = function(string, callback) {
    // console.debug('> parse');

    var result = {};

    string = munge(string);
    // .replace(/@(([^;`]|`[^b]|`b[^%])*(`b%)?);?/g, function(s, rule) {
    //   // @rules end with ; or a block, with the semicolon not being part of the rule but the closing brace (represented by `b%) is
    //   processAtRule($.trim(rule), callback);
    //   return '';
    // });

    $(string.split('`b%')).each(function() {
      var css = this.split('%b`');
      if(css.length < 2) { return; }

      css[0]         = restore(css[0]);
      result[css[0]] = $.extend(result[css[0]] || {}, parse_declarations(css[1]));
    });

    callback(result);
  };

  function restore(string) {
    // console.debug('> restore');

    if(string === undefined) { return string; }

    while(match = REmunged.exec(string)) {
      string = string.replace(REmunged, munged[match[1]]);
    }
    return $.trim(string);
  }

  function parse_declarations(index) {
    // console.debug('> parse_declarations');

    var string = munged[index].replace(/(?:^\s*[{'"]\s*)|(?:\s*([^\\])[}'"]\s*$)/g, '$1');
        string = munge(string);
    var parsed = {};

    $(string.split(';')).each(function() {
      var declaration = this.split(':');
      if(declaration.length < 2) { return; }

      parsed[restore(declaration[0])] = restore(declaration[1]);
    });

    return parsed;
  }

  var munged           = {};
  var REbraces         = /{[^{}]*}/;
  var REfull           = /\[[^\[\]]*\]|{[^{}]*}|\([^()]*\)|function(\s+\w+)?(\s*%b`\d+`b%){2}/;
  var REatcomment      = /\/\*@((?:[^\*]|\*[^\/])*)\*\//g;
  var REcomment_string = /(?:\/\*(?:[^\*]|\*[^\/])*\*\/)|(\\.|"(?:[^\\\"]|\\.|\\\n)*"|'(?:[^\\\']|\\.|\\\n)*')/g;
  var REmunged         = /%\w`(\d+)`\w%/;
  var uid = 0;

  function munge(str, full){
    str = str
    .replace(REatcomment, '$1')
    .replace(REcomment_string, function (s, string) {
      if (!string) return '';
      var replacement = '%s`' + (++ uid) + '`s%';
      munged[uid] = string.replace(/^\\/,'');
      return replacement;
    });

    var RE = full ? REfull : REbraces;

    while (match = RE.exec(str)){
      replacement = '%b`' + (++ uid) + '`b%';
      munged[uid] = match[0];
      str = str.replace(RE, replacement);
    }

    return str;
  }
})(jQuery);
