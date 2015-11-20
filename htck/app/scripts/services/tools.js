'use strict';

angular.module('htckApp').factory('hTools', function() {
  function getSizeOfImage(src) {
    var fimg = new Image(); 
    fimg.src = src;

    var width = fimg.width;
    var height = fimg.height;

    return {w:width, h:height};
  }

  function randInt(lb, ub) {
      return Math.floor(Math.random() * (ub - lb + 1)) + lb;
  }

  function rand(lb, ub) {
      return Math.random() * (ub - lb + 1) + lb;
  }

  jQuery.fn.redraw = function(){
    jQuery(this).each(function(){
      this.style.display='none';
      this.offsetHeight;
      this.style.display='block';
    });
  };

  return {
    getSizeOfImage: getSizeOfImage,
    randInt: randInt,
    rand: rand
  };
});