// Schema for Employee;
exports.schema = {
  pno: Number,
  firstname: String,
  lastname: String,
  salary: Number,
  departmentId: String,
  age: Number,
};

// Methods for Employee
exports.methods = {
  getDepartment: function(model, callback){
    model.Department.findOne(
      {_id: this.departmentId },
      function(err,department){ callback(department); }
    );
  }
};

// API routes for Employee
var routes = exports.routes = {};

routes["GET:employees"] = {
  query: function(req){ return {}; },
  response:  function(arr,res, req, model){
    var newArr = [];
    arr.forEach(function(obj){
      obj.getDepartment(model, function(department){
        obj = obj.toObject();
        obj.department = department ? department.name : '';
        newArr.push(obj);
        if (newArr.length == arr.length){
          res.json(newArr);
        }
      });
    });
  }
};


routes["GET:employees/:id"] = {
  queryType: "findOne",
  query: function(req){ return {_id: req.params.id}; },
  response:  function(obj,res, req, model){
    obj.getDepartment(model, function(department){
      obj = obj.toObject();
      obj.department = department ? department.name : '';
      res.json(obj);
    });
  }
};

routes["POST:employees"] = {
  response: function(obj, res, req, model){
    var employee = new model.Employee(req.body);
    employee.save();
    res.json(req.body);
  }
};

routes["PUT:employees/:id"] = {
  queryType: "findByIdAndUpdate",
  query: function(req){
    return [
      req.params.id,
      {
        $set: {
          pno: req.body.pno,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          salary: req.body.salary,
          departmentId: req.body.departmentId,
          age: req.body.age
        }
      },
      {upsert: true}
    ];
  },
  response: function(obj,res){ return res.json(true); }
};

routes["DELETE:employees/:id"] = {
  queryType: "remove",
  query: function(req){ return {_id: req.params.id}; },
  response: function(obj, res){ return res.json(true); }
};