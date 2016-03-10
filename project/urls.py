# -*- coding: utf-8 -*-

from django.conf import settings
from django.conf.urls import include
from django.conf.urls import url
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views.generic import RedirectView
from django.views.generic import TemplateView


# Admin autodiscover
admin.autodiscover()

app1_urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='app1/home.html'), name='home'),
    url(r'^page-1/$', TemplateView.as_view(template_name='app1/page1.html'), name='page-1'),
    url(r'^page-2/$', TemplateView.as_view(template_name='app1/page2.html'), name='page-2'),
]

app2_urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='app2/home.html'), name='home'),
]

# Patterns
urlpatterns = [
    # Admin
    url(r'^' + settings.ADMIN_URL, include(admin.site.urls)),

    # Apps
    url(r'^app-1/', include(app1_urlpatterns, namespace='app1')),
    url(r'^app-2/', include(app2_urlpatterns, namespace='app2')),
    url(r'^$', RedirectView.as_view(pattern_name='app1:home')),
]

if settings.DEBUG:
    # Add the Debug Toolbar’s URLs to the project’s URLconf
    import debug_toolbar
    urlpatterns += [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ]

    # In DEBUG mode, serve media files through Django.
    urlpatterns += staticfiles_urlpatterns()
    # Remove leading and trailing slashes so the regex matches.
    media_url = settings.MEDIA_URL.lstrip('/').rstrip('/')

    urlpatterns += [
        url(r'^%s/(?P<path>.*)$' % media_url, 'django.views.static.serve',
            {'document_root': settings.MEDIA_ROOT}),
    ]
