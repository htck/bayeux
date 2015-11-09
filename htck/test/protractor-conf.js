exports.config = {
  // location of the Selenium JAR file and chromedriver, use these if you installed protractor locally
  seleniumServerJar: '../node_modules/protractor/selenium/selenium-server-standalone-2.47.1.jar',
  chromeDriver: '../node_modules/protractor/selenium/chromedriver',
 
  // location of your E2E test specs
  specs: [
    '../test/e2e/*.js'
  ],
 
  // configure multiple browsers to run tests
  multiCapabilities: [{
    'browserName': 'firefox'
  }/*, {
    'browserName': 'chrome'
  }*/],
 
  // or configure a single browser
  /*
  capabilities: {
    'browserName': 'firefox'
  }
  */
 
  // url where your app is running, relative URLs are prepending with this URL
  baseUrl: 'http://localhost:9001/',
 
  // testing framework, jasmine is the default
  framework: 'jasmine',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 10000,
    isVerbose: true,
    includeStackTrace: true
  }
};