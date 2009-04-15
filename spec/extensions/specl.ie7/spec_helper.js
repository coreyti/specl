Disco.Namespace("Specl::IE7", {
  Template: {
    content: function(builder, initial_attributes) {
      with(builder) {
        ul({ 'id': 'target' });
      }
    },

    methods: {
      markup: function(html) {
        this.prepend(html);
      }
    }
  },
  
  Stylesheet: {
    content: function(builder) {
      with(builder) {
        style({ type: 'text/css' });
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
      }
    }
  }
});
