// Schema for Employee;
exports.schema = {
  pno: Number,
  firstname: String,
  lastname: String,
  salary: Number,
  departmentId: String,
  age: Number,
};

// API routes for Employee
var routes = exports.routes = {};



// Create a new employee
routes["POST:employees"] = {
  response: function(obj, res, req, models){
    var employee = new models.Employee(req.body);
    employee.save();
    res.json(employee);
  }
};

// Update an employee
routes["PUT:employees/:id"] = {
  queryType: "findByIdAndUpdate",
  query: function(req){
    var b = req.body;
    delete b._id;
    return [
      req.params.id,
      { $set: b},
      {upsert: true}
    ];
  },
  response: function(obj,res){ res.json(true); }
};

// Delete an employee
routes["DELETE:employees/:id"] = {
  queryType: "remove",
  query: function(req){ return {_id: req.params.id}; },
  response: function(obj, res){ return res.json(true); }
};