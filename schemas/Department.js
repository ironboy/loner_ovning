// Schema for Departments;
exports.schema = {
  name: String,
  streetAddress: String,
  zipCode: String,
  town: String,
  info: String
};

// Require autoREST-library
var autoREST = require("../libs/autoREST");

// API routes for Department
var routes = exports.routes = autoREST.buildRoutes(
  "Department", "departments:ALL"
);