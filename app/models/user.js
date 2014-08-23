var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

// *********** Mongoose and mongodb ******************** //

// A mongoose schema defines a table
var userSchema = mongoose.Schema({
  username: { type: String, unique: true, required: true, dropDups: true },
  password: { type: String, require: true },
  dateCreated: { type: Date, default: Date.now }
});

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  console.log("'this' is ,", this)
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    console.log("Compare password called, returning: ", isMatch);
    callback(isMatch);
  });
};

userSchema.methods.hashPassword = function() {
  console.log("inside hashPassword, 'this' is ", this);
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      console.log("password has been hashed! ", this.password);
    });
};

userSchema.pre('save', function(next) {
  this.hashPassword().then(function(){
    console.log("pre save, 'this' is ", this);
    next();
  });
});

// A mongoose model instantiates a mongo collection (adds 's' to collection name)
var User = mongoose.model('user', userSchema);

module.exports = User;


// // *********** Bookshelf and sqlite ******************* //
// var db = require('../config');

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function(){
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function(){
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

