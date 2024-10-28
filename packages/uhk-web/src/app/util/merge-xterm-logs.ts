import { ElectronLogEntry, XtermCssClass, XtermLog } from '../models/xterm-log';

export function appendXtermLogs(xtermLogs: XtermLog[], logEntry: ElectronLogEntry): XtermLog[] {
    const logs: XtermLog[] = [...xtermLogs];

    const lastIndex = xtermLogs.length - 1;
    const lastLogEntry = xtermLogs[lastIndex];
    if (lastIndex >= 0 && lastLogEntry.message.startsWith(logEntry.message)) {
        logs[lastIndex] = {
            ...lastLogEntry,
            message: lastLogEntry.message + '.'
        };
    } else {
        logs.push({
            message: logEntry.message,
            cssClass: logEntry.level === 'error' ? XtermCssClass.error : XtermCssClass.standard
        });
    }

    return logs;
}
