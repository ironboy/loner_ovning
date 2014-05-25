// Schema for Departments;
exports.schema = {
  name: String,
  streetAdress: String,
  zipCode: String,
  town: String,
  info: String
};

// API routes for Department
var routes = exports.routes = {};

routes["GET:departments"] = {
  query: function(req){ return {}; },
  response:  function(arr,res){ res.json(arr); }
};

routes["GET:departments/:id"] = {
  queryType: "findOne",
  query: function(req){ return {_id: req.params.id}; },
  response:  function(obj,res){ res.json(obj); }
};