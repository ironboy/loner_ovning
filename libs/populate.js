/*
  The populate module
  for making joins with mongoose.js
  (Thomas Frank 2014)

  Similar to mongoose.js (>=3.6) built in populate
  but a bit simpler...

  Usage

  require("../populate").populate({
    res: res,
    obj: obj,
    join: model,
    joinOn: ["property in model 1","property in model 2"],
    filter: "property1 property2" // only these properties
    toProperty: "new property in model1",
    findOne: true // only one result back (as an object)
  });

  Gets simplified further by being used from the autoREST 
  module, where you only have to express 
  join, joinOn, filter and toProperty

*/

exports.populate = function(settings){
  var s = settings;
  var queryObj = {};
  var results = [];
  if(!s.obj){s.res.json([]); return; }
  s.obj = s.obj.push ? s.obj : [s.obj];
  // Loop through each original result to populate
  // it by our "join"
  s.obj.forEach(function(outerObj){
    // Build or query based on the join condition
    var query = {};
    query[s.joinOn[1]] = outerObj[s.joinOn[0]];
    s.join.find(query,s.filter,function(err,obj){
      // If we only find one object then convert from array to object
      if(obj.length < 2){
        obj = obj[0];
        // If we filter on just one property then just pluck this value
        if(s.filter && s.filter.split(' ').length < 2){
          obj = obj.toObject();
          delete obj._id;
          obj = obj[s.filter];
        }
      }
      results.push(obj);
      // Now we have found all the results from our
      // new "populating queries" so we pack things up...
      if(results.length == s.obj.length){
        finish(s, results);
      }
    });
  });
};

// Finish the output
function finish(s, results){
  var arr = [];
  s.obj.forEach(function(obj,index){
    var o = obj.toObject();
    o[s.toProperty] = results[index];
    arr.push(o);
  });
  // Convert the array to its first object
  // if findOne is set to true
  arr = s.findOne ? arr[0] : arr;
  s.res.json(arr);
}