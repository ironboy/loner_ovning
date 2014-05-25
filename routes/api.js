// Require the mongoose connection
var mongoose = require("../mongooseConnect").mongoose;


// Require the schemas and build models
// (just add your schemas to the schema array)
var schemas = ["Employee","Department"];
var model = {};
for(var i = 0; i < schemas.length; i++){
  model[schemas[i]] = mongoose.model(
    schemas[i],
    mongoose.Schema(
      require("../schemas/" + schemas[i])[schemas[i] + "Schema"]
    )
  );
}


// Define different REST-api based routes
// will generate JSON-based replies on URLs below /api/
// (like /api/employees etc.)
var routes = [];

routes.push({
  path: "employees",
  method: "get",
  func: function(req,res){
    model.Employee.find({},function(err,obj){
      res.json(obj);
    });
  }
});

// Export the routes
exports.routes = routes;

// Old code follows

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
};