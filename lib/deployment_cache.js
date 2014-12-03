/** @module lib/Deployment Caches */

var fs = require("fs");
var utils = require("./utils");
var moment = require("moment-timezone");

/**
 * @return {object} The deploymenet metadata returned while submitting a new deployment.
 */
module.exports.getCachedDeployment = function(appName) {
  if (!appName || appName.length == 0) {
    return null;
  }

  // Create a directory the return null as this is the first time requesting for a cache.
  var dirPath = this.getCacheDir();
  if (!utils.fileExists(dirPath)) {
    utils.mkdir(dirPath);
    return null;
  }

  // Return the deployment file if it exists or null
  var appDeploymentMetadataFile = this.getCacheLocation(appName);
  if (!utils.fileExists(appDeploymentMetadataFile)) {
    return null;
  }

  // Open the depliyment json and return it.
  return utils.openJsonFile(appDeploymentMetadataFile);
};

/**
 * Stores the given metadata to the directory "~/.newrelic-deploys/appname.json"
 */
module.exports.saveDeploymentMetadata = function(metadata) {
  if (!metadata || !metadata.appName || metadata.appName.lenght == 0) {
    return;
  }

  var appDeploymentMetadataFile = this.getCacheLocation(metadata.appName);

  // Store the new metadata
  utils.saveJsonFile(appDeploymentMetadataFile, metadata);
};

/**
 * The cache is stale after a day.
 */
module.exports.isCacheStale = function(appName) {
  var cachedDeploymentMetadata = this.getCachedDeployment(appName);
  if (!cachedDeploymentMetadata) {
    return true;
  }
  var deployedTime = cachedDeploymentMetadata.timestamp;
  var deploymentMoment = moment(deployedTime);
  var nowMoment = moment();
  return nowMoment.diff(deploymentMoment, "day") > 0;
};

/**
 * @return The cache dir where the module will save the deployment metadata.
 */
module.exports.getCacheDir = function() {
  return process.env.HOME + "/.newrelic-deploys";
}

/**
 * @return The cache dir for the given app name.
 */
module.exports.getCacheLocation = function(appName) {
  return this.getCacheDir() + "/" + appName + ".json";
}
