// spec.js
describe('Protractor Demo App', function() {

  beforeEach(function() {
    browser.get('http://mthoretton.github.io/htck/#/');
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('');
  });
});