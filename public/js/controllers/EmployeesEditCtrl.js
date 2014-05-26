app.controller("EmployeesEditCtrl", function($scope, $routeParams, $location, Employee, Department) {
 
  if ($routeParams.id) {
    $scope.employee = Employee.show({ id: $routeParams.id });
  } else {
    $scope.employee = new Employee();
  }

  if($routeParams.depId){
    $scope.employee.departmentId = $routeParams.depId;
  }

  $scope.departments = Department.index();

  $scope.submit = function() {

    function success(response) {
      $location.path("/contacts");
    }

    function failure(response) {
      _.each(response.data, function(errors, key) {
        if (errors.length > 0) {
          _.each(errors, function(e) {
            $scope.form[key].$dirty = true;
            $scope.form[key].$setValidity(e, false);
          });
        }
      });
    }

    if ($routeParams.id) {
      Employee.update($scope.employee, success, failure);
    } else {
      Employee.create($scope.employee, success, failure);
    }

  };

  $scope.cancel = function() {
    $location.path("/contacts/"+$scope.employee._id);
  };

  $scope.errorClass = function(name) {
    var s = $scope.form[name];
    return s && s.$invalid && s.$dirty ? "error" : "";
  };

  $scope.errorMessage = function(name) {
    var s = $scope.form[name].$error;
    result = [];
    _.each(s, function(key, value) {
      result.push(value);
    });
    return result.join(", ");
  };
});