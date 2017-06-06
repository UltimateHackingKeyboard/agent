'use strict';

const TEST_BUILD = false; // set true if you would like to test on your local machince

if (!process.env.CI && !TEST_BUILD) {
    console.error('Create release only on CI server')
    process.exit(1)
}

let branchName = ''
let pullRequestNr = ''
let gitTag = ''
let repoName = ''

if (process.env.TRAVIS) {
    branchName = process.env.TRAVIS_BRANCH
    pullRequestNr = process.env.TRAVIS_PULL_REQUEST
    gitTag = process.env.TRAVIS_TAG
    repoName = process.env.TRAVIS_REPO_SLUG
} else if (process.env.APPVEYOR) {
    branchName = process.env.APPVEYOR_REPO_BRANCH
    pullRequestNr = process.env.APPVEYOR_PULL_REQUEST_NUMBER
    gitTag = process.env.APPVEYOR_REPO_TAG_NAME
    repoName = process.env.APPVEYOR_REPO_NAME
}

console.log({ branchName, pullRequestNr, gitTag, repoName })

// TODO(Robi): Remove the comment after success tests
const isReleaseCommit = TEST_BUILD || branchName === gitTag && repoName === 'UltimateHackingKeyboard/agent'

if (!isReleaseCommit) {
    console.log('It is not a release task. Skipping publish.')
    process.exit(0)
}


const fs = require('fs-extra')
const cp = require('child_process')
const path = require('path')
const builder = require("electron-builder")
const Platform = builder.Platform

let sha = ''
if (process.env.TRAVIS) {
    sha = process.env.TRAVIS_COMMIT
} else if (process.env.APPVEYOR) {
    sha = process.env.APPVEYOR_REPO_COMMIT
}

let target = ''

if (process.platform === 'darwin') {
    target = Platform.MAC.createTarget()
} else if (process.platform === 'win32') {
    target = Platform.WINDOWS.createTarget()
} else if (process.platform === 'linux') {
    target = Platform.LINUX.createTarget()
} else {
    console.error(`I dunno how to publish a release for ${process.platform} :(`)
    process.exit(1)
}

if (process.platform === 'darwin') {
    // TODO: Remove comment when macOS certificates boughted and exported
    //require('./setup-macos-keychain').registerKeyChain()
}

let version = ''
if (TEST_BUILD || gitTag) {
    version = gitTag

    builder.build({
        dir: true,
        targets: target,
        appMetadata: {
            main: 'electron/dist/electron-main.js',
            name: 'UHK Agent',
            author: {
                name: 'Ultimate Gaget Laboratories'
            },
        },
        config: {
            appId: 'com.ultimategadgetlabs.uhk.agent',
            productName: 'UHK Agent',
            mac: {
                category: 'public.app-category.utilities',
            },
            publish: 'github',
            files: [
                '!**/*',
                'electron/dist/**/*',
                'node_modules/**/*'
            ]

        },
    })
        .then(() => {
            console.log('Packing success.')
        })
        .catch((error) => {
            console.error(`${error}`)
            process.exit(1)
        })
}
else {
    console.log('No git tag')
    // TODO: Need it?
    version = sha.substr(0, 8)
    process.exit(1)
}
