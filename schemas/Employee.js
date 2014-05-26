// Schema for Employee;
exports.schema = {
  pno: Number,
  firstname: String,
  lastname: String,
  salary: Number,
  departmentId: String
};

// Require autoREST-library
var autoREST = require("../libs/autoREST");

// API routes for Employee
var routes = exports.routes = autoREST.buildRoutes(
  "Employee", "employees:ALL"
);

// List of employeers - modify with a join on department
autoREST.modify(routes["GET:employees"],{
  populate: {
    join: "Department",
    joinOn: ["departmentId", "_id"],
    filter: "name",
    toProperty: "department"
  }
});

// One employee - modify with join on department
// (reusing the join from our previous route)
autoREST.modify(routes["GET:employees/:id"],{
  populate: routes["GET:employees"].populate
});

// Return a list of employees in a certain department
autoREST.add(routes,"GET:employees/department/:id",{
  query: function(req){ return {departmentId: req.params.id}; }
});