'use-strict';

describe('Element related', function() {
  var addedElement;
  var defaultElementsOnStage = 1;

  beforeEach(function() {
    browser.get('/');
    var addElButton = element.all(by.css('[ng-click="addImage(i)"]')).get(0);
    addElButton.click();
    addedElement = element.all(by.css('#paper image'));
  });

  it('should add an element', function() {
      addedElement.then(function(elems) {
              expect(elems.length).toEqual(1 + defaultElementsOnStage);
          }
      );
  });

  it('should remove an element', function() {
      var removeButton = element.all(by.css('[ng-click="remove()"]')).get(0);
      removeButton.click();
      addedElement.then(function(elems) {
              expect(elems.length).toEqual(0 + defaultElementsOnStage);
          }
      );
  });


  // Scaling sliders

  // TODO - Better drag n drop on slider
  // TODO - Bind constants and not manually entered numbers
  function sliderTest(id, widthFactor, heightFactor, keepRatio, maxKeyPress){
    if(keepRatio){
      var keepRatioSwitch = element(by.id('keepratio-switch'));
      keepRatioSwitch.click();
    }
    var slider = element(by.id(id));
    slider.click();
    for(var i=0; i<(maxKeyPress || 20); i++){
      slider.sendKeys(protractor.Key.CONTROL, protractor.Key.ARROW_LEFT);
    }
    addedElement.get(defaultElementsOnStage).getAttribute('transform').then(function(matrix) {
      matrix = matrix.substring(7, matrix.length-1);
      var factors = matrix.split(',');
      expect(factors[3]).toBe(heightFactor);      // height
      expect(factors[0]).toBe(widthFactor);       // width
    });
  }

  it('should rescale an element height with ratio', function() {
    sliderTest('height-slider', '0.2', '0.2'); // constants.ELEMENT_SCALE_MIN
  });
  it('should rescale an element width with ratio', function() {
    sliderTest('width-slider', '0.2', '0.2');
  });
  it('should rescale an element height without ratio', function() {
    sliderTest('height-slider', '1', '0.2', true);
  });
  it('should rescale an element width without ratio', function() {
    sliderTest('width-slider', '0.2', '1', true);
  });
  // Rotation
  it('should rotate an element', function() {
    sliderTest('rotation-slider', '-1', '-1', false, 100); // constants.ELEMENT_SCALE_MIN
  });

  // Mirror

  it('should mirror element', function() {
    var mirrorSwitch = element(by.id('mirror-switch'));
    mirrorSwitch.click();
    
    addedElement.get(defaultElementsOnStage).getAttribute('transform').then(function(matrix) {
      matrix = matrix.substring(7, matrix.length-1);
      var factors = matrix.split(',');
      expect(factors[0]).toBe('-1');       // width
    });
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
      // Click Bring To Front Button
      var bringToFrontButton = element.all(by.css('[ng-click="bringToFront()"]'));
      bringToFrontButton.click();
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

      // Click Bring To Back Button
      var bringToFrontButton = element.all(by.css('[ng-click="bringToBack()"]'));
      bringToFrontButton.click();
      // Get the image id for the element on bottom layer
      return addedElement.get(0).getAttribute('href');    // See note
    }).then(function(picture){
      // Expect it to be the second element's image id
      expect(picture).toBe(secondElement);
    });
  });


});