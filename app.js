var express = require('express');
var app = express();

var foodItems = [
    {
        pk: 1,
        name: "Hauptspeisen",
        items: [
            {
                pk: 1,
                name: "Schnitzel mit Pommes",
                description: "Mega guad",
                tags: [
                    "deftig",
                    "lecker"
                ],
                img: "/images/schnitzel.img",
                sizes: [
                    "klein",
                    "normal"
                ],
                prices: [
                    4.00,
                    6.50
                ]
            },
            {
                pk: 2,
                name: "Lasagne",
                description: "Mega kacke",
                tags: [
                    "deftig",
                    "lecker"
                ],
                img: "/images/lasagne.img",
                prices: [
                    6.50
                ]
            }
        ]
    },
    {
        pk: 2,
        name: "Nachtische",
        items: [
            {
                pk: 3,
                name: "Eisbecher",
                description: "eiskoid",
                tags: [
                    "süß",
                    "kalt"
                ],
                img: "/images/eis.img",
                prices: [
                    3.50
                ]
            },
            {
                pk: 4,
                name: "Kuchen",
                description: "naja",
                tags: [
                    "süß",
                    "lecker"
                ],
                img: "/images/kuchen.img",
                prices: [
                    2.50
                ]
            }
        ]
    },
    {
        pk: 3,
        name: "Softdrinks",
        items: [
            {
                pk: 5,
                name: "Cola",
                description: "eiskoid",
                tags: [
                    "erfrischend",
                    "kalt"
                ],
                img: "/images/cola.img",
                sizes: [
                    "0.3l",
                    "0.5l"
                ],
                prices: [
                    2.00,
                    2.80
                ]
            },
            {
                pk: 6,
                name: "Wasser",
                description: "sauber, spritzig",
                tags: [
                    "erfrischend",
                    "kalt"
                ],
                img: "/images/wasser.img",
                sizes: [
                    "0.3l",
                    "0.5l"
                ],
                prices: [
                    1.80,
                    2.20
                ]
            }
        ]
    },
    {
        pk: 4,
        name: "Alkoholische Getränke",
        items: [
            {
                pk: 7,
                name: "Bier",
                description: "eiskoid",
                tags: [
                    "erfrischend",
                    "alkoholisch"
                ],
                img: "/images/bier.img",
                restricted: 16,
                prices: [
                    2.80
                ]
            },
            {
                pk: 8,
                name: "Vodka-Lemon",
                description: "naja",
                tags: [
                    "longdrink",
                    "alkoholisch"
                ],
                img: "/images/vodka-lemon.img",
                restricted: 18,
                prices: [
                    6.50
                ]
            }
        ]
    }];

var tablesSample = [{
    tableNo: 1,
    restaurantId: 1,
    free: false,
    status: "Geliefert",
    orders: [
        {
            pk: 7,
            amount: 3,
            name: "Bier",
            description: "eiskoid",
            tags: [
                "erfrischend",
                "alkoholisch"
            ],
            img: "/images/bier.img",
            restricted: 16,
            price: 2.80
        },
        {
            pk: 8,
            amount: 27,
            name: "Vodka-Lemon",
            description: "naja",
            tags: [
                "longdrink",
                "alkoholisch"
            ],
            img: "/images/vodka-lemon.img",
            restricted: 18,
            price: 6.50
        }
    ]
}, {
    tableNo: 2,
    restaurantId: 1,
    free: true
}, {
    tableNo: 3,
    restaurantId: 1,
    free: true
}, {
    tableNo: 4,
    restaurantId: 1,
    free: true
}, {
    tableNo: 5,
    restaurantId: 1,
    free: false,
    status: "Offen",
    orders: [
        {
            pk: 1,
            amount: 0.5,
            name: "Schnitzel mit Pommes",
            description: "Mega guad",
            tags: [
                "deftig",
                "lecker"
            ],
            img: "/images/schnitzel.img",
            size: "klein",
            price: 4.00
        },
        {
            pk: 2,
            amount: 1337,
            name: "Lasagne",
            description: "Mega kacke",
            tags: [
                "deftig",
                "lecker"
            ],
            img: "/images/lasagne.img",
            price: 6.50
        }
    ]
}];

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render("visitor.ejs", {menu: foodItems});
});

app.get('/verify/:restaurantId/:tableId', function (req, res) {
    res.render("verify.ejs");
});

app.get('/tabs', function (req, res) {
    res.render("tabs.ejs");
});

app.get('/admin/orders', function (req, res) {
    res.render("admin/orders.ejs");
});

app.get('/admin/food', function (req, res) {
    res.render("admin/food.ejs", {menu: foodItems});
});

app.get('/admin/tables', function (req, res) {
    res.render("admin/tables.ejs", {tables: tablesSample});
});

app.use(express.static(__dirname + '/public'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
