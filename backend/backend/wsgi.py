"""
WSGI config for backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/
"""

import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")


def get_application():
    import django
    from django.core.handlers.wsgi import WSGIHandler

    django.setup(set_prefix=False)
    return WSGIHandler()


application = get_application()
