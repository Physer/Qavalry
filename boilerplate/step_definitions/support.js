import { defineSupportCode } from 'cucumber';

// Take screenshots of failed scenarios
defineSupportCode(({ After }) => {
    After(function (scenario) {
        var world = this;
        if (scenario.isFailed()) {
            var screenshotBase64Encoded = browser.screenshot();
            world.attach(new Buffer(screenshotBase64Encoded.value, 'base64'), 'image/png');
        }
    });
});