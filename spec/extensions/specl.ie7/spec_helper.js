Disco.Namespace("Specl::IE7", {
  View: {
    content: function(builder, initial_attributes) {
      with(builder) {
        div("some content", { 'class': 'inner' });
      }
    },

    methods: {
      after_initialize: function() {

      }
    }
  }
});
