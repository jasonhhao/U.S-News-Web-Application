function NewsCategory() {
};

NewsCategory.prototype.run = function () {
    var self = this;
    self.listenAddCategoryEvent();
    self.listenEditCategoryEvent();
    self.listenDeleteCategoryEvent();
};

NewsCategory.prototype.listenAddCategoryEvent = function () {
    var addBtn = $('#add-btn');
    addBtn.click(function () {
        xfzalert.alertOneInput({
            'title': 'Add news category',
            'placeholder': 'Input category name',
            'confirmCallback': function (inpuValue) {
                xfzajax.post({
                    'url': '/cms/add_news_category/',
                    'data': {
                        'name': inpuValue
                    },
                    'success': function (result) {
                        if(result['code'] === 200){
                            console.log(result);
                            window.location.reload();
                        }else{
                            xfzalert.close();
                        }
                    }
                });
            }
        });
    });
};



NewsCategory.prototype.listenEditCategoryEvent = function(){
    var editBtn = $(".edit-btn");
    editBtn.click(function () {
        var currentBtn = $(this);
        var tr = currentBtn.parent().parent();
        var pk = tr.attr('data-pk');
        var name = tr.attr('data-name');
        xfzalert.alertOneInput({
            'title': 'Edit category name',
            'placeholder': 'New category name',
            'value': name,
            'confirmCallback': function (inputValue) {
                xfzajax.post({
                    'url': '/cms/edit_news_category/',
                    'data': {
                        'pk': pk,
                        'name': inputValue,
                    },
                    'success': function (result) {
                        if(result['code'] === 200){
                            window.location.reload();
                        }else{
                            xfzalert.close();
                            window.messageBox.showError(result['message']);
                        }
                    }
                });

            }

        });
    });
    
};


NewsCategory.prototype.listenDeleteCategoryEvent = function(){
    var deleteBtn = $('.delete-btn');
    deleteBtn.click(function () {
       var currentBtn = $(this);
       var tr = currentBtn.parent().parent();
       var pk = tr.attr('data-pk');
       xfzalert.alertConfirm({
           'title': 'Are you sure to delete?',
           'confirmCallback': function () {
               xfzajax.post({
                   'url': '/cms/delete_news_category/',
                   'data': {
                       'pk': pk,
                   },
                   'success': function (result) {
                       if(result['code'] === 200){
                           window.location.reload();
                       }else{
                           xfzalert.close();
                       }
                   }

               });
           }
       });
    });
};



$(function () {
    var category = new NewsCategory();
    category.run();
});