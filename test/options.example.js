module.exports.config = {
    baseUrl: 'http://www.google.com',
    specs: [ './features/**/*.feature' ],
    logOutput: './_output/logs',
    reporterOptions: { 
        allure: { 
            outputDir: './_output/reports/allure'
        } 
    } 
}
