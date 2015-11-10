'use-strict';

describe('Main E2E tests', function() {

  beforeEach(function() {
    browser.get('/');
  });

  it('should add an element', function() {
    var addElButton = element.all(by.css('[ng-click="addImage(i)"]')).get(0);
    addElButton.getAttribute('ng-src').then(function(attr) {
      addElButton.click();
      var addedElement = element.all(by.css('[ng-click="addImage(i)"]')).get(0);
      expect(addedElement.isPresent()).toBe(true); 
    });
  });
});