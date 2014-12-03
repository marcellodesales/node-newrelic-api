var utils = require("../").utils;

var hostname = utils.getHostname();

console.log("Your Hostname: " + hostname);

var headCommitSha = utils.getGitHeadSHA();

console.log("Head SHA: " + JSON.stringify(headCommitSha));
