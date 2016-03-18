# -*- coding: utf-8 -*-

from django.conf import settings


def webpack(request):
    return {
        'WEBPACK_DEV_SERVER_URL': getattr(settings, 'WEBPACK_DEV_SERVER_URL', ''),
    }
