Disco.Namespace("Specl::IE7", {
  View: {
    content: function(builder, initial_attributes) {
      with(builder) {
        ul({ 'id': 'target' });
      }
    },

    methods: {
      after_initialize: function() {
        this.add_items(this.items);
      },
      
      add_items: function(count) {
        while((count --) > 0) {
          this.append('<li>item</li>');
        }
      }
    }
  }
});
