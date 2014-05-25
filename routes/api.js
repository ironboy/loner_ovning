/*
  Define different REST-api based routes
  will generate JSON-based replies on URLs below /api/
  (like /api/employees etc.)

  Please note:
  Register each route as this
  routes["METHOD:url"] = obj  
  where METHOD is GET, POST, PUT or delete
  and url is an url below /api
  the object should have the following mandatory properties:
    model : "Modelname",
    response: a function that will recieve obj, res, req, model
    ... it should be used to return a response through a call to res
  and can have the following optional properties:
    query: function recieving req-obj, returning a query object
      (or [for query-types with multiple arguments] an array of arguments)
    queryType: defaults to "find" if omitted
*/

var routes = {};

routes["GET:contacts"] = {
  model: "Contact",
  query: function(req){ return {}; },
  response: function(obj,res){ res.json(obj); }
};


routes["GET:contacts/:id"] = {
  model: "Contact",
  queryType: "findOne",
  query: function(req){ return {_id: req.params.id}; },
  response: function(obj,res){ res.json(obj); }
};

routes["POST:contacts"] = {
  model: "Contact",
  response: function(obj, res, req, model){
    var employee = new model(req.body);
    employee.save();
    res.json(req.body);
  }
};

routes["PUT:contacts/:id"] = {
  model: "Contact",
  queryType: "findByIdAndUpdate",
  query: function(req){
    return [
      req.params.id,
      {
        $set: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          age: req.body.age
        }
      },
      {upsert: true}
    ];
  },
  response: function(obj,res){ return res.json(true); }
};

routes["DELETE:contacts/:id"] = {
  model: "Contact",
  queryType: "remove",
  query: function(req){ return {_id: req.params.id}; },
  response: function(obj, res){ return res.json(true); }
};

// Export the routes
exports.routes = routes;