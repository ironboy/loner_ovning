/*
  The auoREST module
  (Thomas Frank 2014) 

  Build routes on a generic model
  that is the same for many restbased entities

  Save time and typing...

  Also creates models from schema modules/includes
  and stores them, all database things - communicating
  with mongoose take place here according to rules
  and routes set in thes files

*/

exports.buildRoutes = function(modelName,what){
  
  // Parse instructions
  var routes = {};
  var path = what.split(':');
  var actions = path[1];
  actions = actions.replace(/ALL/g,'LIST GET POST PUT DELETE');
  actions = actions.split(' ');
  path = path[0];

  // Return a list/whole collection
  actions.indexOf('LIST') >=0 && (routes["GET:" + path] = {
    query: function(req){ return {}; },
    response:  function(arr,res){ res.json(arr); }
  });

  // Return one document from the collection
  actions.indexOf('GET') >=0 && (routes["GET:" + path + "/:id"] = {
    queryType: "findOne",
    query: function(req){ return {_id: req.params.id}; },
    response:  function(obj,res){ res.json(obj); }
  });

  // Create a new document
  actions.indexOf('POST') >=0 && (routes["POST:" + path] = {
    response: function(obj, res, req, models){
      var department = new models[modelName](req.body);
      department.save();
      res.json(department);
    }
  });

  // Update a document
  actions.indexOf('PUT') >=0 && (routes["PUT:" + path + "/:id"] = {
    queryType: "findByIdAndUpdate",
    query: function(req){
      var b = req.body;
      delete b._id;
      return [
        req.params.id,
        { $set: b},
        {upsert: true}
      ];
    },
    response: function(obj,res){ res.json(true); }
  });

  // Delete a document
  actions.indexOf('DELETE') >=0 && (routes["DELETE:" + path + "/:id"] = {
    queryType: "remove",
    query: function(req){ return {_id: req.params.id}; },
    response: function(obj, res){ return res.json(true); }
  });

  return routes;

};

// Modify a route
exports.modify = function(routeObj,modifierObj){
  for(var i in modifierObj){
    routeObj[i] = modifierObj[i];
  }
  if(modifierObj["populate"]){
    routeObj["response"] = function(obj,res,req,models){
      var one = routeObj.queryType == "findOne";
      populator(obj,res,models,one,routeObj["populate"]);
    };
  }
};

// Add a route
exports.add = function(routerObj,path,newRoute){
  routerObj[path] = newRoute;
  if(newRoute.populate){
    newRoute.reponse = function(obj,res,req,models){
      var one = newRoute.queryType == "findOne";
      populator(obj,res,models,one,routeObj["populate"]);
    };
  }
  if(!newRoute.reponse){
    // Won't work for POST... but will for GET:s
    newRoute.response = function(obj,res){ res.json(obj); };
  }
};

// Populator (helper)
var populator = function(obj, res, models, findOne, query){
  require("./populate").populate({
    res: res,
    obj: obj,
    join: models[query.join],
    joinOn: query.joinOn,
    filter: query.filter,
    toProperty: query.toProperty,
    findOne: findOne
  });
};


// Register an api route
function regRoute(route, i, modelName){
  var path = i.split(':');
  var method = path.shift().toLowerCase();
  path = path.join(':');
  console.log("Registering api paths",method,path);
  app[method]("/api/" + path,function(req,res){
    if(!route.query){
      route.response({},res,req,models);
      return;
    }
    var args = route.query(req);
    if(!args.push){args = [args];}
    args.push(function(err,obj){
      if(err){
        console.log("API error",err);
        res.json([]);
      }
      else {
        route.response(obj,res,req,models);
      }
    });
    models[modelName][route.queryType || "find"].apply(
      models[modelName], args
    );
  });
}

// Register a schema, its methods and its routes
var models = {};
function regSchema(schemaName){
  console.log("Registrering schema",schemaName);
  var i, s = require("../schemas/" + schemaName);
  var schema =  mongoose.Schema(s.schema);
  for(i in s.methods){
    schema.methods[i] = s.methods[i];
    console.log("Registering method",schemaName + '.' + i);
  }
  models[schemaName] = mongoose.model(schemaName,schema);
  for(i in s.routes){regRoute(s.routes[i],i,schemaName);}
}

// Register schemas
var app, mongoose;
exports.registerSchemas = function(settings){
  var s = settings;
  app = s.app;
  mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/' + (s.db || s.database));
  // Register schemas
  s.schemas.forEach(regSchema);
};