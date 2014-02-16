var express = require('express');
var server = express();

server.get('/', function(request, response){
  response.send('Deployer ');
});


server.get('/version/:project/new', function(request, response) {
  debugger;
  response.send("3.20");
});

server.get('/version/:project/', function(request, response) {
  debugger;
  response.send("3.19");
});

server.post('/deploy/:project/', function( request, response) {
});

server.listen(3000);

