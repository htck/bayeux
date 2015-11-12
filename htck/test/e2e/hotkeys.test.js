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


  // Remove (del)
  it('should remove element on del', function() {
    element(by.id('paper')).sendKeys(protractor.Key.DELETE);
    addedElement.then(function(elems) {
        expect(elems.length).toEqual(0 + defaultElementsOnStage);
      }
    );
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
  var addedElement;

  beforeEach(function() {
    browser.get('/');
    var addElButton = element.all(by.css('[ng-click="addImage(i)"]')).get(0);
    addElButton.click();
    addedElement = element.all(by.css('#paper image'));
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

  it('should bring element to front', function() {
    var firstElement, secondElement;
    // Get image id for the first element
    addedElement.get(defaultElementsOnStage).getAttribute('href').then(function(picture) {
      firstElement = picture;
      // add a second element
      var addElButton = element.all(by.css('[ng-click="addImage(i)"]')).get(1);
      addElButton.click();
      addedElement = element.all(by.css('#paper image'));
      // Get image id for the second element
      return addedElement.get(defaultElementsOnStage+1).getAttribute('href');
    }).then(function(picture){
      secondElement = picture;

      // Select the first element again
      addedElement.get(defaultElementsOnStage).click();
      // Send Bring To Front Hotkey
      element(by.id('paper')).sendKeys(protractor.Key.SPACE);
      // Get the image id for the element on top
      return addedElement.get(defaultElementsOnStage + 1).getAttribute('href');
    }).then(function(picture){
      // Expect it to be the first element's image id
      expect(picture).toBe(firstElement);
    });
  });

  // LAL: When bringing an element X to the back, the background is then brought to the back afterwards
  // but the order of <image> elements is, oddly, X, Background, Y
  it('should bring element to back', function() {
    var firstElement, secondElement;
    // Get image id for the first element
    addedElement.get(defaultElementsOnStage).getAttribute('href').then(function(picture) {
      firstElement = picture;
      // add a second element
      var addElButton = element.all(by.css('[ng-click="addImage(i)"]')).get(1);
      addElButton.click();
      addedElement = element.all(by.css('#paper image'));
      // Get image id for the second element
      return addedElement.get(defaultElementsOnStage+1).getAttribute('href');
    }).then(function(picture){
      secondElement = picture;

      // Send Bring To Back hotkey
      element(by.id('paper')).sendKeys(protractor.Key.CONTROL, protractor.Key.SPACE);
      // Get the image id for the element on bottom layer
      return addedElement.get(0).getAttribute('href');    // See note
    }).then(function(picture){
      // Expect it to be the second element's image id
      expect(picture).toBe(secondElement);
    });
  });
});

// describe('Hotkeys text', function() {
  
// });