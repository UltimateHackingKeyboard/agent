export { IpcEvents } from './ipcEvents';
export * from './constants';
export * from './create-md5-hash';
export * from './find-uhk-module-by-id';
export * from './get-md5-hash-from-file-name';
export * from './helpers';
export * from './is-equal-array';
export * from './map-i2c-address-to-module-name';
export * from './map-i2c-address-to-slot-id';
export * from './sort-string-desc';
export * from './to-hex-string';
export * from './user-configuration-history-helpers';

// Source: http://stackoverflow.com/questions/13720256/javascript-regex-camelcase-to-sentence
export function camelCaseToSentence(camelCasedText: string): string {
    return camelCasedText.replace(/^[a-z]|[A-Z]/g, function (v, i) {
        return i === 0 ? v.toUpperCase() : ' ' + v.toLowerCase();
    });
}

export function capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function runInElectron() {
    return window && (<any>window).process && (<any>window).process.type;
}
