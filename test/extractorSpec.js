'use strict';

var extractor = require('../lib/extractor');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var nock = require('nock');
chai.use(chaiAsPromised);
var expect = chai.expect;

describe('The metadata extractor', function(){
  
  this.timeout(5000);

  it('should work for a Techcrunch article', function(){
    nock('http://techcrunch.com').get('/').replyWithFile(200, 'test/htmls/techcrunch.html');
    return extractor
      .extractAsync('http://techcrunch.com/')
      .then(function(result){
        expect(result.url).to.eql('http://techcrunch.com/2015/01/06/razer-announces-199-open-source-virtual-reality-headset/');
        expect(result.title).to.eql('Razer Announces $199 ‘Open Source’ Virtual Reality Headset');
        expect(result.description).to.eql('The headset, which the company says will arrive this June, is meant to serve as an alternative hardware test bed for developers looking at the VR space.');
        expect(result.image).to.eql('https://tctechcrunch2011.files.wordpress.com/2015/01/img_0023.png?w=680');
        expect(result.date).to.eql('2015-01-06T06:00:51+00:00');
        expect(result.contentType).to.eql('article');
        expect(result.site).to.eql('TechCrunch');
        // TODO: How to get the author?
        expect(result.author).to.be.undefined;
      });
  });

  it('should work for a Youtube video', function(){
    nock('http://youtube.com').get('/').replyWithFile(200, 'test/htmls/youtube.html');
    return extractor
      .extractAsync('http://youtube.com/')
      .then(function(result){
        expect(result.url).to.eql('http://www.youtube.com/watch?v=f5wt8FeHHZM');
        expect(result.title).to.eql('How to Build a Meal Plan! My Tips & Hints! / Construir Un Plan Alimenticio Sano');
        expect(result.description).to.eql('(traduccion abajo) Make your health journey all about you! Building your own meal plan. Download ALL the info in this video and more tips from http://fmck.co...');
        expect(result.image).to.eql('https://i.ytimg.com/vi/f5wt8FeHHZM/maxresdefault.jpg');
        expect(result.contentType).to.eql('video');
        expect(result.site).to.eql('YouTube');
        // TODO: Get author and date
        expect(result.author).to.be.undefined;
        expect(result.date).to.be.undefined;
      });
  });

  it('should work for a mashable article', function(){
    nock('http://mashable.com').get('/').replyWithFile(200, 'test/htmls/mashable.html');
    return extractor
      .extractAsync('http://mashable.com/')
      .then(function(result){
        expect(result.url).to.eql('http://mashable.com/2015/03/19/magic-leap-gaming/');
        expect(result.title).to.eql('Magic Leap shows off gaming on its holographic headset');
        expect(result.description).to.eql('Watch out HoloLens, there\'s another holographic/augmented reality headset coming to town.');
        expect(result.image).to.eql('http://rack.1.mshcdn.com/media/ZgkyMDE1LzAzLzIwLzQxL21hZ2ljbGVhcHVzLjBlZGVlLmpwZwpwCXRodW1iCTEyMDB4NjI3IwplCWpwZw/d6168606/c73/magic-leap-user-interface.jpg');
        expect(result.contentType).to.eql('article');
        expect(result.site).to.eql('Mashable');
        expect(result.date).to.eql('2015-03-20T01:46:37+00:00');
        // TODO: Get author
        expect(result.author).to.be.undefined;
      });
  });

  it('should work for a Kickstarter project', function(){
    nock('http://kickstarter.com').get('/').replyWithFile(200, 'test/htmls/kickstarter.html');
    return extractor
      .extractAsync('http://kickstarter.com/')
      .then(function(result){
        expect(result.url).to.eql('https://www.kickstarter.com/projects/1113967159/widerun-the-first-full-immersive-vr-biking-experie');
        expect(result.title).to.eql('Widerun - The first full immersive VR biking experience');
        expect(result.description).to.eql('Widerun is the first bike trainer you connect to Oculus Rift. Ride in full immersive VR worlds, from SF to the Alps, like being there!');
        expect(result.image).to.eql('https://ksr-ugc.imgix.net/projects/1722158/photo-original.jpg?v=1426697129&w=640&h=480&fit=crop&auto=format&q=92&s=dbfe33a0651aaf0d782974c038ec4825');
        expect(result.contentType).to.eql('kickstarter:project');
        expect(result.site).to.eql('Kickstarter');
        // TODO: Get author
        expect(result.author).to.be.undefined;
        expect(result.date).to.be.undefined;
      });
  });

  it('should fail for an inaccessible URL', function(){
    return expect(extractor
      .extractAsync('http://iamnotarealwebsite.io'))
      .to.eventually.be.rejected;
  });

  it('should fail for a malformed URL', function(){
    return expect(extractor
      .extractAsync('tcp:/notaurl.io'))
      .to.eventually.be.rejected;
  });  

});