var express = require('express'),
  server = express(),
  fs = require("fs");
  http = require('http');

var branch = '01.01';

server.get('/version/:project/new', function(request, response) {
  var newVersion = branch;
  var project = request.params.project;
  var path = 'repository/' + project;
  fs.exists(path, function(exists) {
    if (exists == false) {
      response.send('Project ' + project + ' not exists');  
    } else {
      fs.readdir(path, function(err, files){ 
        if (err) {
          response.send("Some error");
        }

        if (files.length > 0) { 
          var last = files.pop();
          var ver = last.split('.');

          if (ver[1] != branch) {
            version = branch + '.01';
          } else {
            var newTag = parseInt(ver[2]) + 1;
            if (newTag < 10) {
              newTag = '0' + newTag;
            }
            version = ver[1] + '.' + newTag;
          }
          response.send(version);
        } else {
          response.send(branch + '.01');
        } 
      });
    }
  });
  
});

server.get('/version/:project', function(request, response) {
  var project = request.params.project;
  var path = 'repository/' + project;
  fs.exists(path, function(exists) {
    if (exists == false) {
      response.send('Project ' + project + ' not exists');  
    } else {
      fs.readdir(path, function(err, files){ 
        if (err) {
          throw err;
        }

        if (files.length > 0) { 
          var last = files.pop();
          var ver = last.split('.');
          version = ver[1] + '.' + ver[2];
          response.send(version);
        } else {
          response.send(branch + '.01');
        } 
      });
    }
  });
});

server.post('/deploy/:project/:version', function(request, response) {
  // Get The File
  // unzip the project
  // sync the project with the server
  
  var project = request.params.project;
  var version = request.params.version;
  var path = 'repository/' + project + '.' + version + '.tar.gz';
  
  fs.exists(path, function (exists) {
    var artifactory = fs.statSync(path);

    response.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': file.size
    });


  });
  var readStream = fs.createReadStream(path);
  readStream.pipe(response);

});

server.listen(3000);

