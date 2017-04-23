import random

from rest_framework import serializers

from .models import APIToken, Domain, Item, ItemOrder, Location, Order, Domain, ItemCategory, \
    ItemTag


class APITokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = APIToken
        fields = ('value',)

    @staticmethod
    def new(domain, location):
        token = APIToken(
            value=random.randint(APIToken.MIN_VALUE, APIToken.MAX_VALUE),
            domain=Domain.objects.get(pk=domain),
            location=Location.objects.get(pk=location),
        )
        token.save()
        return token


class ItemCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategory
        fields = ('pk', 'name')


class ItemTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategory
        fields = ('pk', 'name')


class ItemSerializer(serializers.ModelSerializer):
    category = ItemCategorySerializer()
    tags = ItemTagSerializer(many=True)

    class Meta:
        model = Item
        fields = ('pk', 'name', 'description', 'price', 'image', 'category', 'tags')


class DomainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domain
        fields = ('pk', 'name')


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('pk', 'name')


class OrderSerializer(serializers.ModelSerializer):
    domain = DomainSerializer()
    location = LocationSerializer()

    class Meta:
        model = Order
        fields = ('pk', 'domain', 'location')


class ItemOrderSerializer(serializers.ModelSerializer):
    item = ItemSerializer()
    order = OrderSerializer()

    class Meta:
        model = ItemOrder
        fields = ('pk', 'item', 'count', 'order', 'status')
