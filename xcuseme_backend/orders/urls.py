from django.conf.urls import url
from django.contrib import admin

from . import views

urlpatterns = [
    url(r'^domains/(?P<domain>\d+)/items/add', views.AddMenuItems.as_view()),
    url(r'^domains/(?P<domain>\d+)/orders/pollcat', views.PollOrdersCategorized.as_view()),
    url(r'^domains/(?P<domain>\d+)/orders/poll', views.PollOrders.as_view()),
    url(r'^domains/(?P<domain>\d+)/orders/(?P<order>\d+)/update', views.UpdateItemOrder.as_view()),
    url(r'^domains/(?P<domain>\d+)/orders/(?P<order>\d+)/delete', views.DeleteItemOrder.as_view()),
    url(r'^domains/(?P<domain>\d+)/locations/(?P<location>\d+)/items/(?P<item>\d+)', views.ItemView.as_view()),
    url(r'^domains/(?P<domain>\d+)/locations/(?P<location>\d+)/token/validate', views.ValidateAPIToken.as_view()),
    url(r'^domains/(?P<domain>\d+)/locations/(?P<location>\d+)/token', views.GenerateAPIToken.as_view()),
    url(r'^domains/(?P<domain>\d+)/locations/(?P<location>\d+)/placejson', views.PlaceOrderJSON.as_view()),
    url(r'^domains/(?P<domain>\d+)/locations/(?P<location>\d+)/place', views.PlaceOrder.as_view()),
    url(r'^domains/(?P<domain>\d+)/locations/(?P<location>\d+)', views.Menu.as_view()),
]
