'use strict';

/* globals $ */
/* globals canvg */
/* globals saveAs */
/* globals constants */
angular.module('htckApp').factory('hExport', function() {
  // Function gotten from SVGFix
  // source : https://code.google.com/p/svgfix/
  function svgfix (text) {
    var fixed = text ;
    fixed = $.trim(fixed);
    if (fixed.indexOf( 'xmlns:xlink' ) === -1 ) {
      fixed = fixed.replace ('<svg ', '<svg xmlns:xlink="http://www.w3.org/1999/xlink" '); 
    }
    fixed = fixed.replace (' href', ' xlink:href');
    return fixed; 
  }

  function exportOneCanvas(raphaelPaperId, canvasId, paper, callback){
    paper.setSize(constants.W+'px',constants.H+'px');
    // Get the svg element created by Raphael
    var svg = document.getElementById(raphaelPaperId).children[0];
    var svgStr = svgfix(svg.outerHTML);

    paper.setSize('100%','100%');


    // Convert to canvas using canvg
    canvg(document.getElementById(canvasId), svgStr, {
      renderCallback: function() {
        callback(canvas);
      }
    });
  }

  function exportOneBase64(raphaelPaperId, canvasId, paper, callback){
    exportOneCanvas(raphaelPaperId, canvasId, paper, function(canvas){
      callback(canvas.toDataURL());
    });
  }

  function exportOnePNG(raphaelPaperId, canvasId, fileName, paper){
    exportOneCanvas(raphaelPaperId, canvasId, paper, function(canvas){
      canvas.toBlob(function(blob){
        // Save to file using FileSaver.js
        saveAs(blob, fileName);  // TODO generate random name for file
      });
    });
  }

  function exportOneJSON(paper, backgroundOnly) {
    // Serialize as json
    var json = paper.toJSON(function(el, data){ // For each element

      if(el.handle){
        return;
      }

      if(el.background){
        data.background = true;
      }
      else if(backgroundOnly){
        return;
      }
      // Save properties
      data.height = el.height;
      data.width = el.width;
      data.rotation = el.rotation;
      data.opacity = el.opacity;
      data.keepratio = el.keepratio;
      data.mirror = el.mirror;

      if(el.ft){
        data.ft = el.ft.attrs;
      }
      return data;
    });
    return json;
  }

  // TODO Heavily WIP
  function exportManyPNG(scope, raphaelPaperId, canvasId, fileBase){
    var hPages = scope.hPages;
    hPages.saveCurrent();
    var i=0, l = hPages.pages.length;
    for(; i < l; i++){
      hPages.goto(i);
      exportOnePNG(raphaelPaperId, canvasId, fileBase + i + '.png', scope.paper);
    }
  }

  function exportManyGIF(base64ImageArray) {
    console.log(base64ImageArray);
    gifshot.createGIF({
        'images': base64ImageArray,
        'gifwidth': constants.W / 2,
        'gifheight': constants.H / 2,
        'crossOrigin': '' // Firefox
    },function(obj) {
        if(!obj.error) {
            var image = obj.image,
            animatedImage = document.createElement('img');
            animatedImage.src = image;
            document.body.appendChild(animatedImage);
        }
        console.log(obj);
    });
  }

  return {
    exportOnePNG: exportOnePNG,
    exportOneJSON: exportOneJSON,
    exportManyPNG: exportManyPNG,
    exportManyGIF: exportManyGIF,
    exportOneBase64: exportOneBase64
  };
});