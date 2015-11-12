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
  },
  {
    'browserName': 'phantomjs',
    'phantomjs.binary.path': require('phantomjs').path,
    'phantomjs.cli.args': ['--ignore-ssl-errors=true', '--web-security=false']
  }*/],
 
  // App URL, /!\ synchronize port with gruntFile
  baseUrl: 'http://localhost:9001/',
 
  // Testing framework
  framework: 'jasmine',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 20000,
    isVerbose: true,
    includeStackTrace: true
  }
};