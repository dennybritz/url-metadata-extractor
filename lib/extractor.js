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
    // JSON objects aren't allowed to contain dots - flatten it
    if(name){
      name = name.replace('.', ':').toLowerCase();
      var value = $(this).attr('content');
      result[name] = value;
    }
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
    undefined;

  var url =
    metadata['og:url'] ||
    metadata['twitter:url'] ||
    undefined;

  var description =
    metadata['og:description'] ||
    metadata['twitter:description'] ||
    metadata.description ||
    undefined;

  var image =
    metadata['og:image'] ||
    metadata['twitter:image'] ||
    undefined;

  var contentType =
    metadata['og:type'] ||
    undefined;

  var author =
    metadata.author ||
    metadata['article:author'] ||
    metadata['og:article:author'] ||
    undefined;

  var site =
    metadata['og:site_name'] ||
    metadata['og:site'] ||
    metadata['twitter:site'] ||
    undefined;

  var dateStr =
    metadata['article:published_time'] ||
    metadata['og:article:published_time'] ||
    metadata.date ||
    metadata.datePublished ||
    metadata.pub_date ||
    metadata['sailthru:date'] ||
    undefined;

  var parsedDate = moment.utc(dateStr || null);
  var date = parsedDate.isValid() ? parsedDate.format() : undefined;

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
  var metadata = _.extend({}, { metatags: metatags }, attributes);
  var metadata = _.defaults(metadata, {url: url});
  return metadata;
};

Promise.promisifyAll(Extractor);
Promise.promisifyAll(Extractor.prototype);

module.exports = new Extractor();

