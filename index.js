// require dependencies
var util = require('util'),
    when = require('when')

// Redis setup
var redis = require("redis");
var client;

// Private variables and functions
var settings;
var debug = false;

var saveJSON = function(key, json) {
  var string = JSON.stringify(json);
  return when.promise(function(resolve, reject) {
    client.set(key, string);
    resolve();
  });
}

var fetchJSON = function(key, fallback) {
  if (fallback === undefined) {
    fallback = {};
  }

  return when.promise(function(resolve,reject) {
    client.get(key, function(err, reply) {
      if (reply === null) {
        return resolve(fallback);
      }

      var json = JSON.parse(reply.toString());
      return resolve(json);
    });
  });
}

var log = {
  info: function (message) {
    if (debug) {
      console.info(message);
    }
  }
}

// Public functions
var redisStorage = {
  init: function(_settings) {
    settings = _settings;
    log.info("initialized with settings:");
    log.info(util.inspect(settings));
    // init redis client connection
    client = redis.createClient(settings.redis);

    return when.promise(function(resolve,reject) {
      resolve();
    });
  },

  getFlows: function() {
    log.info("getFlows called");
    return fetchJSON('nr:flows', [])
  },

  saveFlows: function(flows) {
    log.info("saveFlows called with:");
    log.info(flows);
    return saveJSON('nr:flows', flows);
  },

  getCredentials: function() {
    log.info("getCredentials called");
    return fetchJSON('nr:credentials');
  },

  saveCredentials: function(credentials) {
    log.info("saveCredentials called with:");
    log.info(credentials);
    return saveJSON('nr:credentials', credentials);
  },

  getSettings: function() {
    log.info("getSettings called");
    return fetchJSON('nr:settings');
  },

  saveSettings: function(newSettings) {
    log.info("saveSettings called with:");
    log.info(util.inspect(newSettings));
    return saveJSON('nr:settings', newSettings);
  },

  getSessions: function() {
    log.info("getSessions called");
    return fetchJSON('nr:sessions');
  },

  saveSessions: function(sessions) {
    log.info("saveSessions called with:");
    log.info(util.inspect(sessions));
    return saveJSON('nr:sessions', sessions);
  },

  getLibraryEntry: function(type, path) {
    log.info("getLibraryEntry called with:");
    log.info("type: " + type);
    log.info("path: " + path);

    return when.promise(function(resolve,reject) {
      if (path[0] === "/") {
        // List out the library files in the directory
        var _path = path.substr(1); // drop leading slash
        var prefix = "nr:lib:" + type + ":" + _path + "*";
        client.keys(prefix, function(err, replies) {
          var entries = [];

          replies.forEach(function(reply, i) {
            var filepath = reply.substr(prefix.length - 1);
            if (filepath[0] === "/") {
              filepath = filepath.substr(1);
            }
            if (filepath.includes("/")) {
              var entry = filepath.split("/")[0];
            } else {
              var entry = {fn: filepath};
            }
            entries.push(entry);
          });

          return resolve(entries);
        });
      } else {
        // return the content of the requested library file
        var key = "nr:lib:" + type + ":" + path;
        client.get(key, function(err, reply) {
          var json = JSON.parse(reply.toString());
          return resolve(json.body);
        });
      }
    });
  },

  saveLibraryEntry: function(type, path, meta, body) {
    log.info("saveLibraryEntry called with:");
    log.info("type: " + type);
    log.info("path: " + path);
    log.info("meta: " + util.inspect(meta));
    log.info("body: " + body);

    var key = "nr:lib:" + type + ":" + path;
    var entry = {meta: meta, body: body};
    return saveJSON(key, entry)
  }
}

module.exports = redisStorage;
