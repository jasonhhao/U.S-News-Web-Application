
from django import forms
from apps.forms import FormMixin
from django.core.cache import cache
from .models import User


class LoginForm(forms.Form, FormMixin):

    telephone = forms.CharField(max_length=11)
    password = forms.CharField(max_length=20, min_length=6,
                               error_messages={"max_length": "password length should be less than 20 characters",
                                                                            "min_length": "password length should be more than 6 characters"})
    remember = forms.IntegerField(required=False)


class RegisterForm(forms.Form, FormMixin):

    telephone = forms.CharField(max_length=11)
    username = forms.CharField(max_length=20)
    password1 = forms.CharField(max_length=20, min_length=6,
                               error_messages={"max_length": "password length should be less than 20 characters",
                                                                            "min_length": "password length should be more than 6 characters"})
    password2 = forms.CharField(max_length=20, min_length=6,
                                error_messages={"max_length": "password length should be less than 20 characters",
                                                                            "min_length": "password length should be more than 6 characters"})
    img_captcha = forms.CharField(max_length=4, min_length=4)

    def clean(self):
        cleaned_data = super(RegisterForm, self).clean()

        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        if password1 != password2:
            raise forms.ValidationError("Two password are not the same! ")

        img_captcha = cleaned_data.get('img_captcha')
        cached_img_captcha = cache.get(img_captcha.lower())
        if not cached_img_captcha or cached_img_captcha.lower() != img_captcha.lower():
            raise forms.ValidationError("Auth code error")

        telephone = cleaned_data.get("telephone")
        exists = User.objects.filter(telephone=telephone).exists()
        if exists:
            forms.ValidationError("Phone number already registered, please login!")

        return cleaned_data