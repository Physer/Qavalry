import { defineSupportCode } from 'cucumber';

var config = require('../generic/config.js');
var url;

defineSupportCode(( { Then }) => {
    
    // *
    // Check for elements

    // Check for the page title
    Then(
        /^I expect that the title is( not)* "([^"]*)?"$/, function (falseCase, title){
            expect(browser.getTitle() == title).to.equal(!falseCase);
    });

    // Check for an element
    Then(/^I see element '([^']*)'$/, function (name) {
        browser.waitForVisible(name, config.delay.clickDelay);
        expect(name).to.not.be.null;
        expect(browser.isVisible(name)).to.be.true;
    });

    // Check for a link based on it's href
    Then(/^I see a link with an href of '([^']*)'$/, function (name) {
        var el = 'a[href="' + name + '"]';
        browser.waitForVisible(el, config.delay.clickDelay);
        expect(el).to.not.be.null;
        expect(browser.isVisible(el)).to.be.true;
    });

    // Check for a link based on its title
    Then(/^I see a link with a title of '([^']*)'$/, function (name) {
        var el = 'a[title="' + name + '"]';
        browser.waitForVisible(el, config.delay.clickDelay);
        expect(el).not.toBeNull();
        expect(browser.isVisible(el)).to.be.true;
    });

    // Check for a downloadlink based on it's href
    Then(/^I see a downloadlink with an href of '([^']*)'$/, function (name) {
        var el = 'a[href="' + config.baseUrl.websiteURL + config.baseUrl.port + name + '"]';
        browser.waitForVisible(el, config.delay.clickDelay);
        expect(el).to.not.be.null;
        expect(browser.isVisible(el)).to.be.true;
    }); 

    // Check for an image based on it's src
    Then(/^I see an image with an src of '([^']*)'$/, function (name) {
        var el = 'img[src="' + config.baseUrl.websiteURL + config.baseUrl.port + name + '"]';
        expect(el).to.not.be.null;
        expect(browser.isVisible(el)).to.be.true;
    });

    // *
    // Check for text inside elements

    // Check for a list element based on its contained text
    Then(/^I see an ordered list element containing the text '([^']*)'$/, function (name) {
        browser.getText('li*=' + name); 
         
    });

    // Check for a link element based on its contained text
    Then(/^I see a link containing the text '([^']*)'$/, function (name) {
        browser.getText('a*=' + name);  
    });

    // Check for a h1 element based on its contained text
    Then(/^I see a h1 containing the text '([^']*)'$/, function (name) {
        browser.getText('h1*=' + name);  
    });

    // Check for a h2 element based on its contained text
    Then(/^I see a h2 containing the text '([^']*)'$/, function (name) {
        browser.getText('h2*=' + name);  
    });

    // Check for a h3 element based on its contained text
    Then(/^I see a h3 containing the text '([^']*)'$/, function (name) {
        browser.getText('h3*=' + name);  
    });

    // Check for a h4 element based on its contained text
    Then(/^I see a h4 containing the text '([^']*)'$/, function (name) {
        browser.getText('h4*=' + name);  
    });

    // Check for a h5 element based on its contained text
    Then(/^I see a h5 containing the text '([^']*)'$/, function (name) {
        browser.getText('h5*=' + name);  
    });

    // Check for a h6 element based on its contained text
    Then(/^I see a h6 containing the text '([^']*)'$/, function (name) {
        browser.getText('h6*=' + name);  
    });

    // Check for a span element based on its contained text
    Then(/^I see a span containing the text '([^']*)'$/, function (name) {
        browser.getText('span*=' + name);  
    });

    // Check for a div element based on its contained text
    Then(/^I see a div containing the text '([^']*)'$/, function (name) {
        browser.getText('div*=' + name);  
    });

    // Check for a td element based on its contained text
    Then(/^I see a td containing the text '([^']*)'$/, function (name) {
        browser.getText('td*=' + name);  
    });

    // *
    // Count the amount of elements
    Then(/^I see '([^']*)' instances of element '([^']*)'$/, function (count, name) {   
        var intCount = parseInt(count);
        var amount = browser.elements(name);
        expect(amount.value.length === intCount).to.be.true;
        
    });

    // Check the right url
    Then(/^I expect that the url is( not)* '([^']*)?'$/, function (falseCase, url){
        expect(browser.getUrl() == url).to.equal(!falseCase);
    });
});