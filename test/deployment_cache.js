var moment = require("moment-timezone");
var cache = require("../").deploymentsCache;
var utils = require("../").utils;

var isStale = cache.isCacheStale("myApp");

console.log("Is cache stale for myApp? MUST BE TRUE " + (isStale == true));

var deployment = { id: 'xyxyxyxyx',
   appName: 'nodejs-sample',
   accountId: '0000000',
   agentId: 'zdzdzd',
   changelog: '[First working version] .',
   description: 'Submitted from mdesales@ubuntu (192.168.248.137).',
   revision: '670383',
   timestamp: '2014-01-02T00:53:02-08:00',
   user: 'username'
};

cache.saveDeploymentMetadata(deployment);

var deploymentFile = cache.getCacheLocation(deployment.appName);
console.log("Deployment cache is at " + deploymentFile);

var cacheLocation = cache.getCacheLocation(deployment.appName);

if (utils.fileExists(cacheLocation)) {
  console.log("Cache Exists at " + cacheLocation);

  var loaded = cache.getCachedDeployment(deployment.appName);
  console.log("Is the deployed and cached the same? MUST BE TRUE " + (JSON.stringify(loaded) === JSON.stringify(deployment)));

  isStale = cache.isCacheStale(deployment.appName);
  console.log("Is cache stale for " + deployment.appName + "? MUST BE TRUE " + (isStale === true));

  deployment.timestamp = moment().format();
  console.log("Saved timestamp... Will save " + JSON.stringify(deployment));

  // Persisting the updated time
  cache.saveDeploymentMetadata(deployment);

  isStale = cache.isCacheStale(deployment.appName);
  console.log("Is cache stale for " + deployment.appName + "? MUST BE FALSE " + (isStale === true));

  console.log("Deleting deployment file at " + deploymentFile);
  utils.deleteFile(deploymentFile);

} else {
  console.log("ERROR: the cache does not exist at " + cacheLocation);
}
