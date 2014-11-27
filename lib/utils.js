/** @module Utils */

var deasync = require('deasync');
var childProcess = require('child_process');

/**
 *  "my-account-number" -> myAccountNumber.
 * @param {string} str Is a given string with dashes "-".
 * @return {string} The camel-case version of the given str.
 * http://stackoverflow.com/a/10425351/433814
 */
function camelize(str) {
  return str[0].toLowerCase() + str.replace(/-([a-z])/g, function(a, b) {
    return b.toUpperCase();
  }).slice(1);
};

/**
 * Change the array object references into String recursively.
 * @param {object} obj Is the obj with properties with dashes and not camelized.
 */
module.exports.camelizeProperties = function(obj) {
  for (var prop in obj) {
    if (!obj.hasOwnProperty(prop)) {
      continue;
    }

    // Fix the key first, by camelizing the property
    if (prop.indexOf("-") >= 0) {
      var value = obj[prop];
      var newProp = camelize(prop);
      obj[newProp] = value;
      delete obj[prop];
      prop = newProp;
    }

    // Fix the value from array to string
    obj[prop] = obj[prop][0];
    if (typeof(obj[prop]) === "object") {
      // if the property "_" is there, use it, that's how xml2js transformed
      obj[prop] = obj[prop]._ ? obj[prop]._ : obj[prop];
      this.camelizeProperties(obj[prop]);
    }
  }
};

/**
 * @return {string} The ip address of the non-loopback interface.
 */
module.exports.hostIp = function() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];

    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
        return alias.address;
    }
  }
  return '0.0.0.0';
};

/**
 * @return {string} The hostname of the current host.
 */
module.exports.getHostname = function() {
  var exec = deasync(childProcess.exec);
  return exec("hostname").replace("\n", "");
};

/**
 * @return {string} The user@host from the current host.
 */
module.exports.userAtHost = function() {
  return process.env.USER + "@" + this.getHostname();
};

function _getHeadSha(callback) {
  var repo = require("gift")(process.env.PWD);
  repo.commits("master", function(err, commits) {
    if (err) {
      callback(err, null);
    }
    callback(null, commits[0]);
  });
};

/**
 * @return {string} The first 7 characters from the HEAD commit in the current dir.
 */
module.exports.getGitHeadSHA = function() {
  var _getLatestSHA = deasync(_getHeadSha);
  var head = _getLatestSHA();
  return {
    sha: head.id.substring(0, 6),
    msg: head.message
  };
};
