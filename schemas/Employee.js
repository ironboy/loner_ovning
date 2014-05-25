// Schema for Employee;
exports.schema = {
  pno: Number,
  firstname: String,
  lastname: String,
  salary: Number,
  departmentId: String
};

// API routes for Employee
var routes = exports.routes = {};

// The equivalent of a join  
// - used to include the department name
// with the employee
var employeePopulator = function(obj, res, models, findOne){
  require("../populate").populate({
    res: res,
    obj: obj,
    join: models.Department,
    joinOn: ["departmentId","_id"],
    filter: "name",
    toProperty: "department",
    findOne: findOne
  });
};

// Return a list of employees
routes["GET:employees"] = {
  query: function(req){ return {}; },
  response:  function(arr,res,req,models){
    employeePopulator(arr,res,models);
  }
};

// Return one employee
routes["GET:employees/:id"] = {
  queryType: "findOne",
  query: function(req){ return {_id: req.params.id}; },
  response:  function(obj,res,req,models){
    employeePopulator(obj,res,models,true);
  }
};

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