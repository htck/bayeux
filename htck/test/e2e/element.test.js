'use-strict';

describe('Element related', function() {
  var addedElement;
  var defaultElementsOnStage = 1;

  beforeEach(function() {
    browser.get('/');
    var addElButton = element.all(by.css('[ng-click="addImage(i)"]')).get(0);
    addElButton.getAttribute('ng-src').then(function(attr) {
      addElButton.click();
      addedElement = element.all(by.css('#paper image [href="'+attr+'"]')).get(0);
    });
  });

  it('should add an element', function() {
      addedElement = element.all(by.css('image')).then(function(elems) {
              expect(elems.length).toEqual(1 + defaultElementsOnStage);
          }
      );
  });

  it('should remove an element', function() {
      var removeButton = element.all(by.css('[ng-click="remove()"]')).get(0);
      removeButton.click();
      addedElement = element.all(by.css('image')).then(function(elems) {
              expect(elems.length).toEqual(0 + defaultElementsOnStage);
          }
      );
  });
});