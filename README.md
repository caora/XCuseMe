# XCuseMe

The _greatest_ project @ #Hackaburg17 `<333`


## Backend

To run the backend you need to 

    pip install Django
    pip install djangorestframework
    pip install django-cors-headers

Build the models with

    python manage.py makemigrations orders

To set up the database run

    python manage.py migrate

In order to populate the database with dummy data you can run the following file from within the app's environment; for example

    $ python manage.py shell

    >>> execfile('populate_db.py')

To start the server run

    python manage.py runserver 0.0.0.0:8000
