function Banner(){
    this.index = 1;
    this.banner_width = 798;
    this.banner_group = $("#banner-group");
    this.left_arrow = $('.left-arrow');
    this.right_arrow = $('.right-arrow');
    this.banner_ul = $('#banner-ul');
    this.li_list = this.banner_ul.children("li");
    this.banner_count = this.li_list.length;
    this.page_control = $(".page-control");
}


Banner.prototype.initBanner = function(){
    var self = this;

    // implement of auto loop banner sliding without animate
    // when index = the last pic or the first pic
    // before: 1 -> 2 -> 3
    // now: 3 -> 1 -> 2 -> 3 -> 1
    var first_banner = self.li_list.eq(0).clone();
    var last_banner = self.li_list.eq(self.banner_count - 1).clone();
    self.banner_ul.append(first_banner);
    self.banner_ul.prepend(last_banner);
    this.banner_ul.css({"width": self.banner_width * (self.banner_count + 2),
        'left': -self.banner_width});
};


Banner.prototype.init_page_control = function(){
    var self = this;
    for (var i = 0; i < self.banner_count; i++){
        var circle = $("<li></li>");
        self.page_control.append(circle);
        if (i === 0){
            circle.addClass("active");
        }
    }
    self.page_control.css({"width": self.banner_count * 12 + 8 * 2 + 16 * (self.banner_count - 1)})
};



Banner.prototype.loop = function(){
    var self = this;
    // banner_ul.css({'left':-798});
    this.timer = setInterval(function () {

        if (self.index >= self.banner_count + 1){
            self.banner_ul.css({'left':-self.banner_width});
            self.index = 2;
        }
        else{self.index++;}
        self.animate();
    }, 2000);

};

Banner.prototype.animate = function(){

    var self = this;
    self.banner_ul.stop().animate({"left": -798 * self.index}, 500);
    var index = self.index;
    if (index === 0){
        index = self.banner_count - 1;
    }
    else if(index === self.banner_count + 1){
        index = 0;
    }
    else{
        index = self.index - 1;
    }
    // we set active to the children that equals to the global index
    // remove the white background of others
    self.page_control.children("li").eq(index).addClass("active").siblings().removeClass("active");
};

Banner.prototype.toggle_arrow = function(is_show){
    var self = this;
    if (is_show){
        self.left_arrow.show();
        self.right_arrow.show();
    }
    else{
        self.left_arrow.hide();
        self.right_arrow.hide();
    }


};


Banner.prototype.listen_banner_hover = function(){
    var self = this;
    this.banner_group.hover(function () {
        // when mouse hover
        clearInterval(self.timer); // stop sliding
        self.toggle_arrow(true);
    }, function () {
        // when mouse leave
        self.loop();
        self.toggle_arrow(false)

    })

};


Banner.prototype.listen_arrow_click = function(){
    var self = this;
    self.left_arrow.click(function () {
        if (self.index === 0){
            self.banner_ul.css({'left': -self.banner_count * self.banner_width});
            self.index = self.banner_count - 1;
        }
        else{
            self.index--;
        }

        self.animate();
    });

    self.right_arrow.click(function () {
        if(self.index === self.banner_count + 1){
            self.banner_ul.css({'left': -self.banner_width});
            self.index = 2;
        }
        else{
            self.index++;
        }
        self.animate();
    });
};

Banner.prototype.listen_page_control = function(){
    var self = this;
    self.page_control.children("li").each(function (index, obj){
        $(obj).click(function(){
            // left side self.index is the global banner index
            // right side index is the index of li tag
            self.index = index + 1;
            self.animate();

        });
    });
};



Banner.prototype.run = function () {
    this.initBanner();
    this.init_page_control();
    this.loop();
    this.listen_banner_hover();
    this.listen_arrow_click();
    this.listen_page_control();
};



function Index() {
    var self = this;
    self.page = 2;
    self.category_id = 0;
    self.loadBtn = $("#load-more-btn");

}


Index.prototype.listenLoadMoreEvent = function () {
    var self = this;
    var loadBtn = $("#load-more-btn");
    loadBtn.click(function () {
        xfzajax.get({
            'url': '/news/list/',
            'data':{
                'p': self.page,
                'category_id': self.category_id
            },
            'success': function (result) {
                if(result['code'] === 200){
                    var newses = result['data'];
                    if(newses.length > 0){
                        var tpl = template("news-item",{"newses":newses});
                        var ul = $(".list-inner-group");
                        ul.append(tpl);
                        self.page += 1;
                    }else{
                        loadBtn.hide();
                    }
                }
            }
        });
    });
};

Index.prototype.listenCategorySwitchEvent = function () {
    var self = this;
    var tabGroup = $(".list-tab");
    tabGroup.children().click(function () {
        var li = $(this);
        var category_id = li.attr("data-category");
        var page = 1;
        xfzajax.get({
            'url': '/news/list/',
            'data': {
                'category_id': category_id,
                'p': page
            },
            'success': function (result) {
                if(result['code'] === 200){
                    var newses = result['data'];
                    var tpl = template("news-item",{"newses":newses});
                    var newsListGroup = $(".list-inner-group");
                    newsListGroup.empty();
                    newsListGroup.append(tpl);
                    self.page = 2;
                    self.category_id = category_id;
                    li.addClass('active').siblings().removeClass('active');
                    self.loadBtn.show();
                }
            }
        });
    });
};

Index.prototype.run = function () {
    var self = this;
    self.listenLoadMoreEvent();
    self.listenCategorySwitchEvent();
};



$(function () {
    var banner = new Banner();
    var index = new Index();
    banner.run();
    index.run();
});

