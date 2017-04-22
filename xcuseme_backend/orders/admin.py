# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import APIToken, Domain, Location, AgeCategory, Item, ItemCategory, ItemAddOn, Order, ItemOrder

admin.site.register(Domain)
admin.site.register(Location)
admin.site.register(APIToken)
admin.site.register(AgeCategory)
admin.site.register(ItemCategory)
admin.site.register(Item)
admin.site.register(ItemAddOn)
admin.site.register(Order)
admin.site.register(ItemOrder)
