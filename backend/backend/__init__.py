from django.utils import encoding, http

from .celery import app as celery_task
from .schema import *

encoding.force_text = encoding.force_str
http.urlquote = lambda url: url
__all__ = ['celery_task']
