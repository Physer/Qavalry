import { defineSupportCode } from 'cucumber';

var config = require('./settings.js');
var url;

defineSupportCode(( { Given }) => {
    
    // *
    // General functions

    // Visiting an url
    Given(/^I have visited '([^']*)'$/, function (page) {   
        browser.deleteCookie();
        browser.setViewportSize({
            width: config.screenSize.width,
            height: config.screenSize.height
        });
        url = browser.options.baseUrl + page;
        browser.url(url);
    });
});