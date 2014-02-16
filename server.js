var express = require('express');
var server = express();
var fs = require("fs");

var branch = 3;

server.get('/', function(request, response){
  response.send('Deployer ');
});

server.get('/version/:project/new', function(request, response) {
  debugger;
  var newVersion = branch;
  var project = request.params.project;
  var path = 'repository/' + project;


  try {
    fs.exists(path, function(exists) {
      if (exists == false) {
        response.send('Projects ' + project +' not exists');
      } else {
        fs.readdir(path, function(err, files){ 
          if (files.count > 0) { 
            var ver = files.pop();
            var nver = ver.split('.');
            newVersion = branch + '.' + (parseInt(nver[2]) + 1);
          } else {
            newVersion = branch + '.01';
          }
          response.send(newVersion);
        }); 
      }

    });

  } catch(err) {
    response.send("Some  errors occurred " . err);
  
  }
});

server.get('/version/:project/', function(request, response) {
  debugger;
  response.send("3.19");
});

server.post('/deploy/:project/', function( request, response) {
});

server.listen(3000);

