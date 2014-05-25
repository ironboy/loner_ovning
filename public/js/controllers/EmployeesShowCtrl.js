app.controller("EmployeesShowCtrl", function($scope, $routeParams, Employee) {
  $scope.employee = Employee.show({ id: $routeParams.id });
});