'use strict';
const jsonfile = require('jsonfile');
const exec = require('child_process').execSync;

const TEST_BUILD = process.env.TEST_BUILD;// set true if you would like to test on your local machine
// set true if running on your dev mac machine where yarn is installed or not need to install
const RUNNING_IN_DEV_MODE = process.env.RUNNING_IN_DEV_MODE === 'true';
const DIR = process.env.DIR;

// electron-builder security override.
// Need if wanna create test release build from PR
process.env.PUBLISH_FOR_PULL_REQUEST = TEST_BUILD;

if (!process.env.CI && !TEST_BUILD) {
    console.error('Create release only on CI server');
    process.exit(1);
}

let branchName = '';
let pullRequestNr = '';
let gitTag = '';
let repoName = '';

if (process.env.TRAVIS) {
    branchName = process.env.TRAVIS_BRANCH;
    pullRequestNr = process.env.TRAVIS_PULL_REQUEST;
    gitTag = process.env.TRAVIS_TAG;
    repoName = process.env.TRAVIS_REPO_SLUG;
} else if (process.env.APPVEYOR) {
    branchName = process.env.APPVEYOR_REPO_BRANCH;
    pullRequestNr = process.env.APPVEYOR_PULL_REQUEST_NUMBER;
    gitTag = process.env.APPVEYOR_REPO_TAG_NAME;
    repoName = process.env.APPVEYOR_REPO_NAME;
}

console.log({branchName, pullRequestNr, gitTag, repoName});

const isReleaseCommit = TEST_BUILD || branchName === gitTag && repoName === 'UltimateHackingKeyboard/agent';

if (!isReleaseCommit) {
    console.log('It is not a release task. Skipping publish.');
    process.exit(0)
}

if (process.platform === 'darwin' && !RUNNING_IN_DEV_MODE) {
    exec('brew install yarn --without-node');
}

if(!RUNNING_IN_DEV_MODE) {
    exec("yarn add electron-builder");
}

const path = require('path');
const builder = require("electron-builder");
const Platform = builder.Platform;
const electron_build_folder = path.join(__dirname, '../packages/uhk-agent/dist');

let sha = '';
if (process.env.TRAVIS) {
    sha = process.env.TRAVIS_COMMIT;
} else if (process.env.APPVEYOR) {
    sha = process.env.APPVEYOR_REPO_COMMIT;
}

let target = '';
let artifactName = 'UHK.Agent-${version}-${os}';
let extraResources = [];

if (process.platform === 'darwin') {
    target = Platform.MAC.createTarget();
    artifactName += '.${version}.${ext}';
} else if (process.platform === 'win32') {
    target = Platform.WINDOWS.createTarget('nsis', builder.Arch.ia32, builder.Arch.x64);
    artifactName += '-${arch}.${ext}';
} else if (process.platform === 'linux') {
    target = Platform.LINUX.createTarget();
    artifactName += '-${arch}.${ext}';
    extraResources.push('rules/setup-rules.sh');
    extraResources.push('rules/50-uhk60.rules');
} else {
    console.error(`I dunno how to publish a release for ${process.platform} :(`);
    process.exit(1);
}

if (process.platform === 'darwin') {
    // TODO: Remove comment when macOS certificates boughted and exported
    //require('./setup-macos-keychain').registerKeyChain();
}

let version = '';
if (TEST_BUILD || gitTag) {
    const rootJson = require('../package.json');
    version = gitTag;
    update2rndPackageJson(rootJson);

    builder.build({
        dir: DIR,
        targets: target,
        appMetadata: {
            main: 'electron-main.js',
            name: 'UHK Agent',
            author: {
                name: 'Ultimate Gadget Laboratories'
            },
            version: rootJson.version
        },
        config: {
            directories: {
                app: electron_build_folder
            },
            appId: 'com.ultimategadgetlabs.uhk.agent',
            productName: 'UHK Agent',
            mac: {
                category: 'public.app-category.utilities'
            },
            win: {
                extraResources
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
            console.error(`${error}`);
            process.exit(1);
        })
}
else {
    console.log('No git tag');
    // TODO: Need it?
    version = sha.substr(0, 8);
    process.exit(1);
}

function update2rndPackageJson(rootJson) {
    const jsonPath = path.join(__dirname, '../packages/uhk-agent/dist/package.json');
    const json = require(jsonPath);

    json.version = rootJson.version;
    json.dataModelVersion = rootJson.dataModelVersion;
    json.usbProtocolVersion = rootJson.usbProtocolVersion;
    json.slaveProtocolVersion = rootJson.slaveProtocolVersion;
    jsonfile.writeFileSync(jsonPath, json, {spaces: 2})
}
