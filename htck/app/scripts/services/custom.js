'use strict';

angular.module('htckApp').factory('hCustom', function () {
  const CUSTOM_IMAGES_KEY = '_customImages';
  var scope = {};

  function init(parent) {
    scope = parent.$new();
    loadCustomImages();
  }

  function addCustomImage() {
    return showOpenFilePicker({
      types: [{
        accept: {
          'image/jpeg': ['.jpg', '.jpeg'],
          'image/png': ['.png']
        }
      }]
    }).then(files => {
      for (const file of files) {
        file.getFile().then(blob => {
          var reader = new FileReader();
          reader.readAsDataURL(blob); 
          reader.onloadend = () => {
            var base64data = reader.result;
            scope.$parent.customImages.push(base64data);
            saveCustomImages();
          };
      });
    }});
  }

  function clearCustomImages() {
    const shouldClear = confirm('Remove all custom images?');
    if (shouldClear) {
      scope.$parent.customImages = [];
      saveCustomImages();
    }
  }

  function loadCustomImages() {
    scope.$parent.customImages = JSON.parse(sessionStorage.getItem(CUSTOM_IMAGES_KEY)) || [];
  }

  function saveCustomImages() {
    sessionStorage.setItem(CUSTOM_IMAGES_KEY, JSON.stringify(scope.$parent.customImages));
  }

  return {
    addCustomImage,
    clearCustomImages,
    init
  };
});
