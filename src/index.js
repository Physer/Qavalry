'use strict'

import path from 'path';
import fs from 'fs';

const launcher = require('@wdio/cli').default;
const args = require('yargs').argv;
const fsextra = require('fs-extra');
var configFile = './wdio.conf.js';
var defaultOptionsFile = './configuration/options.js';

function prepareOutputFolders() {
    var outputFolder = path.join(process.cwd(), './_output');
    console.log('Checking existence of output folder ' + outputFolder);
    if (!fs.existsSync(outputFolder)) {
        console.log('Creating output directory.');
        fs.mkdirSync(outputFolder);
    }

    var logsFolder = path.join(process.cwd(), './_output/logs');
    console.log('Checking existence of logs folder ' + logsFolder);
    if (!fs.existsSync(logsFolder)) {
        console.log('Creating logs directory.');
        fs.mkdirSync(logsFolder);
    }

    var reportsFolder = path.join(process.cwd(), './_output/reports');
    console.log('Checking existence of reports folder ' + reportsFolder);
    if (!fs.existsSync(reportsFolder)) {
        console.log('Creating reports directory.');
        fs.mkdirSync(reportsFolder);
    }

    var jsonReportsFolder = path.join(process.cwd(), './_output/reports/json');
    console.log('Checking existence of reports folder ' + jsonReportsFolder);
    if (!fs.existsSync(jsonReportsFolder)) {
        console.log('Creating reports directory.');
        fs.mkdirSync(jsonReportsFolder);
    }

    var htmlReportsFolder = path.join(process.cwd(), './_output/reports/html');
    console.log('Checking existence of html reports folder ' + htmlReportsFolder);
    if (!fs.existsSync(htmlReportsFolder)) {
        console.log('Creating html reports directory.');
        fs.mkdirSync(htmlReportsFolder);
    }

    var jsonReport = path.join(process.cwd(), './_output/reports/_cucumber-report.json');
    console.log('Checking existence of Cucumber report file ' + jsonReport);
    if (fs.existsSync(jsonReport)) {
        console.log('Cleaning Cucumber report files');
        fs.unlinkSync(jsonReport);
    }
}

function setup() {
    console.log('Running setup!');
    var destination = process.cwd();
    fsextra.copy(path.join(__dirname, '../boilerplate'), `${destination}`, err => {
        if (err) {
            console.log('Something went wrong: ');
            console.log(err);
        }
    });
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
        console.log('Default options file found at: ' + defaultOptionsFile);
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

    console.log('Registered tags: ' + options.cucumberOpts.tagExpression);
    // Run tests 
    console.log('Running for site: ' + options.baseUrl);

    // Start test run
    var wdio = new launcher(path.join(__dirname, configFile), options);

    // Start test
    wdio.run()
    .then(
      code => {
        process.exit(code);
      },
      error => {
        console.error('Webdriver IO failed to start the test', error.stacktrace);
        process.exit(1);
      },
    );
}
