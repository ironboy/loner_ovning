app.controller("EmployeesDestroyCtrl", function($scope, $routeParams, $location, Employee) {
 
  Employee.destroy({ id: $routeParams.id });
  $location.path("/employees");
  
});