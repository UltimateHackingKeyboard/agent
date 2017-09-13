import * as log from 'electron-log';
log.transports.file.level = 'debug';
log.transports.console.level = 'debug';
log.transports.rendererConsole.level = 'debug';

export const logger = log;
