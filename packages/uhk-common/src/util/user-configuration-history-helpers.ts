import * as moment from 'moment';

export const FILENAME_DATE_FORMAT = 'YYYYMMDD-HHmmss';
export const DISPLAY_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export function getUserConfigHistoryFilename(): string {
    const timestamp = moment().format(FILENAME_DATE_FORMAT);

    return `${timestamp}.bin`;
}

export function convertHistoryFilenameToDisplayText(filename: string): string {
    const name = filename.replace('.bin', '');

    return moment(name, FILENAME_DATE_FORMAT).format(DISPLAY_DATE_FORMAT);
}
