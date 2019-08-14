#encoding: utf-8
from django import template
from datetime import datetime
from django.utils.timezone import now as now_func, localtime

register = template.Library()


@register.filter
def time_since(value):

    if not isinstance(value,datetime):
        return value
    now = now_func()

    timestamp = (now - value).total_seconds()
    if timestamp < 60:
        return 'Just now'
    elif 60 <= timestamp < 60*60:
        minutes = int(timestamp/60)
        return '%s minutes before' % minutes
    elif 60*60 <= timestamp < 60*60*24:
        hours = int(timestamp/60/60)
        return '%s hours before' % hours
    elif 60*60*24 <= timestamp < 60*60*24*30:
        days = int(timestamp/60/60/24)
        return '%s days before' % days
    else:
        return value.strftime("%Y/%m/%d %H:%M")


@register.filter
def time_format(value):
    if not isinstance(value, datetime):
        return value

    return localtime(value).strftime("%m/%d/%Y %H:%M:%S")