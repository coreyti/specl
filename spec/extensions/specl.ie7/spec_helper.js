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
      define: function(selector, definition) {
        var content = selector + "{\n";
        $.each(definition, function(property, value) {
          content += property + ": " + value + ";\n";
        });
        content += "}\n";

        this.prepend(content);
      },

      reset: function() {
        this.remove();
      }
    }
  }
});
