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

  it('should have a default font', function () {
    expect(scope.font).toBeTruthy();
  });
});
