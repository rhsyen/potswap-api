// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var User = require('./app/models/user');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

mongoose.connect('mongodb://potswapadmin:potswap@ds019882.mlab.com:19882/potswapdb');


// ROUTES
// =============================================================================
var router = express.Router(); // get an instance of the express Router

router.route('/records')
    .post(function(req, res) { // Create new user
        var user = new User();
        user.email = req.body.email;
        user.password = req.body.password; // encrypted in user.js
        user.name = req.body.name;
        user.save(function(err) {
            if (err) {
                res.send(err);
            } else {
                res.json({
                    message: 'User created'
                });
            }
        });
    })
    .get(function(req, res) { // Get all users (for debug)
        User.find(function(err, users) {
            if (err) {
                res.send(err);
            }
            res.json(users);
        });
    });

router.route('/users')
    .post(function(req, res) { // Log in
        User.findOne({
            'email' : req.body.email
        }, function(err, user) {
            if (err || !user) {
                res.status(401).send(err);
            } else {
                bcrypt.compare(req.body.password, user.password, function(err, matched) {
                    if (err || !matched) {
                        res.status(401).send(err);
                    } else {
                        res.send({ accessToken: 'someToken' });
                    }
                });
            }
        });
    });

// REGISTER OUR ROUTES
// =============================================================================
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port + ' on ' + Date());
