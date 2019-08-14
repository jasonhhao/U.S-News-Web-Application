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
  })

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
    submitBtn.click(function (event) {
        event.preventDefault();
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
                if(result['code'] == 200){
                    self.hideEvent();
                    window.location.reload();
                }else{
                    var messageObject = result['message'];
                    if(typeof messageObject == 'string' || messageObject.constructor == String){
                        window.messageBox.show(messageObject);
                    }else{
                        for(var key in messageObject){
                            var messages = messageObject[key];
                            var message = messages[0];
                            window.messageBox.show(message);
                        }
                    }
                }
            },
            'fail': function (error) {
                console.log(error);
            }
        });

    })
};


$(function () {
   var auth = new Auth();
   auth.run();
});