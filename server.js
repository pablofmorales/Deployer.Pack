var express = require('express');

var server = express(),
  fs = require("fs");

var http = require('http');

var branch = '01.01';

server.get('/', function(request, response){
  response.send('Deployer ');
});

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
          throw err;
        }

        if (files.length > 0) { 
          var last = files.pop();
          var ver = last.split('.');

          console.log(ver[1] + '.' + ver[2]);
          if (ver[1] + '.' + ver[2] != branch) {
            version = branch + '.01';
          } else {
            var newTag = parseInt(ver[3]) + 1;
            if (newTag < 10) {
              newTag = '0' + newTag;
            }
            version = ver[1] + '.'+ver[2]+ '.'+ newTag;
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
          version = ver[1] + '.' + ver[2] + '.' + ver[3];
          response.send(version);
        } else {
          response.send(branch + '.01');
        } 
      });
    }
  });
});

server.get('/artifactory/:project/:version', function(request, response) {
  
  var project = request.params.project;
  var version = request.params.version; 
  var artifactoryName = project + '.' + version + '.tar.gz';
  var path = 'repository/' + project + '/' + artifactoryName;
  
  fs.exists(path, function (exists) {
    var artifactory = fs.statSync(path);
    response.writeHead(200, {
      'Content-Type': 'application/x-gzip',
      'Content-Length': artifactory.size,
      'Content-Disposition': 'inline; filename="' + artifactoryName + '"' 
    });
  });
  var readStream = fs.createReadStream(path);
  readStream.pipe(response);

});

server.listen(3000);
