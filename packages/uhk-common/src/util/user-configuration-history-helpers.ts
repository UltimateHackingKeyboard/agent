import * as moment from 'moment';

export const FILENAME_DATE_FORMAT = 'YYYYMMDD-HHmmss';
export const DISPLAY_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export function getUserConfigHistoryFilename(md5Hash: string): string {
    const timestamp = moment().format(FILENAME_DATE_FORMAT);

    return `${timestamp}-${md5Hash}.bin`;
}

export function convertHistoryFilenameToDisplayText(filename: string): string {
    const timestamp = filename.substring(0, 16);

    return moment(timestamp, FILENAME_DATE_FORMAT).format(DISPLAY_DATE_FORMAT);
}
