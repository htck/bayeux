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

  // TODO - Better drag n drop on slider
  // TODO - Find constants and not manually entered numbers
  it('should rescale an element height with ratio', function() {
    var slider = element(by.id('height-slider'));
    slider.click();
    for(var i=0; i<50; i++){
      slider.sendKeys(protractor.Key.ARROW_LEFT);
    }
    addedElement.get(defaultElementsOnStage).getAttribute('transform').then(function(matrix) {
      matrix = matrix.substring(7, matrix.length-1);
      var factors = matrix.split(',');
      expect(factors[0]).toBe(factors[3]);  // Same ratio
      expect(factors[0]).toBe('0.2');       // constants.ELEMENT_SCALE_MIN
    });
  });

  // TODO - Better drag n drop on slider
  // TODO - Find constants and not manually entered numbers
  it('should rescale an element width with ratio', function() {
    var slider = element(by.id('width-slider'));
    slider.click();
    for(var i=0; i<50; i++){
      slider.sendKeys(protractor.Key.ARROW_LEFT);
    }
    addedElement.get(defaultElementsOnStage).getAttribute('transform').then(function(matrix) {
      matrix = matrix.substring(7, matrix.length-1);
      var factors = matrix.split(',');
      expect(factors[0]).toBe(factors[3]);  // Same ratio
      expect(factors[0]).toBe('0.2');       // constants.ELEMENT_SCALE_MIN
    });
  });


});