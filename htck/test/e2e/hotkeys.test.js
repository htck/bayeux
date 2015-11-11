'use-strict';

describe('Hotkeys related', function() {
  var addedElement;
  var defaultElementsOnStage = 1;

  beforeEach(function() {
    browser.get('/');
    var addElButton = element.all(by.css('[ng-click="addImage(i)"]')).get(0);
    addElButton.click();
    addedElement = element.all(by.css('#paper image'));
  });

  // Mirror (ctrl+m)
  it('should mirror on ctrl+m', function() {
    element(by.id('paper')).sendKeys(protractor.Key.CONTROL, 'm');
    addedElement.get(defaultElementsOnStage).getAttribute('transform').then(function(matrix) {
      matrix = matrix.substring(7, matrix.length-1);
      var factors = matrix.split(',');
      expect(factors[0]).toBe('-1');       // width
    });
  });

  // Unfocus (escape)
  it('should unfocus on escape', function() {
    element(by.id('paper')).sendKeys(protractor.Key.ESCAPE);
    var propertiesPanel = element(by.id('properties'));
    expect(propertiesPanel.isPresent()).toBeFalsy();
  });


});