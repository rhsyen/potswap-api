// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var Bear = require('./app/models/bear');
var User = require('./app/models/user');
var mongoose = require('mongoose');

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

router.route('/users')
    .post(function(req, res) {
        var user = new User();
        user.email = req.body.email;
        user.password = req.body.password; // encrypted in user.js
        user.name = req.body.name;
        user.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({
                message: 'User created'
            });
        });
    })
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err) {
                res.send(err);
            }
            res.json(users);
        });
    });

router.route('/bears')
    .post(function(req, res) {
        var bear = new Bear();
        bear.name = req.body.name;
        bear.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({
                message: 'Bear created!'
            });
        });
    })
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err) {
                res.send(err);
            }
            res.json(bears);
        });
    });

router.route('/bears/:bear_id')
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err) {
                res.send(err);
            }
            res.json(bear);
        });
    })
    .put(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err) {
                res.send(err);
            }
            bear.name = req.body.name;
            bear.save(function(err) {
                if (err) {
                    res.send(err);
                }
                res.json({
                    message: 'Bear updated!'
                });
            });
        });
    })
    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if (err) {
                res.send(err);
            }
            res.json({
                message: 'Successfully deleted'
            });
        });
    });

// REGISTER OUR ROUTES
// =============================================================================
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
