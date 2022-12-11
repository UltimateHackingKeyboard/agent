export { IpcEvents } from './ipcEvents.js';
export * from './constants.js';
export * from './create-md5-hash.js';
export * from './disable-agent-upgrade-protection.js';
export * from './find-uhk-module-by-id.js';
export * from './get-md5-hash-from-file-name.js';
export * from './get-slot-id-name.js';
export * from './helpers.js';
export * from './is-device-protocol-support-git-info.js';
export * from './is-equal-array.js';
export * from './is-official-uhk-firmware.js';
export * from './is-version-gte.js';
export * from './is-version-gt-minor.js';
export * from './map-i2c-address-to-module-name.js';
export * from './map-i2c-address-to-slot-id.js';
export * from './should-upgrade-agent.js';
export * from './should-upgrade-firmware.js';
export * from './simulate-invalid-user-config-error.js';
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
