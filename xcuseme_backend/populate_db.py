from orders.models import *

mos_eisley = Domain(name='Mos Eisley Cafe')
mos_eisley.save()
location = Location(name='Table 1', domain=mos_eisley)
location.save()

drinks = ItemCategory(name='Drinks')
drinks.save()
main_dish = ItemCategory(name='Main dish')
main_dish.save()

veggie = ItemTag(name='Veggie')
veggie.save()
meat_stuff = ItemTag(name='Meat stuff')
meat_stuff.save()
alc = ItemTag(name='Alc')
alc.save()
tasty = ItemTag(name='Tastyyyy')
tasty.save()

beer = Item(
    name='Beer',
    description='Good stuff.',
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
    domain=mos_eisley,
    category=main_dish,
)
schnitzel.save()
schnitzel.tags.add(meat_stuff)

lasagne = Item(
    name='Lasagne',
    description='Best stuff @ #Hackaburg17.',
    price=0.00,
    domain=mos_eisley,
    category=main_dish,
)
lasagne.save()
lasagne.tags.add(meat_stuff)
lasagne.tags.add(meat_stuff, tasty)
