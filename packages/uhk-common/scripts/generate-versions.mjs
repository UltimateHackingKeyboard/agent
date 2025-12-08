import { exec } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import getGithubTag from '../../../scripts/get-github-tag.mjs';
const rootPackageJsonPath = path.join(import.meta.dirname, '../../../package.json');
const packageJsonContent = await fs.readFile(rootPackageJsonPath, { encoding: 'utf8' });
const packageJson = JSON.parse(packageJsonContent)

const versionsFileContent = `\
import { VersionInformation } from '../models/version-information.js';

export const VERSIONS: VersionInformation = {
    agentRepo: ${writeValue(getGitRepo())},
    agentTag: ${writeValue(await getGitTag())},
    version: ${writeValue(packageJson.version)},
    firmwareVersion: ${writeValue(packageJson.firmwareVersion)},
    deviceProtocolVersion: ${writeValue(packageJson.deviceProtocolVersion)},
    userConfigVersion: ${writeValue(packageJson.userConfigVersion)},
    hardwareConfigVersion: ${writeValue(packageJson.hardwareConfigVersion)},
}
`

if (process.env.CI) {
    console.log('versions.ts file content:')
    console.log(versionsFileContent);
}

const versionsFilePath = path.join(import.meta.dirname, '../src/util/versions.ts')
await fs.writeFile(versionsFilePath, versionsFileContent, { encoding: 'utf8' });

/**
 * @param {*} value
 * @returns {string}
 */
function writeValue(value) {
    if (value === undefined) {
        return 'undefined';
    }

    return `'${value}'`;
}

function getGitRepo() {
    if (process.env.CI) {
        return process.env.GITHUB_REPOSITORY;
    }

    return 'UltimateHackingKeyboard/agent'
}

async function getGitTag() {
    if (process.env.CI) {
        const tag = getGithubTag();
        if (tag) {
            return tag;
        }
    }

    try {
        const tagResponse = await execAsync('git describe --exact-match --tags')

        if (tagResponse.stdout) {
            return tagResponse.stdout.trim()
        }
    } catch (error) {
        console.log('No Agent git tag fallback to sha')
    }

    // fallback to git sha
    const shaResponse = await execAsync('git rev-parse --verify --short HEAD')

    return shaResponse.stdout.trim()
}

async function execAsync(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }

            resolve({
                stdout,
                stderr,
            });
        })
    })
}
