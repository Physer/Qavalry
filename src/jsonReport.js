const JsonFormatter = require('cucumber').JsonFormatter;
const {
    defineSupportCode
} = require('cucumber');
const path = require('path');
var fs = require('fs')

'use strict';

defineSupportCode(({
    After,
    registerListener
}) => {
    console.log('Starting JSON report generation');
    const jsonFormatter = new JsonFormatter();

    jsonFormatter.log = function (resultString) {
        const jsonFileLocation = path.join('./_output/reports/_cucumber-report.json')

        if (fs.existsSync(jsonFileLocation)) {
            const allResults = JSON.parse(fs.readFileSync(jsonFileLocation).toString())
            allResults.push(JSON.parse(resultString)[0])
            fs.writeFileSync(jsonFileLocation, JSON.stringify(allResults))
        } else {
            fs.writeFileSync(jsonFileLocation, resultString)
        }
    }

    registerListener(jsonFormatter);
});