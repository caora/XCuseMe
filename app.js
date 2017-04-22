var express = require('express');
var app = express();

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render("visitor.ejs");
});

app.get('/admin', function (req, res) {
    res.render("admin/restaurant.ejs");
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
