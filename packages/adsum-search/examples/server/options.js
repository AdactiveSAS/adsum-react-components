let applicationLogger = {
    log(level, msg, context) { console.log(`[${level}]: ${msg}`); if (context) { console.log(context); } },
    error(...args) { return this.log('error', ...args); },
    warn(...args) { return this.log('warn', ...args); },
    info(...args) { return this.log('info', ...args); },
    verbose(...args) { return this.log('verbose', ...args); },
    debug(...args) { return this.log('debug', ...args); },
    silly(...args) { return this.log('silly', ...args); }
};

try {
    const NodeLogger = require('node-logger');

    NodeLogger.loggers.add({ name: 'AS', level: 'debug', label: 'AS' });
    NodeLogger.loggers.add({ name: 'APA', level: 'debug', label: 'APA' });
    NodeLogger.loggers.add({ name: 'APAN', level: 'debug', label: 'APAN' });

    applicationLogger = NodeLogger.loggers.get('AS');
} catch (e) {
}
// //////////////////////////////////////////////////////////////////////////////////////////

const options = {
    port: 8080,
    jsonConfigFile: './config.json',
    data_folder: './local',
    path: './public/',
    logger: applicationLogger,
    site: 339,
    cache: {
        "endpoint": "https://asia-api.adsum.io",
        "site": 339,
        "username": "1056-device",
        "key": "b6e8e6eaf2c7ff66b783e7721a57ed62f204c3bc3a68b729c1ea3a90a7c1e828"
    }
};

module.exports = options;
