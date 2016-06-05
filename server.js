// SETUP
// =============================================================================

// packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var morgan = require('morgan');
var bearerToken = require('express-bearer-token');
// models
var User = require('./app/models/user');
// others
var config = require('./config');

// configuration
var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('mySecret', config.secret);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bearerToken());
app.use(morgan('dev'));

// ROUTES
// =============================================================================
var router = express.Router(); // get an instance of the express Router



router.route('/users')
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
                    message: 'User created',
                    data: user
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

router.route('/authenticate')
    .post(function(req, res) { // Log in
        // body.email, body.password required
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
                        // Successfully found user
                        var token = jwt.sign(user, app.get('mySecret'), {
                            expiresIn: '2h'
                        });
                        res.send({
                            success: true,
                            accessToken: token
                        });
                    }
                });
            }
        });
    });
// Authentication middleware
router.use(function(req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.token;
    console.log(token);
    if (token) {
        jwt.verify(token, app.get('mySecret'), function(err, decoded) {
            if (err) {
                res.send(err);
            } else {
                req.decoded = decoded;
                req.next();
            }
        });
    } else {
        res.status(403).send({
            success: false,
            message: 'No token provided'
        });
    }
});
router.route('/')
    .get(function(req, res) {
        res.send('Welcome!');
    });
// REGISTER OUR ROUTES
// =============================================================================
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port + ' on ' + Date());
