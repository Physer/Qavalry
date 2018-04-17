import { defineSupportCode } from 'cucumber';

var config = require('../generic/config.js');
var url;

defineSupportCode(( { When }) => {

    // *
    // Click functions

    // Click on an element
    When(/^I click on element '([^']*)'$/, function (name) {
        browser.waitForVisible(name, config.delay.clickDelay);
        browser.click(name);
    });

    // Click on an element with name
    When(/^I click on element with name '([^']*)'$/, function (name) {
        var el = '[name="' + name + '"]';
        browser.waitForVisible(el, config.delay.clickDelay);
        browser.click(el);
    });

    // Click on a link based on it's href
    When(/^I click on a link with an href of '([^']*)'$/, function (name) {
        var el = 'a[href="' + name + '"]';
        browser.waitForVisible(el, config.delay.clickDelay);
        browser.click(el);
    });
    
    // Click on an image based on it's src
    When(/^I click on an image with an src of '([^']*)'$/, function (name) {
        var el = 'img[src="' + config.baseUrl.websiteURL + config.baseUrl.port + name + '"]';
        browser.waitForVisible(el, config.delay.clickDelay);
        browser.click(el);
    });   

    // Click on a submit button
    When(/^I click submit$/, function () {
        browser.waitForVisible('button[type=submit]', config.delay.clickDelay);
        browser.click('button[type=submit]');
    });

    // Click on a h3 based on its text
    When(/^I click on a h3 with the text of '([^']*)'$/, function (name) {
        var el = 'h3*=' + name;
        browser.waitForVisible(el, config.delay.clickDelay);
        browser.click(el);
    });
    
    // Click on a element based on its text
    When(/^I click on a '([^']*)' element with the text of '([^']*)'$/, function (element, name) {
        var el = element + '*=' + name;
        browser.waitForVisible(el, config.delay.clickDelay);
        browser.click(el);
    });
    
    //Click on a label based on its text 
    When(/^I click on a label with the text of '([^']*)'$/, function (name) {
        var el = 'label*=' + name;
        browser.waitForVisible(el, config.delay.clickDelay);
        browser.click(el);
    });

    When(/^I scroll to element "([^"]*)?"$/, function(name){
        browser.scroll(name);
    });
    
    // *
    // Input text functions

    // Enter text in an element
    When(/^I enter '([^']*)' in element '([^']*)'$/, function (input, name) {
        browser.setValue(name, input);
    });

    // *
    // Iframe functions

    // Entering an iframes on the page
    When(/^I enter the iframe on the page$/, function () {
        browser.frame(0);
    });

});