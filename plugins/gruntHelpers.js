var fs = require('fs');
var moment = require('moment');
var path = require('path');
var semver = require('semver');

var VERSION_LEVEL_PATCH = "patch";
var VERSION_LEVEL_BUILD = "build";
var VERSION_LEVEL_MINOR = "minor";
var VERSION_LEVEL_MAJOR = "major";

module.exports.getLongDateString = function() {
	return moment().format('MMMM Do YYYY, h:mm:ss a');
};

module.exports.getShortDateString = function() {
return moment().format('YYYY-MM-DDTHHmm');
};

module.exports.incrementBuildBuild = function() {
  incrementBuild(VERSION_LEVEL_BUILD);
};

module.exports.incrementBuildPatch = function() {
  incrementBuild(VERSION_LEVEL_PATCH);
};

module.exports.incrementBuildMinor = function() {
  incrementBuild(VERSION_LEVEL_MINOR);
};

module.exports.incrementBuildMajor = function() {
  incrementBuild(VERSION_LEVEL_MAJOR);
};

module.exports.getCurrentVersion = function() {
	var packageJSON = getPackageJSON();
	return packageJSON.version;
};

var incrementBuild = function(level) {
  var packageJSON = getPackageJSON();
  packageJSON.version = semver.inc(packageJSON.version, level);
  writePackageJSON(packageJSON);
};

var getPackageJSON = function() {
  var contents = fs.readFileSync(path.join(process.cwd(), "package.json", {encoding: 'utf8'}));
  var packageJSON = JSON.parse(contents);
  return packageJSON;
};

var writePackageJSON = function(obj) {
  fs.writeFileSync(path.join(process.cwd(), "package.json"), new Buffer(JSON.stringify(obj, null, 2) + "\n"));
};