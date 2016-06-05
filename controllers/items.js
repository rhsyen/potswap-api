var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Item = require('../models/item');

router.route('/items')
    .get(function(req, res) { // Get all items
        Item.find(function(err, items) {
            if (err) {
                res.send(err);
            }
            res.json(items);
        });
    })
    .post(function(req, res) { // Create an item
        Item.findOne({
            'email': req.body.email,
            'name' : req.body.name
        }, function(err, savedItem) {
            if (err || savedItem) {
                res.json({
                    success: false,
                    message: 'Duplicate item'
                });
            } else {
                var item = new Item();
                item.name = req.body.name;
                item.description = req.body.description;
                item.owner = req.body.email;
                item.save(function(err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json({
                            message: 'Item created',
                            data: item
                        });
                    }
                });
            }
        });
    });

module.exports = router;
