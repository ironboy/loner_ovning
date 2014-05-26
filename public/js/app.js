// Declare app level module which depends on services 
var app = angular.module('myApp', ["ngResource"]).config([
  '$routeProvider',
  '$locationProvider',
  function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when("/employees", {
        templateUrl: "partials/index.jade",
        controller: "EmployeesIndexCtrl"
      })
      .when("/employees/new", {
        templateUrl: "partials/edit.jade",
        controller: "EmployeesEditCtrl"
      })
      .when("/employees/new/:depId", {
        templateUrl: "partials/edit.jade",
        controller: "EmployeesEditCtrl"
      })
      .when("/employees/:id", {
        templateUrl: "partials/show.jade",
        controller: "EmployeesShowCtrl"
      })
      .when("/employees/department/:id", {
        templateUrl: "partials/showDepartment.jade",
        controller: "EmployeesDepartmentCtrl"
      })
      .when("/employees/:id/edit", {
        templateUrl: "partials/edit.jade",
        controller: "EmployeesEditCtrl"
      })
      .when("/employees/:id/delete", {
        templateUrl: "partials/show.jade",
        controller: "EmployeesDestroyCtrl"
      })
      .otherwise({
        redirectTo: "/employees"
      });
    }
]);