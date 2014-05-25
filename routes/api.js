// Define different REST-api based routes
// will generate JSON-based replies on URLs below /api/
// (like /api/employees etc.)

// Please note:
// property names should be written as method + path 
// (i.e. "GET:employees") 
// mandatory properties: model, response
// extra properties: queryType (will default to "find"), query
// where query should be a function recieving req and returning
// the query. If no query is set, no database query will run.
// Response will recieve the folowing arguments - obj, res, req, model

var routes = {};

routes["GET:employees"] = {
  model: "Employee",
  query: function(req){ return {}; },
  response: function(obj,res){ res.json(obj); }
};


routes["GET:employee/:id"] = {
  model: "Employee",
  queryType: "findOne",
  query: function(req){ return {_id: req.params.id}; },
  response: function(obj,res){ res.json(obj); }
};

routes["POST:employees"] = {
  model: "Employee",
  response: function(obj, res, req, model){
    var employee = new model(req.body);
    employee.save();
    res.json(req.body);
  }
};


// Export the routes
exports.routes = routes;


// Old code follows
/*
var contactSchema = mongoose.Schema({ firstname: 'string', lastname: 'string', age: 'number' });
var Contact = mongoose.model('Contact', contactSchema);

exports.contacts = function(req, res) {
  Contact.find({}, function(err, obj) {
    res.json(obj);
  });
};

exports.contact = function(req, res) {
  Contact.findOne({ _id: req.params.id }, function(err, obj) {
    res.json(obj);
  });
};

exports.createContact = function(req, res) {
  var contact = new Contact(req.body);
  contact.save();
  res.json(req.body);
};

exports.updateContact = function(req, res) {
  Contact.findByIdAndUpdate(req.params.id, {
    $set: { firstname: req.body.firstname, lastname: req.body.lastname, age: req.body.age }
  }, { upsert: true },
  function(err, obj) {
    return res.json(true);
  });
};

exports.destroyContact = function(req, res) {
  Contact.remove({ _id: req.params.id }, function(err) {
    res.json(true);
  });
};*/