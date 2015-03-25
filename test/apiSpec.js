'use strict';

var app = require('../app');
var expect = require('chai').expect;
var agent = require('supertest-as-promised');
var nock = require('nock');

describe('The API', function(){
  
  this.timeout(5000);
  nock.enableNetConnect();

  it('should work for a valid URL', function(){
    return agent(app)
      .post('/extract')
      .send({
        url: 'http://fox13now.com/2013/12/30/new-year-new-laws-obamacare-pot-guns-and-drones/'
      }).then(function(result){
        expect(result.body.title).to.eql('New Year, new laws: Obamacare, pot, guns and drones');
      });
  });

  it('should return a 400 for a request without URL', function(){
    return agent(app)
      .post('/extract')
      .send({})
      .expect(400); 
  });


  it('should return a 404 for an inaccessible URL', function(){
    return agent(app)
      .post('/extract')
      .send({ url: 'http://iamnotarealwebsite.io' })
      .expect(404); 
  });

  it('should return a 404 for a malformed URL', function(){
    return agent(app)
      .post('/extract')
      .send({ url: 'http://fox13now/new-year-new-laws-obamacare-pot-guns-and-drones/' })
      .expect(404);
  });

});