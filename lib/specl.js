// $().ready(function(){
//   Specl.transform('link[type=text/css]');
//   Specl.specify(function() {
//     this.filter('innermost', function() {
//       return $(this.element).find('*').size() === 0;
//     });
//   });
//
//   specl = new Specl();
//   specl.transform('link[type=text/css]');
//   specl.transform('style');
//   specl.specify(function() {
//     this.filter('innermost', function() {
//       return $(this.element).find('*').size() === 0;
//     });
//   });
// })

var munged           = {};
var REbraces         = /{[^{}]*}/;
var REfull           = /\[[^\[\]]*\]|{[^{}]*}|\([^()]*\)|function(\s+\w+)?(\s*%b`\d+`b%){2}/;
var REatcomment      = /\/\*@((?:[^\*]|\*[^\/])*)\*\//g;
var REcomment_string = /(?:\/\*(?:[^\*]|\*[^\/])*\*\/)|(\\.|"(?:[^\\\"]|\\.|\\\n)*"|'(?:[^\\\']|\\.|\\\n)*')/g;
var REmunged         = /%\w`(\d+)`\w%/;
var uid = 0;

Specl = function() {};

// TODO
// -----------------------------------------------------------------------------
//
//   * try to remove dependency on jQuery and use Sizzle directly.  Do a search
//     for $ and jQuery.  $.get is probably the toughest.
//

(function(lib) {
  lib.property_extensions = {};
  
  lib.transform = function(selector){
    enter('lib.transform');

    lib.load(selector, function(element, css) {
      // TODO:
      // seems like this would be better, but it's not yet working:
      // $(element).remove();
      
      for(var entry in css) {
        lib.send(entry, css[entry]) || console.debug('non-specl:', entry);
      }
    })

    $(selector).remove();
  };
  
  lib.send = function(command, value) {
    if( ! lib[command]) { return false; }
    eval(lib[command])(value);
    return true;
  };
  
  lib.specify = function(specification) {
    for(var definition in specification) {
      lib.send(definition, specification[definition]);
    }
  };
  
  lib['-spec-filter'] = function(specification) {
    for(var entry in specification) {
      var parts  = /^['"]([^'"]+)['"][\s]+(.*)/.exec(specification[entry]);
      var select = parts[1];
      var handle = parts[2];
      
      if(handle == 'Specl.filter') {
        $.expr[':'][select] = function(context) { return Specl.filter.call({ filter: select, element: context }); };
      }
      // else {
      //   $.expr[':'][select] = function(context) { return Function("return " + handle).call({ element: context }); };
      // }
    }
  };
  
  lib['-spec-property'] = function(specification) {
    for(var entry in specification) {
      var parts  = /^['"]([^'"]+)['"][\s]+(.*)/.exec(specification[entry]);
      var name   = parts[1];
      var handle = parts[2];
      
      if(handle == 'Specl.property') {
        lib.property_extensions[name] = Specl.property;
      }
      // else {
      //   lib.property_extensions[name] = Function(handle);
      // }
    }
  };

  //     for(var selector in css) {
  //       // console.debug('selector:', selector, css[selector]);
  //
  //       else {
  //         // console.debug(selector);
  //
  //         for(var property in css[selector]) {
  //           if(/^-local/.test(property)) {
  //             if( ! property_applications[property]) {
  //               property_applications[property] = [];
  //             }
  //
  //             // console.debug('  ', property);
  //             // console.debug('  ', css[selector][property].split(' '));
  //
  //             property_applications[property].push({ selector: selector, args: css[selector][property].split(' ') });
  //           }
  //         }
  //
  //         $(selector).css(css[selector]);
  //       }
  //     }




  lib.filter = function() {

  };

  lib.property = function() {

  };

  lib.load = function(selector, callback) {
    enter('lib.load');

    $(selector).each(function() {
      var element = this;

      $.get(element.href, function(string) {
        lib.parse(element, string, callback);
      });
    });
  };

  lib.parse = function(element, string, callback) {
    enter('lib.parse');

    var result = {};
    var instance = new Specl();                                       // new Specl(string)

    $(instance.munge(string).split('`b%')).each(function() {
      var css = this.split('%b`');
      if(css.length < 2) { return; }
      
      css[0]         = instance.restore(css[0]);
      result[css[0]] = $.extend(result[css[0]] || {}, instance.parse_declarations(css[1]));
    });

    callback(element, result);
  };
})(Specl);

