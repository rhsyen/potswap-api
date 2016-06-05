var express = require('express');
var router = express.Router();
var User = require('../models/user');

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

module.exports = router;
