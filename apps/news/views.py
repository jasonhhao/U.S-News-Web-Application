from django.shortcuts import render
from .models import News, NewsCategory, Comment, Banner
from django.conf import settings
from utils import restful
from .serializers import NewsSerializer, CommentSerializer
from django.http import Http404
from .forms import PublicCommentForm
from apps.xfzauth.decorators import xfz_login_required
from django.db.models import Q


def index(request):
    print("---------------------------------index")
    count = settings.NEWS_COUNT_PER_PAGE
    newses = News.objects.select_related('category', 'author').all()[0:count]
    categories = NewsCategory.objects.all()
    context = {
        'newses': newses,
        'categories': categories,
        'banners': Banner.objects.all()
    }
    return render(request, 'news/index.html', context=context)


def news_list(request):
    print("---------------------------------news_list")
    page = int(request.GET.get('p', 1))  # page number, default is 1
    category_id = int(request.GET.get('category_id', 0))  # 0 means all categories

    start = (page - 1) * settings.NEWS_COUNT_PER_PAGE
    end = start + settings.NEWS_COUNT_PER_PAGE

    if category_id == 0:
        newses = News.objects.select_related('category', 'author').all()[start:end]
    else:
        newses = News.objects.select_related('category', 'author').filter(category_id=category_id)[start:end]

    serializer = NewsSerializer(newses, many=True)
    data = serializer.data
    return restful.result(data=data)


def news_detail(request, news_id):
    print("---------------------------------news_detail")
    try:
        news = News.objects.select_related('category', 'author').prefetch_related("comments__author").get(pk=news_id)

        context = {
            'news': news
        }
        return render(request, 'news/news_detail.html', context=context)
    except News.DoesNotExist:
        return Http404


@xfz_login_required
def public_comment(request):
    form = PublicCommentForm(request.POST)
    if form.is_valid():
        news_id = form.cleaned_data.get('news_id')
        content = form.cleaned_data.get('content')
        news = News.objects.get(pk=news_id)
        comment = Comment.objects.create(content=content, news=news, author=request.user)
        serialize = CommentSerializer(comment)
        return restful.result(data=serialize.data)
    else:
        return restful.params_error(message=form.get_errors())


def search(request):
    print("---------------------------------search")
    q = request.GET.get('q')
    context = {}
    if q:
        newses = News.objects.filter(Q(title__contains=q)|Q(content__contains=q))
        context['newses'] = newses
    return render(request, 'search/search.html', context=context)


def recommend(request):
    print("-------------hello")
    newses = News.objects.all()[:1]
    context = {
        'newses': newses,
    }
    return render(request, 'common/sidebar.html', context=context)


