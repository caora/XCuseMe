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
        fields = ('pk', 'name', 'description', 'price', 'category', 'tags')
