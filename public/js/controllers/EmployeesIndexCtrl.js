app.controller("EmployeesIndexCtrl", function($scope, $location, Employee) {
  $scope.employees = Employee.index();

  $scope.new = function() {
    $location.path("/employees/new");
  };
});