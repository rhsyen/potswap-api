var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.route('/authenticate')
    .post(function(req, res) { // Log in
        // body.email, body.password required
        User.findOne({
            'email': req.body.email
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

module.exports = router;
