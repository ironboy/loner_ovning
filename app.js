// Some basic setup
var express = require('express');
var routes = require('./routes');
var api = require('./routes/api');

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

// Require the schemas and build models
// (just add your schemas to the schema array)
var schemas = ["Employee","Department"];
var model = {};
for(var i = 0; i < schemas.length; i++){
  model[schemas[i]] = mongoose.model(
    schemas[i],
    mongoose.Schema(
      require("./schemas/" + schemas[i])[schemas[i] + "Schema"]
    )
  );
}

// Register routes from api.js
for(var i in api.routes){
  (function(){
    var route = api.routes[i];
    var path = i.split(':');
    var method = path.shift().toLowerCase();
    path = path.join(':');
    console.log("Registering api paths",method,path);
    app[method]("/api/" + path,function(req,res){
      if(!route.query){
        route.response({},res,req,model[route.model]);
        return;
      }
      model[route.model][route.queryType || "find"](route.query(req),function(err,obj){
        if(err){
          console.log("API error",err);
          res.json([]);
        }
        else {
          route.response(obj,res,req,model[route.model]);
        }
      });
    });
  })();
}

// Old type routes
/*app.get('/api/contacts', api.contacts);
app.get('/api/contacts/:id', api.contact);
app.post('/api/contacts', api.createContact);
app.put('/api/contacts/:id', api.updateContact);
app.delete('/api/contacts/:id', api.destroyContact);*/

app.get('*', routes.index);

// Start the server on port 3000
app.listen(3000, function(){
  // Log some info about the server to the console
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
