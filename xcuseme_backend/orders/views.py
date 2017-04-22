# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
import rest_framework.permissions as permissions
from rest_framework.views import APIView
from django.http.response import HttpResponse, JsonResponse

from orders.models import Domain, Item, Location, Order, ItemOrder
from .serializers import ItemSerializer, APITokenSerializer


class GenerateAPIToken(APIView):
    # permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, domain, location):
        token = APITokenSerializer.new(domain=domain, location=location)
        return JsonResponse({'token': token.value})


class Menu(APIView):
    def get(self, request, domain):
        items = Domain.objects.get(pk=domain).item_set
        serializer = ItemSerializer(items.all(), many=True)
        return JsonResponse(serializer.data, safe=False)
        # return JsonResponse({'items': [item.pk for item in items.all()]}, safe=False)


class ItemView(APIView):
    def get(self, request, domain, item):
        items = Domain.objects.get(pk=domain).item_set
        serializer = ItemSerializer(items.get(pk=item))
        return JsonResponse(serializer.data, safe=False)


class PlaceOrder(APIView):
    def post(self, request, domain):
        order = Order(location=Location.objects.get(pk=request.data['location']))
        order.save()
        for item in request.data['items']:
            item_order = ItemOrder(
                item=Item.objects.get(pk=item['pk']),
                count=item['count'],
                order=order
            )
            item_order.save()
            print 'Saving order: ', item_order
        return HttpResponse()
