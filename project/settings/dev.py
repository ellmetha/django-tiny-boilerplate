# -*- coding:utf-8 -*-

from .base import *  # noqa

DEBUG = True

ALLOWED_HOSTS = [
    'localhost:8000',
]

INTERNAL_IPS = (
    '127.0.0.1',
)

MIDDLEWARE_CLASSES += (
    'debug_toolbar.middleware.DebugToolbarMiddleware',
)

TEMPLATES[0]['OPTIONS']['context_processors'] += (
    'project.context_processors.webpack',
)

STATICFILES_DIRS = (
    str(PROJECT_PATH / 'static' / 'build_dev'),
    str(PROJECT_PATH / 'static' / 'build'),
    str(PROJECT_PATH / 'static'),
)

INSTALLED_APPS += (
    'debug_toolbar',
)

WEBPACK_DEV_SERVER_URL = 'http://localhost:8080'
