'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('htckApp'));
  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();

    var paper = document.createElement( "div" );
    paper.id = 'paper';
    $("body").append(paper);

    MainCtrl = $controller('MainCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  // Things it should have
  it('should have a default font', function () {
    expect(scope.font).toBeTruthy();
  });

  it('should have constants', function () {
    expect(scope.constants).toBeTruthy();
  });

  it('should have a Raphael paper', function () {
    expect(scope.paper).toBeTruthy();
    expect(scope.paper.canvas).toBeTruthy();
  });

  // Brushes
  it('should set a brush correctly', function () {
    if(!scope.constants.brushes || !scope.constants.brushes.length){
      return;
    }
    scope.setBrush(scope.constants.brushes[0]);
    expect(scope.brush.name).toBe(scope.constants.brushes[0].name);
  });

  it('should swap brushes correctly', function () {
    if(!scope.constants.brushes || scope.constants.brushes.length < 2){
      return;
    }
    scope.setBrush(scope.constants.brushes[0]);
    scope.setBrush(scope.constants.brushes[1]);
    expect(scope.brush.name).toBe(scope.constants.brushes[1].name);
  });

  it('should deactivate a brush', function () {
    if(!scope.constants.brushes || scope.constants.brushes.length < 2){
      return;
    }
    scope.setBrush(scope.constants.brushes[0]);
    scope.setBrush(scope.constants.brushes[0]);
    expect(scope.brush).toBe(undefined);
  });
});
