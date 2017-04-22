# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

_NAME_LENGTH = 120


class Domain(models.Model):
    name = models.CharField(max_length=_NAME_LENGTH)

    def __str__(self):
        return self.name


class Location(models.Model):
    name = models.CharField(max_length=_NAME_LENGTH)
    pseudo_secret = models.CharField(max_length=64, null=True, blank=True)

    domain = models.ForeignKey(Domain)

    def __str__(self):
        return self.name


class APIToken(models.Model):
    MIN_VALUE = 100000
    MAX_VALUE = 999999
    value = models.IntegerField()

    domain = models.ForeignKey(Domain)
    location = models.ForeignKey(Location)

    def __str__(self):
        return '%d for %s at %s' % (int(self.value), self.location, self.domain)


class AgeCategory(models.Model):
    name = models.CharField(max_length=_NAME_LENGTH)
    threshold = models.IntegerField()

    def __str__(self):
        return self.name


class ItemCategory(models.Model):
    name = models.CharField(max_length=_NAME_LENGTH)

    def __str__(self):
        return self.name


class ItemTag(models.Model):
    name = models.CharField(max_length=_NAME_LENGTH)


class Item(models.Model):
    name = models.CharField(max_length=_NAME_LENGTH)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    age_category = models.ForeignKey(AgeCategory, null=True, blank=True)
    domain = models.ForeignKey(Domain)
    category = models.ForeignKey(ItemCategory)
    tags = models.ManyToManyField(ItemTag)

    def __str__(self):
        return self.name


class ItemAddOn(models.Model):
    name = models.CharField(max_length=_NAME_LENGTH, null=False)

    item = models.ForeignKey(Item, null=False)

    def __str__(self):
        return self.name


class Order(models.Model):
    location = models.ForeignKey(Location)

    def __str__(self):
        return 'Order for %s' % self.location


class ItemOrder(models.Model):
    item = models.ForeignKey(Item)
    count = models.IntegerField()
    order = models.ForeignKey(Order, on_delete=models.CASCADE)

    def __str__(self):
        return '%dx %s' % (int(self.count), self.item)
