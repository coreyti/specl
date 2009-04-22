Disco.Namespace("Specl::IE7", {
  Template: {
    content: function(builder, initial_attributes) {
      with(builder) {
        div({ id: 'template' });
      }
    },

    methods: {
      markup: function(html) {
        this.append(html);
      },

      reset: function() {
        this.remove();
      }
    }
  },

  Stylesheet: {
    content: function(builder) {
      with(builder) {
        style({ id: 'stylesheet', type: 'text/css' });
      }
    },

    methods: {
      after_initialize: function() {
        this.definitions = [];
      },

      render: function() {
        // NOTE:
        // 
        // MSIE won't allow inserting content into an element located
        // in the <head />, so we have to implement this render method
        // and call it in order to create a dummy element, which holds
        // the child <style /> definition that we subsequently inject
        // into the document head.
        // 
        // sucks!

        var css = "";
        $.each(this.definitions, function() {
          css += this;
        });

        if($.browser.msie) {
          $('#stylesheet').remove();

          var dummy = document.createElement('div');
              dummy.innerHTML += '<p>throw away</p><style id="stylesheet">' + css + '</style>';
          document.getElementsByTagName('head')[0].appendChild(dummy.childNodes[1]);
        }
        else {
          this.append(css);
        }
      },

      define: function(selector, definition) {
        var content = selector + "{\n";
        $.each(definition, function(property, value) {
          content += property + ": " + value + ";\n";
        });
        content += "}\n";

        this.definitions.push(content);
      },

      reset: function() {
        $('#stylesheet').remove();
      }
    }
  }
});
