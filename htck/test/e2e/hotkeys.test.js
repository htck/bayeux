'use-strict';

var defaultElementsOnStage = 1;

describe('Hotkeys general', function() {
  var addedElement;

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

// TODO Async series
// TODO - Bind constants and not manually entered numbers
function testDirectionnalKey(key, factorIdx, diff) {
  element.all(by.css('#paper image')).get(defaultElementsOnStage).getAttribute('transform').then(function(matrix) {
    matrix = matrix.substring(7, matrix.length-1);
    var factors = matrix.split(',');
    var val = Number(factors[factorIdx]);
    element(by.id('paper')).sendKeys(key);
    element.all(by.css('#paper image')).get(defaultElementsOnStage).getAttribute('transform').then(function(matrix) {
      matrix = matrix.substring(7, matrix.length-1);
      var factors = matrix.split(',');
      var newval = Number(factors[factorIdx]);
      expect(newval).toBe(val + diff);
    });
  });
}

describe('Hotkeys image', function() {

  beforeEach(function() {
    browser.get('/');
    var addElButton = element.all(by.css('[ng-click="addImage(i)"]')).get(0);
    addElButton.click();
  });

  // Direction keys

  // LEFT
  it('should move left by 3px on LEFT', function() {
    testDirectionnalKey(protractor.Key.ARROW_LEFT, 4, -3);  // 4:x, -3:-constants.ELEMENT_DISPLACEMENT
  });
  // RIGHT
  it('should move right by 3px on RIGHT', function() {
    testDirectionnalKey(protractor.Key.ARROW_RIGHT, 4, +3);  // 4:x, 3:constants.ELEMENT_DISPLACEMENT
  });
  // UP
  it('should move up by 3px on UP', function() {
    testDirectionnalKey(protractor.Key.ARROW_UP, 5, -3);  // 5:y, -3:-constants.ELEMENT_DISPLACEMENT
  });
  // DOWN
  it('should move down by 3px on DOWN', function() {
    testDirectionnalKey(protractor.Key.ARROW_DOWN, 5, +3);  // 5:y, 3:constants.ELEMENT_DISPLACEMENT
  });
});

// describe('Hotkeys text', function() {
  
// });