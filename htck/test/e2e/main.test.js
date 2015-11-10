'use-strict';

describe('Main E2E tests', function() {

  beforeEach(function() {
    browser.get('/');
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('Historic Tale Construction Kit');
  });
});