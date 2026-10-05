export function getUserConfigHistoryFilename(md5Hash: string): string {
    const timestamp = formatFilenameTimestamp(new Date());

    return `${timestamp}-${md5Hash}.bin`;
}

export function convertHistoryFilenameToDisplayText(filename: string): string {
    // simulates moment.js behavior
    if (filename.length < 15) {
        return 'Invalid date';
    }

    const timestamp = filename.substring(0, 15);

    const year = timestamp.substring(0, 4);
    const month = timestamp.substring(4, 6);
    const day = timestamp.substring(6, 8);
    // index 8 is the '-' separator
    const hours = timestamp.substring(9, 11);
    const minutes = timestamp.substring(11, 13);
    const seconds = timestamp.substring(13, 15);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Formats a Date as `YYYY-MM-DD HH:mm:ss` using local time.
 */
export function convertDateToDisplayText(date: Date): string {
    const segments = getDateSegments(date);

    return `${segments.year}-${segments.month}-${segments.day} ${segments.hours}:${segments.minutes}:${segments.seconds}`;
}

/**
 * Formats a Date as `YYYYMMDD-HHmmss` using local time.
 */
function formatFilenameTimestamp(date: Date): string {
    const segments = getDateSegments(date);

    return `${segments.year}${segments.month}${segments.day}-${segments.hours}${segments.minutes}${segments.seconds}`;
}

interface DateSegments {
    year: string;
    month: string;
    day: string;
    hours: string;
    minutes: string;
    seconds: string;
}

function getDateSegments(date: Date): DateSegments {
    return {
        year: date.getFullYear().toString().padStart(4, '0'),
        month: (date.getMonth() + 1).toString().padStart(2, '0'),
        day: date.getDate().toString().padStart(2, '0'),
        hours: date.getHours().toString().padStart(2, '0'),
        minutes: date.getMinutes().toString().padStart(2, '0'),
        seconds: date.getSeconds().toString().padStart(2, '0'),
    };
}
