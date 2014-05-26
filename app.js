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

// Register all schemas (and their api routes)
require("./libs/autoREST").registerSchemas({
  app: app,
  db: "wages_database",
  schemas: ["Department", "Employee"]
});

// Take care of routes not defined
// (important that this comes last 
//  - after all routes have been defined)
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
