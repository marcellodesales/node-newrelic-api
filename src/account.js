/** @module Accounts */

"use strict";

var restify = require("restify");
var xml2js = require("xml2js");
var xmlParser = new xml2js.Parser();
var deasync = require("deasync");

var utils = require("../").utils;

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
  var client = restify.createStringClient({
    url: "https://api.newrelic.com",
    headers: headers
  });

  // The request opjects
  client.get({path: "/api/v1/accounts.xml" } , function(err, req, res, accountXml) {
    if (err) {
      throw new Error("API ERROR:" + err);
    }
    // Close the connection with the client.
    client.close();

    // Parse the xml output from the server.
    xmlParser.parseString(accountXml, function(err, accountJson) {
      if (err) {
        return callback(err, null);
      }
      var account = accountJson.accounts.account[0];

      // transform array objects into strings when possible
      utils.camelizeProperties(account);

      // Delete what it's not needed
      delete account.id;
      delete account.partnerExternalIdentifier;
      delete account.phoneNumber;
      delete account.allowRailsCore;
      delete account.subscription.expiresOn;
      delete account.subscription.numberOfHosts;

      // call the callback
      callback(null, account);
    });
  });
};

/**
 * @return {object} The account information from the sync call.
 */
module.exports.getSync = function(opt) {
  var getSync = deasync(this.get);
  return getSync(opt);
};
