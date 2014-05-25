// Connect to mongo.db via mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wages_database');

// Export the connection
exports.mongoose = mongoose;