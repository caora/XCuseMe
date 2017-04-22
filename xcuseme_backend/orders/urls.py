from django.conf.urls import url
from django.contrib import admin

from . import views

urlpatterns = [
    url(r'^domains/(?P<domain>\d+)/items/(?P<item>\d+)', views.ItemView.as_view()),
    url(r'^domains/(?P<domain>\d+)/locations/(?P<location>\d+)/token', views.GenerateAPIToken.as_view()),
    url(r'^domains/(?P<domain>\d+)/place', views.PlaceOrder.as_view()),
    url(r'^domains/(?P<domain>\d+)', views.Menu.as_view()),
]
