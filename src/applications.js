/** @module Applications */

"use strict";

var restify = require("restify");
var deasync = require("deasync");

/**
 * Based on https://rpm.newrelic.com/accounts/xxxxxx/applications/yyyyyy/deployments/instructions",
 * we can submit information about deployments by posting a request to the server using the module.
 * The API is described at
 * https://docs.newrelic.com/docs/apm/apis/new-relic-rest-api-v1/getting-started-new-relic-rest-api-v1#account_id
*/
module.exports.get = function(opt, callback) {
  // client HTTP headers
  var headers = {};
  headers["x-api-key"] = opt.apiKey;

  // HTTP client object
  var client = restify.createJsonClient({
    url: "https://api.newrelic.com",
    headers: headers
  });

  var formData = {};
  formData["filter[name]"] = opt.appName;

  // The request opjects
  client.post("/v2/applications.json", formData, function(err, req, res, app) {
    if (err) {
      callback(err, null);
    }
    // Close the connection with the client.
    client.close();

    app.applications.forEach(function(app) {
      if (app.name === opt.appName) {
        delete app.settings;
        delete app.links;
        callback(null, app);
      }
    });
  });
};

module.exports.getSync = function(opts) {
  var getSync = deasync(this.get);
  return getSync(opts);
};
