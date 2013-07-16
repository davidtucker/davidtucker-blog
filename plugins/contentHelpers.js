var _ = require("underscore");
var fs = require('fs');

module.exports = function(env, callback) {

	env.helpers.getSortedContentFolder = function (folder, contents) {
		return _.chain(contents[folder]._.directories)
			.map(function(item){ return item.index })
			.sortBy(function(item) { return -item.date })
			.value();
	};

	env.helpers.getContentItemByNameFromContentFolder = function (contents, contentFolder, contentName) {
		return contents[contentFolder][contentName].index;
	};

	env.helpers.sequenceFromString = function (initialString) {
		console.log("HTML - SEQ FROM STRING");
		var output;
		var separator = ",";
		output = initialString.split(separator);
		return output;
	};

	env.helpers.numColumnsStringForArray = function(values) {
		if((values.length % 4) == 0) {
			return "3";
		} else if((values.length % 3) == 0) {
			return "4";
		} else if((values.length % 2) == 0) {
			return "6";
		}

		return "6";
	};

	env.helpers.getPathToLocalAssetWithFilename = function(page, assetName) {
		var dirName = page.filename.replace(/\/[^\/]*$/, '');
		return "/" + dirName + "/" + assetName;
	};

	env.helpers.getSitemapElements = function(contents) {
		console.log("GET SME");
		basedir = process.cwd() + "/contents/";
		var elements = env.helpers.getAllPages(contents);
		console.log(elements);
		return elements;
	};

	env.helpers.getAllPages = function(contents) {
		var output = [];
		for (var key in contents) {
			var currentObj = contents[key];
			if(isFile(currentObj) && isSitemapFile(currentObj))
			{
				var fileDetailsObject = fileDetailsFromFileObject(currentObj);
				if(fileDetailsObject)
				{
					output.push(fileDetailsObject);
				}
			}
			else if(isDirectory(currentObj))
			{
				output = output.concat(env.helpers.getAllPages(currentObj));
			}
		}
		return output;
	};

	var isFile = function(currentItem) {
		if(!currentItem)
		{
			console.log("IS FILE - NULL VALUE");
		}
		return currentItem.hasOwnProperty('__filename');
	};

	var isDirectory = function(currentItem) {
		return !currentItem.hasOwnProperty('__filename');
	};

	var isSitemapFile = function(currentItem) {
		console.dir(currentItem);
		var name = currentItem.filepath.relative;
		console.log("Is Sitemap File: " + name);
		return isFilenameSitemapFile(name);
	};

	var isFilenameSitemapFile = function(filename) {
		console.log("Match Filename: " + filename);
		var fileNameRegExp = new RegExp("[A-Za-z0-9_-]*\.(md|json){1}$");
		return filename.match(fileNameRegExp);
	};

	var fileDetailsFromFileObject = function(fileObj) {
		var fileName = getOutputFilename(fileObj);
		if(!fileName)
		{
			return false;
		}

		var output = {};
		output.url = "/" + fileName;

		var stats = fs.statSync(fileObj.__filename);
		output.lastModifiedTime = stats.mtime;

		console.dir(fileObj.metadata);

		if(fileObj.metadata.hasOwnProperty("priority")) {
			console.log("Priority");
			output.priority = fileObj.metadata.priority;
		}

		if(fileObj.metadata.hasOwnProperty("changefreq")) {
			console.log("Change Freq");
			output.changefreq = fileObj.metadata.changefreq;
		}

		return output;
	};

	var getOutputFilename = function(fileObj) {
		var directory = fileObj.__filename.substring(0, fileObj.__filename.lastIndexOf("/")+1);
		var fileName = fileObj.__filename.substring(fileObj.__filename.lastIndexOf("/")+1);
		if(fileObj._metadata && fileObj._metadata.hasOwnProperty('filename'))
		{
			fileName = fileObj.__metadata.filename;
			if(!isFilenameSitemapFile(fileName))
			{
				return;
			}
		}
		else
		{
			fileName = fileName.substring(0, fileName.lastIndexOf(".")+1) + "html";
		}
		return directory + fileName;
	};

	env.helpers.contentDir = function(message, obj) {
		console.log(message);
		console.dir(obj);
	};

	callback();

};