var mongoose = require('mongoose');
var crypto = require('crypto');

// *********** Mongoose and mongodb ******************** //

// A mongoose schema defines a table
var linkSchema = mongoose.Schema({
  url: { type: String },
  base_url: { type: String },
  code: { type: String },
  title: { type: String },
  visits: { type: Number, default: 0 },
  dateCreated: { type: Date, default: Date.now }
});

linkSchema.pre('save', function(next) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next(); // Don't forget your nexts!
});

// A mongoose model instantiates a mongo collection (adds 's' to collection name)
var Link = mongoose.model('link', linkSchema);

module.exports = Link;


