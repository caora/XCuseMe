var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var hash = require('pbkdf2-password')();
var session = require('express-session');
var request = require('request');

var sampledata = require('./sampledata.js');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret'
}));

app.use(function(req, res, next){
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.errorMessage = '';
    res.locals.successMessage = '';
    if (err) res.locals.errorMessage = err;
    if (msg) res.locals.successMessage = msg;
    next();
});

var admins = {
    xq: { name: 'xq' }
};

hash({ password: 'foobar' }, function (err, pass, salt, hash) {
    if (err) throw err;
    // store the salt & hash in the "db"
    admins.xq.salt = salt;
    admins.xq.hash = hash;
});

function authenticateAdmin(name, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', name, pass);
    var user = admins[name];
    // query the db for the given username
    if (!user) return fn(new Error('cannot find user'));
    // apply the same algorithm to the POSTed password, applying
    // the hash against the pass / salt, if there is a match we
    // found the user
    hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
        if (err) return fn(err);
        if (hash == user.hash) return fn(null, user);
        fn(new Error('invalid password'));
    });
}

function restrictAdmin(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Zugriff verweigert! Bitte zunächst einloggen.';
        res.redirect('/admin/login?bounce=' + req.url);
    }
}

function parseData(menu) {
    var data = [];
    var usedCategories = [];
    menu.forEach((item) => {
        if (!isIn(item.category.name, usedCategories)) {

        usedCategories.push(item.category.name);
        data.push({
            pk: item.category.pk,
            name: item.category.name,
            items: [{
                pk: item.pk,
                name: item.name,
                description: item.description,
                image: item.image,
                tags: item.tags,
                price: item.price
            }]
        });
    } else {
        for (var i = 0; i < data.length; i++) {
            if (data[i].name == item.category.name) {
                data[i].items.push({
                    pk: item.pk,
                    name: item.name,
                    description: item.description,
                    image: item.image,
                    tags: item.tags,
                    price: item.price
                });
            }
        }
    }

});

    return data;
}

function isIn(cat, arr) {
    for (var i = 0; i < arr.length; i++) {
        if(arr[i] == cat) {
            return true;
        }
    }
    return false;
}

app.get('/r/:r/:l/:token', function (req, res) {
    var renderParam = {r: req.params.r, l: req.params.l, token:req.params.token, menu: {}};

    var url = "http://172.16.118.27:8000/orderings/domains/" + renderParam.r + "/locations/" + renderParam.l + "/token/validate";
    var menuUrl = "http://172.16.118.27:8000/orderings/domains/" + renderParam.r + "/locations/" + renderParam.l;

    request.post(url, { form: { "token": renderParam.token } }, function (error, response, body) {
        console.log(body + " " + renderParam.token);
        if (!error && response.statusCode == 200) {
            request.get(menuUrl, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var foodItems = parseData(JSON.parse(response.body));
                    console.log(foodItems[0].items[0]);
                    renderParam.menu = foodItems;
                    res.render("visitor.ejs", renderParam);
                } else {
                    res.redirect("/rv/" + renderParam.r + "/" + renderParam.l);
                }
            })
        } else {
            res.redirect("/rv/" + renderParam.r + "/" + renderParam.l);
        }
    });
});

app.get('/rv/:r/:l', function (req, res) {
    res.render("verify.ejs");
});

app.get('/admin/*', function(req, res, next){
    if (!!req.session.bounceTo){ // already have a bounce destination
        console.log("allready have bounceTo");
        return next();
    } else {
        if (req.query['bounce']) {
            console.log("setting bounceTo");
            req.session.bounceTo = req.query['bounce'];
        }
        return next();
    }
});

app.get('/admin', function(req, res){
    res.redirect('admin/login');
});

app.get('/admin/login', function(req, res){
    res.render('admin/login');
});

app.post('/admin/login', function(req, res){
    authenticateAdmin(req.body.username, req.body.password, function(err, user){
        if (user) {
            // Regenerate session when signing in
            // to prevent fixation
            req.session.regenerate(function(){
                // Store the user's primary key
                // in the session store to be retrieved,
                // or in this case the entire user object
                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.name
                    + ' click to <a href="/logout">logout</a>. '
                    + ' You may now access <a href="/restricted">/restricted</a>.';
                console.log(req.body.bounceTo);
                res.redirect(req.body.bounceTo);
            });
        } else {
            req.session.error = 'Anmeldung fehlgeschlagen, Benutzername und Passwort stimmen nicht überein.';
            //res.redirect(req.session.bounceTo);
        }
    });
});

app.get('/admin/logout', function(req, res){
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function(){
        res.redirect('/admin/login/');
    });
});

app.get('/admin/orders', restrictAdmin, function (req, res) {
    res.render("admin/orders.ejs");
});

app.get('/admin/food', restrictAdmin, function (req, res) {
    res.render("admin/food.ejs", {menu: sampledata.foodItems});
});

app.get('/admin/tables/', restrictAdmin, function (req, res) {
    var renderParam = {r: 1, menu: {}};
    var ordersUrl = "http://172.16.118.27:8000/orderings/domains/" + renderParam.r + "/orders/pollcat";

    request.get(ordersUrl, function (error, response, body) {
        console.log(body + " ##### " + renderParam.token);
        if (!error && response.statusCode == 200) {
            renderParam.tables = body;
            res.render("admin/tables.ejs", renderParam);
        } else {
            res.redirect("/fkyou");
        }
    });
    // res.render("admin/tables.ejs", {tables: sampledata.tablesSample});
});

app.get('/admin/tableQrCodes/', restrictAdmin, function (req, res) {
    res.render("admin/table-qr-codes.ejs", {tables: sampledata.tablesSample});
});

app.use(express.static(__dirname + '/public'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
