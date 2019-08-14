function FrontBase(){}

FrontBase.prototype.run = function () {
    var self = this;
    self.listenAuthBoxHover();
    self.handleNavStatus();
};


FrontBase.prototype.handleNavStatus = function(){
    var url = window.location.href;
    var protocol = window.location.protocol;
    var host = window.location.host;
    var domain = protocol + "//" + host;
    var path = url.replace(domain, '')
    var navList = $(".nav li");
    navList.each(function (index, element) {
        var li = $(element);
        var aTag = li.children('a');
        var href = aTag.attr("href");
        if(href === path){
            li.addClass("active");
            return false;
        }
    });

};


FrontBase.prototype.listenAuthBoxHover = function () {
    var authBox = $(".auth-box");
    var userMoreBox = $(".user-more-box");
    authBox.hover(function () {
        userMoreBox.show();
    },function () {
        userMoreBox.hide();
    });
};





function Auth() {
    var self = this;
    self.maskWrapper = $('.mask-wrapper');
    self.scrollWrapper = $('.scroll-wrapper');

}

Auth.prototype.run = function () {
    var self = this;
    self.listenShowHideEvent();
    self.listenSwitchEvent();
    self.listenSigninEvent();
    self.listenSignupEvent();
    self.listenImgCaptchaEvent();

};

Auth.prototype.showEvent = function(){
    var self = this;
    self.maskWrapper.show();
};

Auth.prototype.hideEvent = function(){
    var self = this;
    self.maskWrapper.hide();
};

Auth.prototype.listenShowHideEvent = function(){
  var signinBtn = $('.signin-btn');
  var signupBtn = $('.signup-btn');
  var closeBtn = $('.close-btn');
  var self = this;

  closeBtn.click(function () {
     self.hideEvent();
  });
  signinBtn.click(function () {
      self.showEvent();
      self.scrollWrapper.css({'left': 0});
  });

  signupBtn.click(function () {
      self.showEvent();
      self.scrollWrapper.css({'left': -400});
  });

};


Auth.prototype.listenImgCaptchaEvent = function(){
    var imgCaptcha = $('.img-captcha');
    imgCaptcha.click(function () {
        imgCaptcha.attr("src", "/account/img_captcha/" + "?random=" + Math.random());
    });
};

Auth.prototype.listenSwitchEvent = function(){
    var self = this;
    var switcher = $(".switch");
    switcher.click(function () {
       var cur_left = self.scrollWrapper.css("left");
       cur_left = parseInt(cur_left);
       if(cur_left < 0){
           self.scrollWrapper.animate({"left":"0"});
       }
       else{
           self.scrollWrapper.animate({"left": "-400px"});
       }

    });

};


Auth.prototype.listenSigninEvent = function(){
    var self = this;
    var signinGroup = $('.signin-group');
    var telephoneInput = signinGroup.find("input[name='telephone']");
    var passwordInput = signinGroup.find("input[name='password']");
    var rememberInput = signinGroup.find("input[name='remember']");

    var submitBtn = signinGroup.find(".submit-btn");
    submitBtn.click(function () {
        var telephone = telephoneInput.val();
        var password = passwordInput.val();
        var remember = rememberInput.prop("checked");

        xfzajax.post({
            'url': '/account/login/',
            'data': {
                'telephone': telephone,
                'password': password,
                'remember': remember?1:0
            },
            'success': function (result) {
                self.hideEvent();
                window.location.reload();
            },
        });

    });
};

Auth.prototype.listenSignupEvent = function(){
    var signupGroup = $(".signup-group");
    var submitBtn = signupGroup.find(".submit-btn");
    submitBtn.click(function (event) {
        event.preventDefault(); // not have to
        var telephoneInput = signupGroup.find("input[name='telephone']");
        var usernameInput = signupGroup.find("input[name='username']");
        var imgCaptchaInput = signupGroup.find("input[name='img_captcha']");
        var password1Input = signupGroup.find("input[name='password1']");
        var password2Input = signupGroup.find("input[name='password2']");
        var telephone = telephoneInput.val()
        var username = usernameInput.val()
        var img_captcha = imgCaptchaInput.val()
        var password1 = password1Input.val()
        var password2 = password2Input.val()

        xfzajax.post({
            'url': '/account/register/',
            'data': {
                'telephone': telephone,
                'username': username,
                'img_captcha': img_captcha,
                'password1': password1,
                'password2': password2,
            },
            'success': function (result) {
                window.location.reload();
            },
        });
    });
};


$(function () {
   var auth = new Auth();
   var frontBase = new FrontBase();
   auth.run();
   frontBase.run();
});


$(function () {
    if(template){
        template.defaults.imports.timeSince = function (dateValue) {
            var date = new Date(dateValue);
            var datets = date.getTime();
            var nowts = (new Date()).getTime();
            var timestamp = (nowts - datets)/1000;
            if(timestamp < 60) {
                return 'Just now';
            }
            else if(timestamp >= 60 && timestamp < 60*60) {
                minutes = parseInt(timestamp / 60);
                return minutes+' minutes before';
            }
            else if(timestamp >= 60*60 && timestamp < 60*60*24) {
                hours = parseInt(timestamp / 60 / 60);
                return hours+' hours before';
            }
            else if(timestamp >= 60*60*24 && timestamp < 60*60*24*30) {
                days = parseInt(timestamp / 60 / 60 / 24);
                return days + ' days before';
            }else{
                var year = date.getFullYear();
                var month = date.getMonth();
                var day = date.getDay();
                var hour = date.getHours();
                var minute = date.getMinutes();
                return day+'/'+month+'/'+year+" "+hour+":"+minute;
            }
        }
    }
});