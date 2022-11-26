'use strict';
const exec = require('child_process').execSync;

const TEST_BUILD = process.env.TEST_BUILD; // set true if you would like to test on your local machine
const DIR = process.env.DIR;

// electron-builder security override.
// Need if wanna create test release build from PR
process.env.PUBLISH_FOR_PULL_REQUEST = TEST_BUILD;

if (!process.env.CI && !TEST_BUILD) {
    console.error('Create release only on CI server');
    process.exit(1);
}

const githubRef = process.env.GITHUB_REF;
const gitTag = getGithubTag();
const githubEventName = process.env.GITHUB_EVENT_NAME;
const repoName = process.env.GITHUB_REPOSITORY;

console.log({ gitTag, repoName, githubRef, githubEventName });

const isReleaseCommit = TEST_BUILD || gitTag && repoName === 'UltimateHackingKeyboard/agent';

if (!isReleaseCommit) {
    console.log('It is not a release task. Skipping publish.');
    process.exit(0)
}

const path = require('path');
const builder = require("electron-builder");
const fs = require('fs-extra');
const { notarize } = require('@electron/notarize');

const Platform = builder.Platform;
const electron_build_folder = path.join(__dirname, '../packages/uhk-agent/dist');

let target = '';
let artifactName = 'UHK.Agent-${version}-${os}';
let extraResources = [];

if (process.platform === 'darwin') {
    // https://github.com/lidel/electron-builder/blob/master/docs/configuration/mac.md
    // Use default target to create dmg and zip artifact. Zip needed to Squirrel.Mac auto update
    target = Platform.MAC.createTarget('default', builder.Arch.universal);
    artifactName += '.${ext}';
} else if (process.platform === 'win32') {
    target = Platform.WINDOWS.createTarget('nsis', builder.Arch.ia32, builder.Arch.x64);
    artifactName += '-${arch}.${ext}';
} else if (process.platform === 'linux') {
    target = Platform.LINUX.createTarget('AppImage');
    artifactName += '-${arch}.${ext}';
    extraResources.push('rules/setup-rules.sh');
    extraResources.push('rules/50-uhk60.rules');
} else {
    console.error(`I dunno how to publish a release for ${process.platform} :(`);
    process.exit(1);
}

if (process.platform === 'darwin' && process.env.CI) {
    const encryptedFile = path.join(__dirname, './certs/mac-cert.p12.enc');
    const decryptedFile = path.join(__dirname, './certs/mac-cert.p12');
    exec(`openssl aes-256-cbc -K $CERT_KEY -iv $CERT_IV -in ${encryptedFile} -out ${decryptedFile} -d`);
} else if (process.platform === 'win32') {
    // decrypt windows certificate
    exec('openssl aes-256-cbc -K %CERT_KEY% -iv %CERT_IV% -in scripts/certs/windows-cert.p12.enc -out scripts/certs/windows-cert.p12 -d')
}

if (TEST_BUILD || gitTag) {
    const rootJson = require('../package.json');
    update2ndPackageJson(rootJson);

    // Add firmware to extra resources
    const extractedFirmwareDir = path.join(__dirname, '../tmp/packages');
    extraResources.push({ from: extractedFirmwareDir, to: 'packages/' });
    extraResources.push({ from: path.join(__dirname, '../tmp/smart-macro-docs'), to: 'smart-macro-docs/' });

    builder.build({
        dir: DIR,
        targets: target,
        config: {
            afterSign,
            directories: {
                app: electron_build_folder
            },
            appId: 'com.ultimategadgetlabs.agent',
            productName: 'UHK Agent',
            mac: {
                category: 'public.app-category.utilities',
                extraResources,
                identity: 'CMXCBCFHDG',
                cscLink: path.join(__dirname, 'certs/mac-cert.p12'),
                hardenedRuntime: true,
                gatekeeperAssess: false,
                entitlements: path.join(__dirname, 'entitlements.mac.plist'),
                entitlementsInherit: path.join(__dirname, 'entitlements.mac.plist')
            },
            win: {
                extraResources,
                publisherName: 'Ultimate Gadget Laboratories Kft.',
                certificateFile: path.join(__dirname, 'certs/windows-cert.p12')
            },
            linux: {
                extraResources
            },
            publish: 'github',
            artifactName,
            files: [
                '**/*'
            ]
        },
    })
        .then(() => {
            console.log('Packing success.');
        })
        .catch((error) => {
            console.error(error);
            process.exit(1);
        })
} else {
    console.log('No git tag');
    // TODO: Need it?
    process.exit(1);
}

function update2ndPackageJson(rootJson) {
    const jsonPath = path.join(__dirname, '../packages/uhk-agent/dist/package.json');
    const json = require(jsonPath);

    json.version = rootJson.version;
    fs.writeJsonSync(jsonPath, json, { spaces: 2 })
}

async function afterSign(context) {
    const { electronPlatformName, appOutDir } = context;
    if (electronPlatformName !== 'darwin') {
        return;
    }

    const appName = context.packager.appInfo.productFilename;

    return await notarize({
        appBundleId: 'com.ultimategadgetlabs.agent',
        appPath: `${appOutDir}/${appName}.app`,
        appleId: process.env.APPLE_ID,
        appleIdPassword: process.env.APPLE_ID_PASS,
    });
}

function getGithubTag() {
    const result = /^refs\/tags\/(v\d+\.\d+\.\d+)$/.exec(process.env.GITHUB_REF);

    return result && result[1];
}
