'use strict'

import path from 'path';
import fs from 'fs';
import log from 'fancy-log';
import async from 'async';
import allure from 'allure-commandline';
import cucumberJunit from 'cucumber-junit';
import colors from 'ansi-colors';

const launcher = require('webdriverio/build/lib/launcher');
const args = require('yargs').argv;

var configFile = './wdio.defaults.conf.js';
var tags;

var sessionName = '';

// Setup environment
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

function setupCapabilities(caps, config, options) {
    var hostname = options.baseUrl;
    var hostnameWithProtocol = hostname;
    if (!hostname.includes('http')) {
        hostnameWithProtocol = 'http://' + hostnameWithProtocol;
    }

    // Setup Browserstack options
    if (config.host) {
        if (config.host == 'hub.browserstack.com') {
            if (build) {
                caps.build = build;
            }

            if (project) {
                caps.project = project;
            }
            else {
                var name = project + ' v' + build + ' ' + hostname;
                if (os) {
                    name = name + ' on ' + os + ' ' + os_version;
                    name = name + ' and ' + browser + ' ' + browser_version;
                }
                caps.project = name;
                //project = name;
                sessionName = name;
            }

        }
    }

    // Setup for SauceLabs
    if (config.host) {
        if (config.host == 'ondemand.saucelabs.com') {
            if (build) {
                caps.build = build;
            }

            if (project) {
                caps.name = project;
            }
            else {
                var name = hostname + ' on ' + caps.platform + ' and ' + caps.browserName;
                caps.name = name;
                //project = name;
                sessionName = name;
            }
        }
    }

    // Setup for Test Object
    if (config.host) {
        if (config.host == 'app.testobject.com') {
            var testName = test;

            if (!test) {
                testName = hostname + ' on ' + config.capabilities[0].testobject_device;
            }

            if (suite) {
                caps.testobject_suite_name = suite;
            } else {
                caps.testobject_suite_name = config.capabilities[0].testobject_suite_name;
            }

            caps.testobject_test_name = testName;
            //project = testName;
            sessionName = testName;
        }
    }

    // Setup localhost
    if (!config.host || config.host == '127.0.0.1' || config.host == 'localhost') {
        sessionName = hostname + ' on localhost';
    }
}

// Create JUnit XML report
function cucumberXmlReport(opts) {
    return through.obj(function (file, enc, cb) {
        var xml = cucumberJunit(file.contents, opts);
        file.contents = new Buffer(xml);
        file.path = gutil.replaceExtension(file.path, '.xml');

        cb(null, file);
    });
}

// Create HTML report
function createHtmlReport() {
    var input = path.join(process.cwd(), './_output/reports/_cucumber-report.json');

    if (fs.existsSync(input)) {
        var output = path.join(process.cwd(), './_output/reports/' + sessionName.replace(/ /g, '_') + '_report.html');
        var outputJs = output.replace('html', 'json');

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

        async.series([
            function (cb) {
                reporter.generate(options);
                cb(null, 1);
            },
            function (cb) {
                fs.renameSync(input, outputJs)
                cb(null, 2);
            },
            function (cb) {
                // gulp.src(outputJs)
                //     .pipe(cucumberXmlReport({ strict: true }))
                //     .pipe(gulp.dest('_output/reports'));
                cb(null, 3);
            }
            /*
            ,
            function(cb) {
              var generation = allure(['generate', '_output/reports'])
              generation.on('exit', function(exitCode) {
                  console.log('Generation is finished with code:', exitCode);
              });
              cb(null, 4);
            }
            */
        ], function (error, results) {
            //console.log(results);
        });
    }
}

if(process.argv[2] == 'setup') {
    log.info('Running setup!');
    // Setup environment
    setupEnvironment();
}
else if(process.argv[2] == 'run') {
    var options = {};
    if (args.options) {
        options = require(path.join(process.cwd(), args.options)).config;
    }
    else {
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

    // Setup capabilities
    var caps = wdio.configParser._capabilities[0];
    setupCapabilities(caps, config, options);

    // Start test
    wdio.run().then(function (code) {
        // Create HTML report
        //createHtmlReport();
    }, function (error) {
        log.error('Error while running the tests!');
        log.error(error);
    });
}