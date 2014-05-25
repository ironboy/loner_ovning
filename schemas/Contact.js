// Schema for Contact;
exports.schema = {
  firstname: String,
  lastname: String,
  age: Number,
  departmentId: String
};

// Methods for Contact
exports.methods = {
  getDepartment: function(model, callback){
    model.Department.findOne(
      {_id: this.departmentId },
      function(err,department){ callback(department); }
    );
  }
};

// API routes for Contact
var routes = exports.routes = {};

routes["GET:contacts"] = {
  model: "Contact",
  query: function(req){ return {}; },
  response:  function(arr,res, req, model){
    var newArr = [];
    arr.forEach(function(obj){
      obj.getDepartment(model, function(department){
        obj = obj.toObject();
        obj.department = department.name;
        newArr.push(obj);
        if (newArr.length == arr.length){
          res.json(newArr);
        }
      });
    });
  }
};


routes["GET:contacts/:id"] = {
  queryType: "findOne",
  query: function(req){ return {_id: req.params.id}; },
  response:  function(obj,res, req, model){
    obj.getDepartment(model, function(department){
      obj = obj.toObject();
      obj.department = department.name;
      res.json(obj);
    });
  }
};

routes["POST:contacts"] = {
  response: function(obj, res, req, model){
    var employee = new model.Employee(req.body);
    employee.save();
    res.json(req.body);
  }
};

routes["PUT:contacts/:id"] = {
  queryType: "findByIdAndUpdate",
  query: function(req){
    return [
      req.params.id,
      {
        $set: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          age: req.body.age
        }
      },
      {upsert: true}
    ];
  },
  response: function(obj,res){ return res.json(true); }
};

routes["DELETE:contacts/:id"] = {
  queryType: "remove",
  query: function(req){ return {_id: req.params.id}; },
  response: function(obj, res){ return res.json(true); }
};