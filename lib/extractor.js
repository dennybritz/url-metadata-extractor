'use strict';

var moment = require('moment');
var _ = require('underscore');
var request = require('superagent');
var Promise = require('bluebird');
var cheerio = require('cheerio');

var Extractor = function(){};

Extractor.prototype.extract = function(url, callback) {
  var extractor = this;
  Promise.fromNode(function(callback){
    request.get(url).end(callback);
  }).then(function(res){
    if (res.ok) {
      return callback(null, extractor.getMetadataFromHtml(url, res.text));
    } else {
      return callback(new Error(res.rext), null);
    }
  }).catch(function(err){
    callback(err, null);
  });
};

Extractor.prototype.getMetatagsFromHtml = function(html) {
  var $ = cheerio.load(html);
  var headMetatags = $('head meta');
  var metadataObjects = headMetatags.map(function(){
    var result = {};
    var name = $(this).attr('name') || $(this).attr('property');
    var value = $(this).attr('content');
    result[name] = value;
    return result;
  }).get();
  var metadataObj = _.reduce(metadataObjects, function(a,b){
    return _.extend(a,b);
  }, {});
  return metadataObj;
};

Extractor.prototype.getCommonAttributesFromMetatags = function(metadata){
  var title =
    metadata['og:title'] ||
    metadata['twitter:title'] ||
    metadata.title ||
    null;

  var url =
    metadata['og:url'] ||
    metadata['twitter:url'] ||
    null;

  var description =
    metadata['og:description'] ||
    metadata['twitter:description'] ||
    metadata.description ||
    null;

  var image =
    metadata['og:image'] ||
    metadata['twitter:image'] ||
    null;

  var contentType =
    metadata['og:type'] ||
    null;

  var author =
    metadata.author ||
    metadata['article:author'] ||
    metadata['og:article:author'] ||
    null;

  var site =
    metadata['og:site_name'] ||
    metadata['og:site'] ||
    metadata['twitter:site'] ||
    null;

  var dateStr =
    metadata['article:published_time'] ||
    metadata['og:article:published_time'] ||
    metadata.date ||
    metadata['sailthru.date'] ||
    null;

  var parsedDate = moment.utc(dateStr);
  var date = parsedDate.isValid() ? parsedDate.format() : null;

  return {
    url: url,
    title: title,
    description: description,
    image: image,
    contentType: contentType,
    author: author,
    site: site,
    date: date
  };
};

Extractor.prototype.getMetadataFromHtml = function(url, html) {
  var metatags = _.extend({}, this.getMetatagsFromHtml(html));
  var attributes = _.extend({}, this.getCommonAttributesFromMetatags(metatags));
  var metadata = _.extend({}, {url: url, metatags: metatags}, attributes);
  return metadata;
};

Promise.promisifyAll(Extractor);
Promise.promisifyAll(Extractor.prototype);

module.exports = new Extractor();

