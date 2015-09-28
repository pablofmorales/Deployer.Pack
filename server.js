var express = require('express');

var server = express(),
  fs = require("fs");

var http = require('http');

var revision = '01.09';

var getLatestVersion = function(files) {
  var latestVersion = [0, 0, 0];
  var latestVersionIndex = 0;
  var tarGzLen = '.tar.gz'.length;

  for (var i = 0; i < files.length; i++) {
    var version = files[i].slice(0, -tarGzLen).split('.').slice(-3).map(Number);
    for (j = 0; j < version.length; j++) {
      if (version[j] > latestVersion[j]) {
        latestVersion = version;
        latestVersionIndex = i;
        break;
      }
      if (version[j] < latestVersion[j]) {
        break;
    }
    }
  }

  return files[latestVersionIndex];
};

server.get('/', function(request, response){
  response.send('Deployer ');
});

server.get('/version/:project/new', function(request, response) {
  var newVersion = revision;
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
          var last = getLatestVersion(files);
          var ver = last.split('.');

          if (ver[1] + '.' + ver[2] != revision) {
            version = revision + '.01';
          } else {
            var newTag = parseInt(ver[3]) + 1;
            if (newTag < 10) {
              newTag = '0' + newTag;
            }
            version = ver[1] + '.'+ver[2]+ '.'+ newTag;
          }
          response.send(version);
        } else {
          response.send(revision + '.01');
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
          var last = getLatestVersion(files);
          var ver = last.split('.');
          version = ver[1] + '.' + ver[2] + '.' + ver[3];
          response.send(version);
        } else {
          response.send(revision + '.01');
        } 
      });
    }
  });
});


server.get('/revision/latest', function(request, response) {
    response.send(revision);
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
