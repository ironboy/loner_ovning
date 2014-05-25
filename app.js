// Some basic setup
var express = require('express');
var routes = require('./routes');

var app = module.exports = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Main (non-ajax/REST routes)
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// Require the mongoose connection
var mongoose = require("./mongooseConnect").mongoose;

// Register an api route
function regRoute(route, i, modelName){
  var path = i.split(':');
  var method = path.shift().toLowerCase();
  path = path.join(':');
  console.log("Registering api paths",method,path);
  app[method]("/api/" + path,function(req,res){
    if(!route.query){
      route.response({},res,req,model);
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
        route.response(obj,res,req,model);
      }
    });
    model[modelName][route.queryType || "find"].apply(
      model[modelName], args
    );
  });
}

// Register a schema, its methods and its routes
var model = {};
function regSchema(schemaName){
  console.log("Registrering schema",schemaName);
  var i, s = require("./schemas/" + schemaName);
  var schema =  mongoose.Schema(s.schema);
  for(i in s.methods){
    schema.methods[i] = s.methods[i];
    console.log("Registering method",schemaName + '.' + i);
  }
  model[schemaName] = mongoose.model(schemaName,schema);
  for(i in s.routes){regRoute(s.routes[i],i,schemaName);}
}

// Register all schemas
[
  "Employee",
  "Department"
].forEach(regSchema);


// Take care of routes not defined
// (important that this comes last 
//  - after all routes have been defined)
app.get('*', routes.index);

/*var p = new model.Department({
  name: "Development",
  streetAdress: "Main Street 1",
  zipCode: "111 11",
  town: "Maintown",
  info: "We wage it everyday!"
});
p.save();
console.log(p);

model.Contact.find({},function(err,found){
  found.forEach(function(x){
    x.departmentId = p._id;
    x.save();
  });
});*/


// Start the server on port 3000
app.listen(3000, function(){
  // Log some info about the server to the console
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
