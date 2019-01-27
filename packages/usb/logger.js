const { LogService, LogRegExps } = require('uhk-common');
const chalk = require('chalk');

class Logger extends LogService {
    error(...args) {
        console.error(args);
    }

    debug(...args) {
        const msg = args.join(' ');

        if (LogRegExps.writeRegExp.test(msg)) {
            console.log(chalk.blue(msg));
        } else if (LogRegExps.readRegExp.test(msg)) {
            console.log(chalk.green(msg));
        } else if (LogRegExps.errorRegExp.test(msg)) {
            console.log(chalk.red(msg));
        } else if (LogRegExps.transferRegExp.test(msg)) {
            console.log(chalk.yellow(msg));
        } else {
            console.log(...args);
        }
    }

    silly(...args) {
        console.log(args);
    }

    info(...args) {
        console.info(args);
    }
}

module.exports = Logger;
