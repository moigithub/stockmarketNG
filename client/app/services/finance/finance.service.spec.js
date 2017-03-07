'use strict';

describe('Service: finance', function() {
  // load the service's module
  beforeEach(module('stockmarketApp.finance'));

  // instantiate service
  var finance;
  beforeEach(inject(function(_finance_) {
    finance = _finance_;
  }));

  it('should do something', function() {
    expect(!!finance).toBe(true);
  });
});
