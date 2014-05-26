app.controller("EmployeesDepartmentCtrl", function($scope, $routeParams, $location, EmployeeDepartment, Department) {

  $scope.department = Department.show({ id: $routeParams.id });

  $scope.employees = EmployeeDepartment.index({ id: $routeParams.id });

  $scope.new = function() {
    $location.path("/employees/new/" + $routeParams.id);
  };
});