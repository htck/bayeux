'use strict';

describe('Service: hTextEdit - OK', function () {

  // load the controller's module
  beforeEach(module('htckApp'));
  var MainCtrl,
    scope,
    textEdit;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, hTextEdit) {
    scope = $rootScope.$new();
    textEdit = hTextEdit;

    var paper = document.createElement( "div" );
    paper.id = 'paper';
    var fileChooser = document.createElement( "div" );
    fileChooser.id = 'import-file-chooser';
    $("body").append(paper);
    $("body").append(fileChooser);

    MainCtrl = $controller('MainCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));


  it('should have a default font', function () {
      expect(scope.font).toBeTruthy();
  });

  it('should have a default font color', function () {
      expect(scope.fontColor).toBeTruthy();
  });

  
});

describe('Service: hTextEdit - missing data', function() {
  // load the controller's module
  beforeEach(module('htckApp'));
  var MainCtrl,
    scope,
    textEdit;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, hTextEdit) {
    scope = $rootScope.$new();
    textEdit = hTextEdit;
    delete constants.fonts;
    delete constants.colors;
    var paper = document.createElement( "div" );
    paper.id = 'paper';
    $("body").append(paper);

    MainCtrl = $controller('MainCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should not have any font', function () {
      expect(scope.font).toBe(undefined);
  });

  it('should have black as default font color', function () {
      expect(scope.fontColor).toBe('#000000');
  });
});