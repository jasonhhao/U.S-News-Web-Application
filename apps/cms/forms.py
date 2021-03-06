

from apps.forms import FormMixin
from django import forms
from apps.news.models import News, Banner


class EditNewsCategoryForm(forms.Form, FormMixin):

    pk = forms.IntegerField(error_messages={'required': "You must pass the id of a category!"})
    name = forms.CharField(max_length=100)


class WriteNewsForm(forms.ModelForm, FormMixin):

    category = forms.IntegerField()

    class Meta:
        model = News
        exclude = ['category', 'author', 'pub_time']


class AddBannerForm(forms.ModelForm, FormMixin):

    class Meta:
        model = Banner
        fields = ('priority', 'link_to', 'image_url')


class EditBannerForm(forms.ModelForm, FormMixin):
    pk = forms.IntegerField()

    class Meta:
        model = Banner
        fields = ('priority', 'link_to', 'image_url')


class EditNewsForm(forms.ModelForm, FormMixin):
    category = forms.IntegerField()
    pk = forms.IntegerField()

    class Meta:
        model = News
        exclude = ['category', 'author', 'pub_time']