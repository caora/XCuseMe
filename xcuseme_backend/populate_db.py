from orders.models import *

mos_eisley = Domain(name='Mos Eisley Cafe')
mos_eisley.save()
location = Location(name='Table 1', domain=mos_eisley)
location.save()

drinks = ItemCategory(name='Drinks')
drinks.save()
soft_drinks = ItemCategory(name='Soft Drinks')
soft_drinks.save()
main_dish = ItemCategory(name='Main dish')
main_dish.save()
desert = ItemCategory(name='Desert')
desert.save()

veggie = ItemTag(name='Veggie')
veggie.save()
meat_stuff = ItemTag(name='Meat stuff')
meat_stuff.save()
alc = ItemTag(name='Alc')
alc.save()
tasty = ItemTag(name='Tastyyyy')
tasty.save()
sweet = ItemTag(name='sweet')
sweet.save()
cold = ItemTag(name='cold')
cold.save()

beer = Item(
    name='Beer',
    description='Good stuff.',
    image='/images/bier.jpg',
    price=2.30,
    domain=mos_eisley,
    category=drinks,
)
beer.save()
beer.tags.add(alc)

schnitzel = Item(
    name='Schnitzel',
    description='Mega guad.',
    price=4.00,
    image='/images/schnitzel.jpg',
    domain=mos_eisley,
    category=main_dish,
)
schnitzel.save()
schnitzel.tags.add(meat_stuff)
schnitzel.tags.add(tasty)

lasagne = Item(
    name='Lasagne',
    description='Best stuff @ #Hackaburg17.',
    price=0.00,
    image='/images/lasagne.jpg',
    domain=mos_eisley,
    category=main_dish,
)
lasagne.save()
lasagne.tags.add(meat_stuff)
lasagne.tags.add(meat_stuff, tasty)

icecream = Item(
    name='Eisbecher',
    description='Chocolate <3 Vanilla <33',
    price=1.23,
    image='/images/eis.jpg',
    domain=mos_eisley,
    category=desert,
)
icecream.save()
icecream.tags.add(cold)
icecream.tags.add(sweet)
icecream.tags.add(tasty)

cake = Item(
    name='Kuchen',
    description='Najaaa',
    price=2.34,
    image='/images/kuchen.jpg',
    domain=mos_eisley,
    category=desert,
)
cake.save()
cake.tags.add(sweet)
cake.tags.add(tasty)

coke = Item(
    name='Cola',
    description='Espanol ;)',
    price=2.22,
    image='/images/cola.jpg',
    domain=mos_eisley,
    category=soft_drinks,
)
coke.save()
coke.tags.add(sweet)
coke.tags.add(cold)

water = Item(
    name='Water',
    description='Just water. Really.',
    price=4.56,
    image='/images/wasser.jpg',
    domain=mos_eisley,
    category=soft_drinks,
)
water.save()
water.tags.add(sweet)
water.tags.add(cold)

wokda_lemon = Item(
    name='Wodka Lemon',
    description='Simply good.',
    price=4.56,
    image='/images/vodka-lemon.jpg',
    domain=mos_eisley,
    category=drinks,
)
wokda_lemon.save()
wokda_lemon.tags.add(sweet)
wokda_lemon.tags.add(cold)
