'use strict';

angular.module('htckApp').factory('hTools', function() {
  function getSizeOfImage(src) {
    var fimg = new Image(); 
    fimg.src = src;

    var width = fimg.width;
    var height = fimg.height;

    return {w:width, h:height};
  }

  return {
    getSizeOfImage: getSizeOfImage
  };
});