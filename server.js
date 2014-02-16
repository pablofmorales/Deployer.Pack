var express = require('express');
var server = express();

server.get('/', function(request, response){

  response.send('hello world');
  console.log('test');

});


server.get('/test', function(request, response){

  response.send("test2");
});


server.listen(3000);

