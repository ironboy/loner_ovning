// Define different REST-api based routes
// will generate JSON-based replies on URLs below /api/
// (like /api/employees etc.)

// Please note:
// Register each route as this
// routes["METHOD:url"] = obj  
// where METHOD is GET, POST, PUT or delete
// and url is an url below /api
// the object should have the following mandatory properties:
//   model : "Modelname",
//   response: a function that will recieve obj, res, req, model
//   ... it should be used to return a response through a call to res
// and can have the following optional properties:
//   query: function recieving req-obj, returning a query object
//   queryType: defaults to "find" if omitted

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