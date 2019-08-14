from django.contrib.auth import login, logout, authenticate
from django.views.decorators.http import require_POST
from .forms import LoginForm, RegisterForm
# from django.http import JsonResponse
from utils import restful
from django.shortcuts import reverse, redirect
from utils.captcha.xfzcaptcha import Captcha
from io import BytesIO
from django.http import HttpResponse
from django.core.cache import cache
from django.contrib.auth import get_user_model
User = get_user_model()


@require_POST
def login_view(request):

    form = LoginForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        password = form.cleaned_data.get('password')
        remember = form.cleaned_data.get('remember')
        user = authenticate(request, username=telephone, password=password)
        if user:
            if user.is_active:
                login(request, user)
                if remember:
                    request.session.set_expiry(None)
                else:
                    request.session.set_expiry(0)
                return restful.ok()
            else:
                return restful.unauth(message="account has been frozen")
                # JsonResponse({'code': 401, 'message': "account has been frozen", 'data': {}})
        else:
            return restful.params_error(message="user not exist, please register first")
            # JsonResponse({'code': 400, 'message': "user not exist, please register first", 'data': {}})
    else:
        errors = form.get_errors()
        return restful.params_error(message=errors)
        # JsonResponse({'code': 400, 'message': "", 'data': errors})


def logout_view(request):
    logout(request)
    return redirect(reverse('index'))


@require_POST
def register(request):
    form = RegisterForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password1')
        user = User.objects.create_user(telephone=telephone, username=username, password=password)
        login(request, user)
        return restful.ok()
    else:
        print(form.get_errors())
        return restful.params_error(message=form.get_errors())


def img_captcha(request):

    text, image = Captcha.gene_code()
    out = BytesIO()  # save the image stream
    image.save(out, 'png')
    out.seek(0)  # move the out pointer to start position
    response = HttpResponse(content_type='image/png')
    response.write(out.read())  # read image stream from ByteIO pipe
    response['Content-length'] = out.tell()  # size of the image

    # key: value = text.lower(): text.lower()
    cache.set(text.lower(), text.lower(), 5*60)

    return response

'''
def cache_test(request):
    cache.set('username', "123", 60)
    result = cache.get('username')
    print(result)
    return HttpResponse('success')
'''