/** @module Deployments */

"use strict";

var restify = require("restify");
var xml2js = require("xml2js");
var xmlParser = new xml2js.Parser();

var utils = require("../").utils;
var cache = require("../").deploymentsCache;

/**
 * Based on https://rpm.newrelic.com/accounts/xxxxx/applications/yyyyyy/deployments/instructions",
 * we can submit information about deployments by posting a request to the server using the module.
 * The API is described at
 * https://docs.newrelic.com/docs/apm/apis/new-relic-rest-api-v1/getting-started-new-relic-rest-api-v1#account_id
 */
module.exports.get = function(opt, callback) {
  if (!opt.app || !opt.app.id) {
    throw new Error("You must provide the app with its id");
  }  

  // client HTTP headers
  var headers = {};
  headers["x-api-key"] = opt.apiKey;

  // HTTP client object
  var client = restify.createStringClient({
    url: "https://api.newrelic.com",
    headers: headers
  });

  var formData = {};
  formData["deployment[application_id]"] = opt.app.id;
  formData["deployment[description]"] = "Submitted from " + utils.userAtHost() + " (" + utils.hostIp() + ").";
  formData["deployment[revision]"] = opt.git.sha;
  formData["deployment[changelog]"] = opt.git.msg;
  formData["deployment[user]"] = process.env.USER;

  if (!cache.isCacheStale(opt.app.name)) {
    var deployRecord = cache.getCachedDeployment(opt.app.name);
    callback(null, deployRecord);
  }

  // The request opjects
  client.post("/deployments.xml", formData, function(err, req, res, deploymentXml) {
    if (err) {
      throw new Error("API ERROR:" + err);
    }
    // Close the connection with the client.
    client.close();
        
    // Parse the xml output from the server.
    xmlParser.parseString(deploymentXml, function(err, deploymentJson) {
      if (err) {
        return callback(err, null);
      }
      // stringify it and parse it back https://github.com/Leonidas-from-XIV/node-xml2js#so-you-wanna-some-json
      var json = JSON.stringify(deploymentJson.deployment);
      var deployment = JSON.parse(json);

      // transform array objects into strings when possible "my-account-number" -> myAccountNumber
      utils.camelizeProperties(deployment);

      var deployRecord = {
        id: deployment.id,
        appName: opt.app.name,
        accountId: deployment.accountId,
        agentId: deployment.agentId,
        changelog: deployment.changelog,
        description: deployment.description,
        revision: deployment.revision,
        timestamp: deployment.timestamp,
        user: deployment.user
      };

      // Caching the metadata
      cache.saveDeploymentMetadata(deployRecord);
       
      // Delete what it's not needed
      callback(null, deployRecord);
    });
  });
};