(function(internal) {
  internal.munge = function(string, full) {
    string = string
      .replace(REatcomment, '$1')
      .replace(REcomment_string, function(s, comment) {
        if( ! comment) { return ''; }

        var replacement = '%s`' + (++ uid) + '`s%';
        munged[uid] = comment.replace(/^\\/, '');
        return replacement;
      });

    var RE = full ? REfull : REbraces;

    while(match = RE.exec(string)) {
      var replacement = '%b`' + (++ uid) + '`b%';
      munged[uid] = match[0];
      string = string.replace(RE, replacement);
    }

    return string;
  };

  internal.restore = function(string) {
    if(string === undefined) { return string; }
    
    while(match = REmunged.exec(string)) {
      string = string.replace(REmunged, munged[match[1]]);
    }
    
    return $.trim(string);
  };
  
  internal.parse_declarations = function(index) {
    var self   = this;
    var string = self.munge(munged[index].replace(/(?:^\s*[{'"]\s*)|(?:\s*([^\\])[}'"]\s*$)/g, '$1'));
    var parsed = {};
    
    $(string.split(';')).each(function() {
      var declaration = this.split(':');
      if(declaration.length < 2) { return; }
      
      var key = self.restore(declaration[0]);
      if( ! parsed[key]) {
        parsed[key] = [];
      }
      
      parsed[key].push(self.restore(declaration[1]).replace(/[\s]+/, ' '));
      // parsed[self.restore(declaration[0])] = self.restore(declaration[1]);
    });
    
    return parsed;
  };
})(Specl.prototype);



enter = function(msg) {
  console.info('> ' + msg);
};






// $().ready(function() {
//   $().specl(function(css) {
//     $('link').remove();
//
//     var property_extensions   = {};
//     var property_applications = {};
//
//     for(var selector in css) {
//       // console.debug('selector:', selector, css[selector]);
//
//       if(selector == 'specify') {
//         for(var property in css[selector]) {
//           // console.debug(property);
//           if(property == '-spec-filter') {
//             (function() {
//               var config = css[selector][property];
//               var parsed = /^['"]([^'"]+)['"][\s]+(.*)/.exec(config);
//               var select = parsed[1];
//               var handle = parsed[2];
//
//               if(handle == 'Specl.filter') {
//                 $.expr[':'][select] = function(context) { return Specl.filter.call({ filter: select, element: context }); };
//               }
//               else {
//                 $.expr[':'][select] = function(context) { return Function("return " + handle).call({ element: context }); };
//               }
//             })();
//           }
//           // else if(property == '-spec-property') {
//           else if(/^-spec-property/.test(property)) {
//             (function() {
//               var config = css[selector][property];
//               var parsed = /^['"]([^'"]+)['"][\s]+(.*)/.exec(config);
//               var prop   = parsed[1];
//               var handle = parsed[2];
//
//               if(handle == 'Specl.property') {
//                 property_extensions[prop] = Specl.property;
//               }
//               else {
//                 property_extensions[prop] = Function(handle);
//               }
//             })();
//           }
//         }
//       }
//       else {
//         // console.debug(selector);
//
//         for(var property in css[selector]) {
//           if(/^-local/.test(property)) {
//             if( ! property_applications[property]) {
//               property_applications[property] = [];
//             }
//
//             // console.debug('  ', property);
//             // console.debug('  ', css[selector][property].split(' '));
//
//             property_applications[property].push({ selector: selector, args: css[selector][property].split(' ') });
//           }
//         }
//
//         $(selector).css(css[selector]);
//       }
//     }
//
//     // console.debug('applications', property_applications);
//     // console.debug('extensions  ', property_extensions);
//
//     for(var extension in property_applications) {
//       // console.debug('applying extension', extension, property_applications[extension]);
//
//       for(var i in property_applications[extension]) {
//         var application = property_applications[extension][i];
//
//         $(application.selector).each(function() {
//           property_extensions[extension].apply({ property: extension, element: this, args: application.args });
//         });
//
//         // $(application.selector).css({ border: application.args[0] + ' solid ' + application.args[1] });
//       }
//     }
//   });
// });
//
// (function($) {
//   $.fn.specl = function(callback, parse_attributes) {
//     // console.debug('> specl');
//
//     var parse = function(string) {
//       $.parse(string, callback);
//     }
//
//     this.load_css('link[type=text/css]').each(function() {
//       // only get the stylesheet if it's not disabled, it won't trigger cross-site security (doesn't start with anything like http:) and it uses the appropriate media)
//       // if (!this.disabled && !/\w+:/.test($(this).attr('href')) && $.parsecss.mediumApplies(this.media)) $.get(this.href, parse);
//       if( ! this.disabled && ! /\w+[:]/.test($(this).attr('href'))) {
//         $.get(this.href, parse);
//       }
//     });
//
//     return this;
//   };
//
//   $.fn.load_css = function(selector) {
//     // console.debug('> load_css');
//
//     var result = this.filter(selector).add(this.find(selector));
//     result.prevObject = result.prevObject.prevObject;
//
//     return result;
//   };
//
//   $.parse = function(string, callback) {
//     // console.debug('> parse');
//
//     var result = {};
//
//     string = munge(string);
//     // .replace(/@(([^;`]|`[^b]|`b[^%])*(`b%)?);?/g, function(s, rule) {
//     //   // @rules end with ; or a block, with the semicolon not being part of the rule but the closing brace (represented by `b%) is
//     //   processAtRule($.trim(rule), callback);
//     //   return '';
//     // });
//
//     $(string.split('`b%')).each(function() {
//       var css = this.split('%b`');
//       if(css.length < 2) { return; }
//
//       css[0]         = restore(css[0]);
//       result[css[0]] = $.extend(result[css[0]] || {}, parse_declarations(css[1]));
//     });
//
//     callback(result);
//   };
//
//   function restore(string) {
//     // console.debug('> restore');
//
//     if(string === undefined) { return string; }
//
//     while(match = REmunged.exec(string)) {
//       string = string.replace(REmunged, munged[match[1]]);
//     }
//     return $.trim(string);
//   }
//
//   function parse_declarations(index) {
//     // console.debug('> parse_declarations');
//
//     var string = munged[index].replace(/(?:^\s*[{'"]\s*)|(?:\s*([^\\])[}'"]\s*$)/g, '$1');
//         string = munge(string);
//     var parsed = {};
//
//     $(string.split(';')).each(function() {
//       var declaration = this.split(':');
//       if(declaration.length < 2) { return; }
//
//       parsed[restore(declaration[0])] = restore(declaration[1]);
//     });
//
//     return parsed;
//   }
//
//   var munged           = {};
//   var REbraces         = /{[^{}]*}/;
//   var REfull           = /\[[^\[\]]*\]|{[^{}]*}|\([^()]*\)|function(\s+\w+)?(\s*%b`\d+`b%){2}/;
//   var REatcomment      = /\/\*@((?:[^\*]|\*[^\/])*)\*\//g;
//   var REcomment_string = /(?:\/\*(?:[^\*]|\*[^\/])*\*\/)|(\\.|"(?:[^\\\"]|\\.|\\\n)*"|'(?:[^\\\']|\\.|\\\n)*')/g;
//   var REmunged         = /%\w`(\d+)`\w%/;
//   var uid = 0;
//
//   function munge(str, full){
//     str = str
//     .replace(REatcomment, '$1')
//     .replace(REcomment_string, function (s, string) {
//       if (!string) return '';
//       var replacement = '%s`' + (++ uid) + '`s%';
//       munged[uid] = string.replace(/^\\/,'');
//       return replacement;
//     });
//
//     var RE = full ? REfull : REbraces;
//
//     while (match = RE.exec(str)){
//       replacement = '%b`' + (++ uid) + '`b%';
//       munged[uid] = match[0];
//       str = str.replace(RE, replacement);
//     }
//
//     return str;
//   }
// })(jQuery);
//
// (function() {
//   var Specl = function() {};
//
//   Specl.filter = function() {
//     return eval(Specl.filters[this.filter]).call({ element: this.element });
//   };
//
//   Specl.property = function() {
//     eval(Specl.properties[this.property]).call({ element: this.element, args: this.args });
//   };
//
//   Specl.filters    = {};
//   Specl.properties = {};
//
//   window.Specl = Specl;
// })();
