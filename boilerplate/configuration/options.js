module.exports.config = {
    baseUrl: 'https://www.example.com',
    specs: [ './features/**/*.feature' ],
    cucumberOpts: {
        tagExpression: 'not @Pending'
        }
}