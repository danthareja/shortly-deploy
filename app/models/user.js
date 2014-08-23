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
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

userSchema.methods.hashPassword = function() {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
    });
};

userSchema.pre('save', function(next) {
  this.hashPassword().then(function(){   // Use then to invoke promise from hashPassword
    next();
  });
});

// A mongoose model instantiates a mongo collection (adds 's' to collection name)
var User = mongoose.model('user', userSchema);

module.exports = User;
