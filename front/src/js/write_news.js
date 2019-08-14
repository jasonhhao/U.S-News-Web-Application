function News(){}

News.prototype.listenUploadFileEvent = function () {
    var uploadBtn = $('#thumbnail-btn');
    uploadBtn.change(function () {
        var file = uploadBtn[0].files[0];
        var formData = new FormData();
        formData.append('file',file);
        xfzajax.post({
            'url': '/cms/upload_file/',
            'data': formData,
            'processData': false,
            'contentType': false,
            'success': function (result) {
                if(result['code'] === 200){
                    console.log(result['data']);
                    var url = result['data']['url'];
                    var thumbnailInput = $("#thumbnail-form");
                    thumbnailInput.val(url);
                }
            }
        });
    });
};


News.prototype.listenSubmitEvent = function(){
  var submitBtn = $('#submit-btn');
  submitBtn.click(function (event) {
      event.preventDefault();
      var btn = $(this);
      var pk = btn.attr('data-news-id');

      var title = $("input[name='title']").val();
      var category = $("select[name='category']").val();
      var desc = $("input[name='desc']").val();
      var thumbnail = $("input[name='thumbnail']").val();
      var content = $("textarea[name='content']").val();
      //console.log(title,category,content,desc,thumbnail);

      if(pk){
          var url = '/cms/edit_news/'
      }else{
          var url = '/cms/write_news/'
      }

      xfzajax.post({
          'url': url,
          'data': {
              'title': title,
              'category': category,
              'desc': desc,
              'thumbnail': thumbnail,
              'content': content,
              'pk': pk
          },
          'success': function (result) {
              if(result['code'] === 200){
                  xfzalert.alertSuccess('Successfully released news!', function () {
                      window.location.reload();
                  });
              }
          }
      });
  });
};




News.prototype.run = function () {
    var self = this;
    self.listenUploadFileEvent();
    self.listenSubmitEvent();
};

$(function () {
    var news = new News();
    news.run();
});