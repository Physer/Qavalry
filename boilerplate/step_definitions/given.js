import { Given } from 'cucumber';

var config = require('./settings.js');
var url;

// *
// General functions

// Visiting an url
Given(/^I have visited '([^']*)'$/, function (page) {
    browser.deleteCookies();
    browser.setWindowSize(config.screenSize.width, config.screenSize.height);
    url = browser.options.baseUrl + page;
    browser.url(url);
});