'use strict'

import path from 'path';
import fs from 'fs';
import reporter from 'cucumber-html-reporter';
import dateformat from 'dateformat';

const launcher = require('@wdio/cli').default;
const args = require('yargs').argv;
const fsextra = require('fs-extra');
var configFile = './wdio.defaults.conf.js';
var defaultOptionsFile = './configuration/options.js';
var defaultReporterSettings = './configuration/reporterSettings.js';

function prepareOutputFolders() {
    var outputFolder = path.join(process.cwd(), './_output');
    console.log.info('Checking existence of output folder ' + outputFolder);
    if (!fs.existsSync(outputFolder)) {
        console.log.info('Creating output directory.');
        fs.mkdirSync(outputFolder);
    }

    var logsFolder = path.join(process.cwd(), './_output/logs');
    console.log.info('Checking existence of logs folder ' + logsFolder);
    if (!fs.existsSync(logsFolder)) {
        console.log.info('Creating logs directory.');
        fs.mkdirSync(logsFolder);
    }

    var reportsFolder = path.join(process.cwd(), './_output/reports');
    console.log.info('Checking existence of reports folder ' + reportsFolder);
    if (!fs.existsSync(reportsFolder)) {
        console.log.info('Creating reports directory.');
        fs.mkdirSync(reportsFolder);
    }

    var htmlReportsFolder = path.join(process.cwd(), './_output/reports/html');
    console.log.info('Checking existence of html reports folder ' + htmlReportsFolder);
    if (!fs.existsSync(htmlReportsFolder)) {
        console.log.info('Creating html reports directory.');
        fs.mkdirSync(htmlReportsFolder);
    }

    var jsonReport = path.join(process.cwd(), './_output/reports/_cucumber-report.json');
    console.log.info('Checking existence of Cucumber report file ' + jsonReport);
    if (fs.existsSync(jsonReport)) {
        console.log.info('Cleaning Cucumber report files');
        fs.unlinkSync(jsonReport);
    }
}

function setup() {
    console.log.info('Running setup!');
    var destination = process.cwd();
    fsextra.copy(path.join(__dirname, '../boilerplate'), `${destination}`, err => {
        if (err) {
            console.log('Something went wrong: ');
            console.log(err);
        }
    });
}

// Create HTML report
function createHtmlReport() {
    var input = path.join(process.cwd(), './_output/reports/_cucumber-report.json');

    if (fs.existsSync(input)) {
        var currentDate = dateformat(new Date(), "dd-mm-yyyy_HHMMss");
        var output = path.join(process.cwd(), `./_output/reports/html/${currentDate}_html_report.html`);
        
        var options = {
            theme: 'bootstrap',
            jsonFile: input,
            output: output,
            reportSuiteAsScenarios: false,
            launchReport: false
        };

        if (args.reportdata) {
            var customOptions = require(path.join(process.cwd(), args.reportdata)).config;
            options = Object.assign(options, customOptions);
        } else if(fs.existsSync(defaultReporterSettings)) {
            console.log.info('Default reporter settings found at: ' + defaultReporterSettings);
            var defaultOptions = require(path.join(process.cwd(), defaultReporterSettings)).config;
            options = Object.assign(options, defaultOptions);
        }

        reporter.generate(options);
    }
}

if (process.argv[2] == 'setup') {
    setup();
} else if (process.argv[2] == 'run') {
    // Make sure the environment is set up properly before running any tests
    prepareOutputFolders();

    var options = {};
    if (args.options) {
        options = require(path.join(process.cwd(), args.options)).config;
    } else if (fs.existsSync(defaultOptionsFile)) {
        console.log.info('Default options file found at: ' + defaultOptionsFile);
        options = require(path.join(process.cwd(), defaultOptionsFile)).config;
    } else {
        console.log.error('No options file was specified and default options file not found at: ' + defaultOptionsFile);
        process.exit(1);
    }

    // Read default config file
    var config = require(configFile).config;
    // Override default config with given config
    if (args.config) {
        var overrideconfig = require(path.join(process.cwd(), args.config)).config;
        config = Object.assign(config, overrideconfig);
    }

    // Register CLI tags
    if (args.tags) {
        options.cucumberOpts.tagExpression = args.tags;
    }

    console.log.info('Registered tags: ' + options.cucumberOpts.tagExpression);
    // Run tests 
    console.log.info('Running for site: ' + options.baseUrl);

    // Start test run
    var wdio = new launcher(path.join(__dirname, configFile), options);

    // Start test
    wdio.run().then((code) => {
        log.info('Creating html report');
        createHtmlReport();
        process.exit(code);
    }, function (error) {
        console.log.error('Error while running the tests!');
        console.log.error(error);
    });
}
