// Schema for Contact;
exports.schema = {
  firstname: String,
  lastname: String,
  age: Number
};

// Methods for Contact
exports.methods = {
  sayHi: function(){
    console.log("Hi I am " + this.firstname);
  },
  sayBye: function(){
    console.log("Bye I am " + this.lastname);
  }
};

// API routes for Contact
var routes = exports.routes = {};

routes["GET:contacts"] = {
  model: "Contact",
  query: function(req){ return {}; },
  response: function(obj,res){  res.json(obj); }
};


routes["GET:contacts/:id"] = {
  model: "Contact",
  queryType: "findOne",
  query: function(req){ return {_id: req.params.id}; },
  response: function(obj,res){ res.json(obj); }
};

routes["POST:contacts"] = {
  model: "Contact",
  response: function(obj, res, req, model){
    var employee = new model(req.body);
    employee.save();
    res.json(req.body);
  }
};

routes["PUT:contacts/:id"] = {
  model: "Contact",
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
  model: "Contact",
  queryType: "remove",
  query: function(req){ return {_id: req.params.id}; },
  response: function(obj, res){ return res.json(true); }
};