var accountApi = require("../").accountApi;
var appsApi = require("../").appApi;
var deploymentsApi = require("../").deploymentsApi;

var utils = require("../").utils;

var apiKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
var appName = "PACKAGE_JSON_APP_NAME";

var headCommit = utils.getGitHeadSHA();

console.log(headCommit);

accountApi.get({ apiKey: apiKey }, function(err, accounts) {
  if (err) {
    console.log("ERROR: " + err);
    return;
  }

  // Got the accounts
  console.log(accounts);

  appsApi.get({apiKey: apiKey, appName: appName}, function(err, app) {
    if (err) {
      console.log("ERROR: " + err);
      return;
    }

    // Got the app info
    console.log(app);

    deploymentsApi.get({apiKey: apiKey, app: app, git: headCommit}, function(err, deployment) {
      if (err) {
        console.log("ERROR: " + err);
        return;
      }

      // Submitted and returned the deplyment info to new relic
      console.log(deployment);
    });

  });

});
