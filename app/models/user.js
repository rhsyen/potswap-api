var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function setPassword(val) {
    return val + "_processed";
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
