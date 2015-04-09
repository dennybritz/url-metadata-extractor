'use strict';

var moment = require('moment');
var _ = require('underscore');
var request = require('superagent');
var Promise = require('bluebird');
var cheerio = require('cheerio');
var entities = require("entities")

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
    var content = $(this).attr('content');
    if(name && content){
      // JSON objects aren't allowed to contain dots - flatten it
      name = name.replace('.', ':').toLowerCase();
      var value = entities.decodeHTML(content);
      result[name] = value;
    }
    return result;
  }).get();
  var metadataObj = _.reduce(metadataObjects, function(a,b){
    return _.extend(a,b);
  }, {});
  return metadataObj;
};

Extractor.prototype.findCanonicalUrl = function(html) {
  var $ = cheerio.load(html);
  var canonicalLink = $('link[rel=canonical]').attr('href');
  return canonicalLink;
};

Extractor.prototype.findDate = function(html) {
  var $ = cheerio.load(html);

  // E.g. <span class="date" data-time="1423843260">Feb 13, 2015 4:01 pm UTC</span>
  var dateClass = moment.utc($('.date').data('time') * 1000 || null);
  var dateClass = dateClass.isValid() ? dateClass.format() : undefined;

  // Eg <time itemprop="datePublished">April 8, 2015 9:01 PM PDT</time
  var datePublishedItemProp = moment.utc($('time[itemprop=datePublished]').text());
  datePublishedItemProp = datePublishedItemProp.isValid() ? datePublishedItemProp.format() : undefined;

  var dailyMail = moment.utc($('.article-timestamp-published').text());
  dailyMail = dailyMail.isValid() ? dailyMail.format() : undefined;

  return datePublishedItemProp || dateClass || dailyMail;
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
    metadata.datepublished ||
    metadata.pub_date ||
    metadata['sailthru:date'] ||
    metadata.displaydate ||
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
  // Get the url
  var pageUrl = this.findCanonicalUrl(html) || metadata.url || url;
  var metadata = _.defaults({}, {url: pageUrl}, metadata);
  // Add the date
  metadata = _.defaults(metadata, {date: this.findDate(html)});
  return metadata;
};

Promise.promisifyAll(Extractor);
Promise.promisifyAll(Extractor.prototype);

module.exports = new Extractor();

