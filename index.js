#!/usr/bin/env node

var fs = require('fs');

var deployObject = fs.existsSync('./deploy.json') ? fs.readFileSync('./deploy.json', 'utf8') :
  process.argv[2] && fs.existsSync(process.argv[2]) ? fs.readFileSync(process.argv[2]) : null;

if (!deployObject) {
  throw 'Please create a deploy.json file with proper configuration, or provide a path to a suitable json file';
}

// convert to object
try {
  deployObject = JSON.parse(deployObject);
} catch (e) {
  throw 'Deploy JSON invalid: ' + e;
}

// ensure it is an object
if (!(deployObject instanceof Object)) {
  throw 'Deploy JSON invalid';
}

// check for necessary properties
var propertyCheck = '';
if (!deployObject.svnPath) {
  propertyCheck += '[Missing svnPath]';
}
if (!deployObject.deployPath) {
  propertyCheck += '[Missing deployPath]';
}
if (!deployObject.svnUser) {
  propertyCheck += '[Missing svnUser]';
}
if (!deployObject.svnPassword) {
  propertyCheck += '[Missing svnPassword]';
}
if (!deployObject.gitUser) {
  propertyCheck += '[Missing gitUser]';
}
if (!deployObject.gitPassword) {
  propertyCheck += '[Missing gitPassword]';
}
if (propertyCheck) {
  throw propertyCheck;
}

// input check complete, run modules
require('./mods/svn')(deployObject, function (err) {
  if (err) {
    throw err;
  }
  require('./mods/git')(deployObject, function (err) {
    if (err) {
      throw err;
    }
    console.log('DEPLOY COMPLETE');
  });
});
