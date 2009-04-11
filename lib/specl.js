Specl = function() {};

// TODO
// -----------------------------------------------------------------------------
//
//   * try to remove dependency on jQuery and use Sizzle directly.  Do a search
//     for $ and jQuery.  $.get is probably the toughest.
//

(function(lib) {
  lib.TEST_MODE           = false;
  lib.property_extensions = {};
  lib.vendor_filters      = {};
  lib.vendor_properties   = {};
  
  lib.transform = function(selector){
    lib.load(selector, function(element, css) {
      // TODO:
      //   * seems like this would be better, but it's not yet working:
      //     $(element).remove();
      
      var container   = $(element).parent();
      var replacement = $('<style id="temp_hack" type="text/css"></style>');
      
      if(container.find('style#temp_hack').length == 0) {
        container.append(replacement);
      }
      
      for(var entry in css) {
        lib.send(entry, css[entry]) || lib.standard(replacement, entry, css[entry]);
      }
    })

    $(selector).remove();
  };
  
  lib.standard = function(replacement, selector, declaration) {
    // TODO:
    //   * determine whether I should be applying all properties in order.
    //     currently, the vendor properties are applied, followed by the others.
    
    var rewrite = {
      selector     : selector,
      properties   : {},

      add_property : function(name, value) {
        rewrite.properties[name] = value;
      },
      
      to_string    : function() {
        var result = (selector + "{\n");
        $.each(rewrite.properties, function(key, value) {
          result += (key + ": " + value + "\n");
        });
        result += "}\n";

        return result;
      }
    };

    for(var property in declaration) {
      var values = declaration[property];

      if(/^-[a-z]*/.test(property) && lib.vendor_properties[property]) {
        delete(declaration[property]);
        
        $(selector).each(function() {
          var element = this;

          // TODO
          //   * should not be doing the value split here.
          //     the array should already have the individual values.
          lib.vendor_properties[property].call({ element: element, args: values[0].split(' ') });
        });
      }
      else {
        rewrite.add_property(property, values);
      }
    }
    
    replacement.append(rewrite.to_string());
  };
  
  lib.send = function(command, value) {
    if( ! lib[command]) { return false; }

    lib[command](value);
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

  lib.filter = function() {
    if(typeof this == 'function') {
      Specl.vendor_filters[arguments[0]] = arguments[1];
    }
    else {
      return Specl.vendor_filters[this.filter].call({ element: this.element });
    }
  };

  lib.property = function() {
    if(typeof this == 'function') {
      Specl.vendor_properties[arguments[0]] = arguments[1];
    }
    else {
      // currently being handled in lib.standard
    }
  };

  lib.get = function(url, callback) {
    return jQuery.ajax({
      type: "GET",
      url: url,
      data: null,
      success: callback,
      async: (! Specl.TEST_MODE)
    });
  },

  lib.load = function(selector, callback) {
    $(selector).each(function() {
      var element = this;

      lib.get(element.href, function(string) {
        lib.parse(element, string, callback);
      });
    });
  };

  lib.parse = function(element, string, callback) {
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
  internal.uid              = 0;
  internal.munged           = {};
  internal.REbraces         = /{[^{}]*}/;
  internal.REfull           = /\[[^\[\]]*\]|{[^{}]*}|\([^()]*\)|function(\s+\w+)?(\s*%b`\d+`b%){2}/;
  internal.REatcomment      = /\/\*@((?:[^\*]|\*[^\/])*)\*\//g;
  internal.REcomment_string = /(?:\/\*(?:[^\*]|\*[^\/])*\*\/)|(\\.|"(?:[^\\\"]|\\.|\\\n)*"|'(?:[^\\\']|\\.|\\\n)*')/g;
  internal.REmunged         = /%\w`(\d+)`\w%/;

  internal.munge = function(string, full) {
    string = string
      .replace(internal.REatcomment, '$1')
      .replace(internal.REcomment_string, function(s, comment) {
        if( ! comment) { return ''; }

        var replacement = '%s`' + (++ internal.uid) + '`s%';
        internal.munged[internal.uid] = comment.replace(/^\\/, '');
        return replacement;
      });

    var RE = full ? internal.REfull : internal.REbraces;

    while(match = RE.exec(string)) {
      var replacement = '%b`' + (++ internal.uid) + '`b%';
      internal.munged[internal.uid] = match[0];
      string = string.replace(RE, replacement);
    }

    return string;
  };

  internal.restore = function(string) {
    if(string === undefined) { return string; }
    
    while(match = internal.REmunged.exec(string)) {
      string = string.replace(internal.REmunged, internal.munged[match[1]]);
    }
    
    return $.trim(string);
  };
  
  internal.parse_declarations = function(index) {
    var self   = this;
    var string = self.munge(internal.munged[index].replace(/(?:^\s*[{'"]\s*)|(?:\s*([^\\])[}'"]\s*$)/g, '$1'));
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
