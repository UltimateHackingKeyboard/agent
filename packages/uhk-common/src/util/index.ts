export { IpcEvents } from './ipcEvents.js';
export * from './constants.js';
export * from './create-md5-hash.js';
export * from './find-uhk-module-by-id.js';
export * from './get-md5-hash-from-file-name.js';
export * from './get-slot-id-name.js';
export * from './helpers.js';
export * from './is-equal-array.js';
export * from './map-i2c-address-to-module-name.js';
export * from './map-i2c-address-to-slot-id.js';
export * from './sort-string-desc.js';
export * from './to-hex-string.js';
export * from './user-configuration-history-helpers.js';

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
