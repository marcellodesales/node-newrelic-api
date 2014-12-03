var accountApi = require("../src/account");
var appsApi = require("../src/applications");
var deploymentsApi = require("../src/deployments");

var utils = require("../lib/utils");

var apiKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
var appName = "PACKAGE_JSON_APP_NAME";

var headCommit = utils.getGitHeadSHA();

console.log(headCommit);

var accounts = accountApi.getSync({apiKey: apiKey});

console.log(accounts);

var app = appsApi.getSync({apiKey: apiKey, appName: appName});

console.log(app);

var deployment = deploymentsApi.getSync({apiKey: apiKey, app: app, git: headCommit});

console.log(deployment);

