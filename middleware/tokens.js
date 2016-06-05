var express = require('express');
var router = express.Router();

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

module.exports = router;
