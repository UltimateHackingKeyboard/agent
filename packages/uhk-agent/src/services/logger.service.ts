import * as path from 'path';
import * as log from 'electron-log';

log.transports.console.level = 'debug';
log.transports.file.level = 'debug';
log.transports.file.resolvePath = variables => {
    return path.join(variables.libraryDefaultDir, 'uhk-agent.log');
};

export const logger = log;
