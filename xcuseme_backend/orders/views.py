# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
import logging

from django.shortcuts import render
import rest_framework.permissions as permissions
from rest_framework.generics import UpdateAPIView
from rest_framework.views import APIView
from django.http.response import HttpResponse, JsonResponse

from orders.models import APIToken, Domain, Item, Location, Order, ItemOrder
from .serializers import ItemOrderSerializer, ItemSerializer, APITokenSerializer

logger = logging.getLogger('django.orders.views')


def validate_api_token(method):
    def wrapper(self, request, domain, location):
        if not request.session.session_key:
            logger.error('No session key available')
            return HttpResponse('No session key available', status=403)
        else:
            tokens = APIToken.objects.filter(
                value=int(request.session.session_key),
                domain=Domain.objects.get(pk=domain),
                location=Location.objects.get(pk=location),
            )
            if not tokens:
                return HttpResponse('Invalid session key', status=403)
        return method(self, request, domain, location)
    return wrapper


class GenerateAPIToken(APIView):
    # permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, domain, location):
        token = APITokenSerializer.new(domain=domain, location=location)
        logger.info('Created API token: %s', token)
        return JsonResponse({'token': token.value})


class ValidateAPIToken(APIView):
    def post(self, request, domain, location):
        try:
            logger.info('[%s] data: %s', ValidateAPIToken.__name__, request.data)
            token_value = request.data.get('token')
            if token_value is None:
                return HttpResponse('Missing token', status=400)
            try:
                int(token_value)
            except ValueError:
                return HttpResponse('Not a valid number', status=400)
            APIToken.objects.get(
                value=int(token_value),
                domain=Domain.objects.get(pk=domain),
                location=Location.objects.get(pk=location),
            )
        except APIToken.DoesNotExist:
            return HttpResponse('Invalid token', status=403)
        return HttpResponse()


class Menu(APIView):
    # @validate_api_token
    def get(self, request, domain, location):
        items = Domain.objects.get(pk=domain).item_set
        serializer = ItemSerializer(items.all(), many=True)
        return JsonResponse(serializer.data, safe=False)


class AddMenuItems(APIView):
    # @validate_api_token
    def post(self, request, domain):
        serializer = ItemSerializer(data=request.data, many=True)
        if not serializer.is_valid():
            HttpResponse('Invalid data format', status=400)
        serializer.save(domain=domain)
        return HttpResponse()


class ItemView(APIView):
    def get(self, request, domain, location, item):
        items = Domain.objects.get(pk=domain).item_set
        serializer = ItemSerializer(items.get(pk=item))
        return JsonResponse(serializer.data, safe=False)


class PlaceOrder(APIView):
    # @validate_api_token
    def post(self, request, domain, location):
        logger.error('[PlaceOrder] request.data: %s', request.data)
        data = json.loads(request.data.keys()[0])
        logger.error('[PlaceOrder] json: %s', data)
        logger.error('[PlaceOrder] domain: %s, location: %s', domain, location)
        order = Order(
            domain=Domain.objects.get(pk=domain),
            location=Location.objects.get(pk=location)
        )
        order.save()
        for item in data['items']:
            logger.error('[PlaceOrder] item: %s', item)
            pk = int(item['pk'])
            logger.error('[PlaceOrder] type(pk): %s', type(pk))
            logger.error('[PlaceOrder] pk: %s', pk)
            item_order = ItemOrder(
                item=Item.objects.get(pk=pk),
                count=item['amount'],
                order=order
            )
            item_order.save()
            logger.info('Saving order: %s', item_order)
        return HttpResponse()


class PlaceOrderJSON(APIView):
    # @validate_api_token
    def post(self, request, domain, location):
        logger.error('[PlaceOrder] request.data: %s', request.data)
        data = request.data
        logger.error('[PlaceOrder] json: %s', data)
        logger.error('[PlaceOrder] domain: %s, location: %s', domain, location)
        order = Order(
            domain=Domain.objects.get(pk=domain),
            location=Location.objects.get(pk=location)
        )
        order.save()
        for item in data['items']:
            logger.error('[PlaceOrder] item: %s', item)
            pk = int(item['pk'])
            logger.error('[PlaceOrder] type(pk): %s', type(pk))
            logger.error('[PlaceOrder] pk: %s', pk)
            item_order = ItemOrder(
                item=Item.objects.get(pk=pk),
                count=item['amount'],
                order=order
            )
            item_order.save()
            logger.info('Saving order: %s', item_order)
        return HttpResponse()


class PollOrders(APIView):
    def get(self, request, domain):
        orders = Order.objects.filter(domain=Domain.objects.get(pk=domain))
        item_orders = []
        for order in orders:
            serializer = ItemOrderSerializer(order.itemorder_set.all(), many=True)
            item_orders.append(serializer.data)
        return JsonResponse(item_orders, safe=False)


class UpdateItemOrder(UpdateAPIView):
    def put(self, request, order, *args, **kwargs):
        data = request.data
        item_order = ItemOrder.objects.get(pk=order)
        item_order.status = data['status']
        item_order.save()
        return HttpResponse()
