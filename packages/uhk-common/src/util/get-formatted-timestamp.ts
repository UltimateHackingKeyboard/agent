import { dateFormatter } from './date-formatter.js';

export function getFormattedTimestamp(): string {
    return dateFormatter.format(new Date());
}
