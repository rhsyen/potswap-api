var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var saltRounds = 10;
var Schema = mongoose.Schema;

function setPassword(val) {
    var hash = bcrypt.hashSync(val, saltRounds);
    return hash;
}

var UserSchema = new Schema({
  email: String,
  password: {
      type: String,
      set: setPassword
  },
  name: String
});

module.exports = mongoose.model('User', UserSchema);
