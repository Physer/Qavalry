'use strict'

import path from 'path';
import fs from 'fs';
import log from 'fancy-log';
import colors from 'ansi-colors';
import reporter from 'cucumber-html-reporter';

const launcher = require('webdriverio/build/lib/launcher');
const args = require('yargs').argv;
var configFile = './wdio.defaults.conf.js';

function setupEnvironment() {
    var outputFolder = path.join(process.cwd(), './_output');
    log.info('Checking existence of output folder ' + outputFolder);
    if (!fs.existsSync(outputFolder)) {
        log.info('Creating output directory.');
        fs.mkdirSync(outputFolder);
    }

    var logsFolder = path.join(process.cwd(), './_output/logs');
    log.info('Checking existence of logs folder ' + logsFolder);
    if (!fs.existsSync(logsFolder)) {
        log.info('Creating logs directory.');
        fs.mkdirSync(logsFolder);
    }

    var reportsFolder = path.join(process.cwd(), './_output/reports');
    log.info('Checking existence of reports folder ' + reportsFolder);
    if (!fs.existsSync(reportsFolder)) {
        log.info('Creating reports directory.');
        fs.mkdirSync(reportsFolder);
    }

    var jsonReport = path.join(process.cwd(), './_output/reports/_cucumber-report.json');
    log.info('Checking existence of Cucumber report file ' + jsonReport);
    if (fs.existsSync(jsonReport)) {
        log.info('Creating Cucumber report file.');
        fs.unlinkSync(jsonReport);
    }
}

// Create HTML report
function createHtmlReport() {
    var input = path.join(process.cwd(), './_output/reports/_cucumber-report.json');

    if (fs.existsSync(input)) {
        var output = path.join(process.cwd(), './_output/reports/' + 'html_report.html');

        var options = {
            theme: 'bootstrap',
            jsonFile: input,
            output: output,
            reportSuiteAsScenarios: false,
            launchReport: false,
            metadata: {
                "App Version": "1.0.0",
                "Test Environment": "PROD",
                "Browser": "TODO  1.0.0",
                "Platform": "TODO",
                "Executed": "Remote"
            }
        };

        reporter.generate(options);
    }
}

if (process.argv[2] == 'setup') {
    log.info('Running setup!');
    setupEnvironment();
} else if (process.argv[2] == 'run') {
    setupEnvironment();
    var options = {};
    if (args.options) {
        options = require(path.join(process.cwd(), args.options)).config;
    } else {
        log.error('No options file was given!');
        process.exit(1);
    }

    // Read default config file
    var config = require(configFile).config;
    // Override default config with given config
    if (args.config) {
        var overrideconfig = require(path.join(process.cwd(), args.config)).config;
        config = Object.assign(config, overrideconfig);
    }

    // Run tests 
    log.info('Running for site: ' + colors.bold(colors.white(colors.bgblue(options.baseUrl))));

    // Start test run
    var wdio = new launcher(path.join(__dirname, configFile), options);

    // Start test
    wdio.run().then(function (code) {
        createHtmlReport();
    }, function (error) {
        log.error('Error while running the tests!');
        log.error(error);
    });
}