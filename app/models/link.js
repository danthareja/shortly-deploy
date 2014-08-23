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
  shasum.update(this.get('url'));
  this.set('code', shasum.digest('hex').slice(0, 5));
});

// A mongoose model instantiates a mongo collection (adds 's' to collection name)
var Link = mongoose.model('link', linkSchema);

// // *********** Bookshelf and sqlite ******************* //
// var db = require('../config');

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function(){
//     this.on('creating', function(model, attrs, options){
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

module.exports = Link;

