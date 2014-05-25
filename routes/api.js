/*
  Define different REST-api based routes
  will generate JSON-based replies on URLs below /api/
  (like /api/employees etc.)

  Please note:
  Register each route as this
  routes["METHOD:url"] = obj  
  where METHOD is GET, POST, PUT or delete
  and url is an url below /api
  the object should have the following mandatory properties:
    model : "Modelname",
    response: a function that will recieve obj, res, req, model
    ... it should be used to return a response through a call to res
  and can have the following optional properties:
    query: function recieving req-obj, returning a query object
      (or [for query-types with multiple arguments] an array of arguments)
    queryType: defaults to "find" if omitted
*/