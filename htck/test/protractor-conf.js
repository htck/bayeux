exports.config = {
  // location of the Selenium JAR file and chromedriver
  seleniumServerJar: '../node_modules/protractor/selenium/selenium-server-standalone-2.47.1.jar',
  chromeDriver: '../node_modules/protractor/selenium/chromedriver',
 
  // Tests location
  specs: [
    '../test/e2e/*.test.js'
  ],
 
  // configure multiple browsers to run tests
  multiCapabilities: [{
    'browserName': 'firefox'
  }/*, {
    'browserName': 'chrome'
  }*/],
 
  // App URL, /!\ synchronize port with gruntFile
  baseUrl: 'http://localhost:9001/',
 
  // Testing framework
  framework: 'jasmine',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 10000,
    isVerbose: true,
    includeStackTrace: true
  }
};