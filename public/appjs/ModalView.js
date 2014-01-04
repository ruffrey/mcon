// App.ProcessDetails = Backbone.View.extend({
//   defaults: {
//     args: null
//   },

//   url: function() {
//     return '/addProcess';
//   }
// })

App.ModalView = Backbone.View.extend({
  tmpl: $('#modal-template').html(),

  events: {
    "click .closeProcess" :   "close",
    "click .addProcess"   :   "addProcess"
  },

  initialize: function() {
    this.model = new Backbone.Model();
    this.model.bind('destroy', this.remove, this);
  },

  render: function() {
    $(this.el).html(Mustache.to_html(this.tmpl, this.model.toJSON()));
    return this;
  },

  show: function() {
    $(document.body).append(this.render().el);
    $('#process-args-input').focus();
  },

  close: function() {
    this.remove();
  },

  addProcess: function(){
    if ($('#process-args-input').val()) {
      var reqData = {
        'args': encodeURIComponent($('#process-args-input').val()),
        'path': $('#process-args-input').val(),

        'name': $('#process-args-name').val(),
        'repo': $('#process-args-repo').val(),
        'vars': $('#process-args-vars').val()
      };
      console.log(reqData);

      var request = $.ajax({
          url: "/addProcess",
          type: "post",
          data: reqData
      });
      
      request.success(function (response, textStatus, jqXHR){
          if(response.success && response.success == "error")
          {
            
          }
          var timingForRefresh = setTimeout(function() {
              $('.refresh').trigger('click');
              clearTimeout(timingForRefresh);
          }, 3000);
      });

      request.error(function (jqXHR, textStatus, errorThrown){
          console.error(
              "The following error occured: " +
              textStatus, errorThrown
          );
      });
    }; this.remove();
  }
});