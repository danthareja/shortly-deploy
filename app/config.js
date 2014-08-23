// *********** Mongoose and mongodb ******************** //
var mongoose = require('mongoose');

// Handle local dev and production
var mongoHost =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/shortly';

// Write connect function to export across modules
mongoose.connect(mongoHost);

// From mongoose homepage
var dbm = mongoose.connection;
dbm.on('error', console.error.bind(console, 'connection error:'));
dbm.once('open', function () {
  console.log("woo mongoose is open @: ", mongoHost);
});
