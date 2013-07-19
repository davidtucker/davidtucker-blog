var fs = require('fs');
var moment = require('moment');
var path = require('path');
var semver = require('semver');

module.exports.getLongDateString = function() {
	return moment().format('MMMM Do YYYY, h:mm:ss a');
};

module.exports.getShortDateString = function() {
return moment().format('YYYY-MM-DDTHHmm');
};

module.exports.getCurrentVersion = function() {
	var packageJSON = getPackageJSON();
	return packageJSON.version;
};

var getPackageJSON = function() {
  var contents = fs.readFileSync(path.join(process.cwd(), "package.json", {encoding: 'utf8'}));
  var packageJSON = JSON.parse(contents);
  return packageJSON;
};
