// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-11-02 using
// generator-karma 1.0.0

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      "jasmine"
    ],

    // list of files / patterns to load in the browser
    files: [
      'app/content/config.js',
      // bower:js
      'lib/jquery/dist/jquery.js',
      'lib/angular/angular.js',
      'lib/angular-animate/angular-animate.js',
      'lib/angular-aria/angular-aria.js',
      'lib/angular-material/angular-material.js',
      'lib/angular-route/angular-route.js',
      'lib/angular-touch/angular-touch.js',
      'lib/jquery-ui/jquery-ui.js',
      'lib/angular-dragdrop/src/angular-dragdrop.js',
      'lib/angular-hotkeys/build/hotkeys.js',
      'lib/canvg/dist/canvg.bundle.js',
      'lib/canvg/dist/canvg.bundle.min.js',
      'lib/raphael/raphael.js',
      'lib/gifshot/build/gifshot.js',
      'lib/angular-mocks/angular-mocks.js',
      // endbower
      'lib/raphael_free_transform/raphael.free_transform.js',
      'app/scripts/**/*.js',
      'test/unit/**/*.js',
      { pattern: 'app/content/**/*', included: false, served: true }
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 9876,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      "PhantomJS",
      //'Firefox'
    ],

    // Which plugins to enable
    plugins: [
      "karma-phantomjs-launcher",
      "karma-firefox-launcher",
      "karma-jasmine",
      "karma-ng-html2js-preprocessor"
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'

    ngHtml2JsPreprocessor: {
      stripPrefix: 'app/',  // <-- change as needed for the project
      // include beforeEach(module('templates')) in unit tests
      moduleName: 'templates'
    },

    /*proxies :{
      '/': 'http://localhost:8080/'
    }*/

  });
};
