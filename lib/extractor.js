'use strict';

var Promise = require('bluebird');
var path = require('path');

var Extractor = function(){
  // The Python script to call
  this.scriptFile = path.resolve(path.dirname(__filename), '../scripts/fetch_metadata.py');

};

Extractor.prototype.extract = function(url, callback) {
  require('child_process').execFile(this.scriptFile, [url], {}, function(err, stdout, stderr){
    if(err) {
      try {
        var jsonOutput = JSON.parse(stdout).error;
        return callback(new Error(jsonOutput), null);
      } catch (exception) {
        return callback(err, null);
      }
    }
    callback(null, JSON.parse(stdout));
  });
};

Promise.promisifyAll(Extractor);
Promise.promisifyAll(Extractor.prototype);

module.exports = new Extractor();

