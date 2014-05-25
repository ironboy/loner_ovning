app.controller("ContactsDestroyCtrl", function($scope, $routeParams, $location, Contact) {
 
  Contact.destroy({ id: $routeParams.id });
  $location.path("/contacts");
  
});