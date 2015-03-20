'use strict';

var extractor = require('../lib/extractor');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

describe('The metadata extractor', function(){
  
  this.timeout(5000);

  it('should work for a valid URL', function(){
    return extractor
      .extractAsync('http://fox13now.com/2013/12/30/new-year-new-laws-obamacare-pot-guns-and-drones/')
      .then(function(result){
        expect(result.title).to.eql('New Year, new laws: Obamacare, pot, guns and drones');
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