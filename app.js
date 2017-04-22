var express = require('express');
var app = express();

var dummy = [
  {
    name: "Schnitzel mit Pommes",
    price: 6.50,
    description: "Mega guad",
    category: "Hauptspeiße"
  },
  {
    name: "Lasagne",
    price: 4.50,
    description: "Mega kacke",
    category: "Hauptspeiße"
  },
  {
    name: "Eis",
    price: 1.50,
    description: "eiskoid",
    category: "Nachtisch"
  },
  {
    name: "Kuchen",
    price: 63.50,
    description: "naja",
    category: "Nachtisch"
  }
];

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render("visitor.ejs", {menu: dummy});
});

app.get('/tabs', function (req, res) {
    res.render("tabs.ejs");
});

app.get('/admin', function (req, res) {
    res.render("restaurant.ejs");
});

app.get('/admin/food', function (req, res) {
    res.render("admin/food.ejs");
});

app.get('/admin/tables', function (req, res) {
    res.render("admin/tables.ejs");
});

app.use(express.static(__dirname + '/public'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
