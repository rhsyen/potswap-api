// SETUP
// =============================================================================

// packages
require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var morgan = require('morgan');
var bearerToken = require('express-bearer-token');
// models
var User = require('./models/user');

// configuration
var port = process.env.PORT || 8080;
mongoose.connect(process.env.DB_STRING);
app.set('mySecret', process.env.SECRET);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(bearerToken());
app.use(morgan('dev'));

// REGISTER OUR ROUTES
// =============================================================================
app.use('/api', require('./controllers/users'));
app.use('/api', require('./controllers/authenticate'));
//app.use('/api', require('./middleware/tokens'));
app.use('/api', require('./controllers/items'));

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port + ' on ' + Date());
