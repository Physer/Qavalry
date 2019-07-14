const path = require('path');

// config.js
module.exports.config = {
    outputDir: path.join(__dirname, 'logs'),
    capabilities: [{
        browserName: 'internet explorer'
    }]
}