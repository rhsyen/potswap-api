var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  owner: String, // e-mail of owner
  name: String, // Unique per owner
  description: String
  // photos, category
});

module.exports = mongoose.model('Item', ItemSchema);
