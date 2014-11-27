var accountApi = require("../src/account");
var appsApi = require("../src/applications");
var deploymentsApi = require("../src/deployments");

var utils = require("../lib/utils");

var apiKey = "8cd00a286e9320f60794043d42cae7649c76d50e0b25be2";
var appName = "intuit-sp-sample";

var headCommit = utils.getGitHeadSHA();

console.log(headCommit);

var accounts = accountApi.getSync({apiKey: apiKey});

console.log(accounts);

var app = appsApi.getSync({apiKey: apiKey, appName: appName});

console.log(app);

var deployment = deploymentsApi.getSync({apiKey: apiKey, app: app, git: headCommit});

console.log(deployment);

