import { exec, execSync } from 'node:child_process';

const __dirname = import.meta.dirname;
const TEST_BUILD = process.env.TEST_BUILD; // set true if you would like to test on your local machine

// electron-builder security override.
// Need if wanna create test release build from PR
process.env.PUBLISH_FOR_PULL_REQUEST = TEST_BUILD;

if (!process.env.CI && !TEST_BUILD) {
    console.error('Create release only on CI server');
    process.exit(1);
}

const isCI = process.env.CI;
const githubRef = process.env.GITHUB_REF;
const gitTag = getGithubTag();
const githubEventName = process.env.GITHUB_EVENT_NAME;
const repoName = process.env.GITHUB_REPOSITORY;

console.log({ gitTag, isCI, repoName, githubRef, githubEventName });

const isReleaseCommit = TEST_BUILD || isCI && repoName === 'UltimateHackingKeyboard/agent';

if (!isReleaseCommit) {
    console.log('It is not a release task. Skipping publish.');
    process.exit(0)
}

import path from 'node:path';
import {setTimeout} from 'node:timers/promises';
import builder from 'electron-builder';
import fs from 'fs-extra';
import pThrottle from 'p-throttle';
import pRetry from 'p-retry';

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
    extraResources.push('uhk-usb-service/manual-install.sh');
    extraResources.push('uhk-usb-service/usr/lib/systemd/system/uhk-usb-rebind.service');
    extraResources.push('uhk-usb-service/usr/local/bin/uhk-usb-rebind.sh');
} else {
    console.error(`I dunno how to publish a release for ${process.platform} :(`);
    process.exit(1);
}

let macCertificatePath;

if (process.env.CERT_IV && process.env.CERT_KEY) {
    if (process.platform === 'darwin') {
        const encryptedFile = path.join(__dirname, './certs/mac-cert.p12.enc');
        macCertificatePath = path.join(__dirname, './certs/mac-cert.p12');
        exec(`openssl aes-256-cbc -K $CERT_KEY -iv $CERT_IV -in ${encryptedFile} -out ${macCertificatePath} -d`);
    }
} else {
    console.info('CERT_IV and CERT_KEY env variables are not set. Skipping certificate decryption.');
}

const rootJsonPath = path.join(__dirname, '../package.json');
const rootJson = fs.readJsonSync(rootJsonPath);
update2ndPackageJson(rootJson);

// Add firmware to extra resources
const extractedFirmwareDir = path.join(__dirname, '../tmp/packages');
extraResources.push({ from: extractedFirmwareDir, to: 'packages/' });
extraResources.push({ from: path.join(__dirname, '../tmp/smart-macro-docs'), to: 'smart-macro-docs/' });

const APPLE_TEAM_ID = 'CMXCBCFHDG'
process.env.APPLE_TEAM_ID = APPLE_TEAM_ID

release()
    .then(() => {
        console.log('Packing success.');
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })

async function release () {
    return builder.build({
        publish: "onTag",
        targets: target,
        config: {
            afterPack,
            directories: {
                app: electron_build_folder
            },
            appId: 'com.ultimategadgetlabs.agent',
            npmRebuild: false,
            productName: 'UHK Agent',
            mac: {
                category: 'public.app-category.utilities',
                extraResources,
                identity: APPLE_TEAM_ID,
                cscLink: macCertificatePath,
                hardenedRuntime: true,
                gatekeeperAssess: false,
                entitlements: path.join(__dirname, 'entitlements.mac.plist'),
                entitlementsInherit: path.join(__dirname, 'entitlements.mac.plist'),
            },
            win: {
                extraResources,
                signtoolOptions: {
                    publisherName: 'ULTIMATE GADGET LABORATORIES KFT.',
                    sign: configuration => azureKeyvaultSign(configuration.path),
                },
            },
            linux: {
                extraResources
            },
            nsis: {
              oneClick: false,
            },
            publish: 'github',
            artifactName,
            files: [
                '**/*'
            ],
            releaseInfo: {
                releaseNotes: await getReleaseNotes()
            }
        },
    })
}

function update2ndPackageJson(rootJson) {
    const jsonPath = path.join(__dirname, '../packages/uhk-agent/dist/package.json');
    const json = fs.readJsonSync(jsonPath);

    json.version = rootJson.version;
    fs.writeJsonSync(jsonPath, json, { spaces: 2 })
}

async function afterPack(context) {
    if (process.platform !== 'linux')
        return;

    const chromeSandbox = path.join(context.appOutDir, 'chrome-sandbox');

    fs.chmodSync(chromeSandbox, '4755')
}

function getGithubTag() {
    const result = /^refs\/tags\/(v\d+\.\d+\.\d+)$/.exec(process.env.GITHUB_REF);

    return result && result[1];
}

async function getReleaseNotes() {
    if(!gitTag) {
        return
    }

    const version = gitTag.slice(1)
    const changeLogPath = path.join(__dirname, '..', 'CHANGELOG.md');
    const changelogContent = await fs.readFile(changeLogPath, { encoding: 'utf8' });
    const lines = changelogContent.split('\n');

    let capturing = false;
    const result = [];

    for (const line of lines) {
        if (line.match(new RegExp(`^## \\[${version}\\]`))) {
            capturing = true;
            result.push(line);
        } else if (line.match(/^## \[/) && capturing) {
            break; // Stop when we hit the next section
        } else if (capturing) {
            result.push(line);
        }
    }

    return result
        .slice(2)
        .join('\n');
}


// sign only 1 file in every 2 sec
// otherwise we got random singing error
// maybe related issue https://github.com/vcsjones/AzureSignTool/issues/330
const throttleAzureCodeSign = pThrottle({
    limit: 1,
    interval: 2000
});

const azureKeyvaultSign = throttleAzureCodeSign(async (filePath) => {
    const {
        AZURE_KEY_VAULT_TENANT_ID,
        AZURE_KEY_VAULT_CLIENT_ID,
        AZURE_KEY_VAULT_SECRET,
        AZURE_KEY_VAULT_URL,
        AZURE_KEY_VAULT_CERTIFICATE,
    } = process.env;

    if (!AZURE_KEY_VAULT_URL) {
        console.log('Skipping code signing, no environment variables set for that.');
        return;
    }

    return pRetry(() => new Promise((resolve, reject) => {
        console.log('Signing file', filePath);
        const signToolPath = path.join(__dirname, 'AzureSignTool-x64-6-0-1.exe');
        const command = `${signToolPath} sign -kvu ${AZURE_KEY_VAULT_URL} -kvi ${AZURE_KEY_VAULT_CLIENT_ID} -kvt ${AZURE_KEY_VAULT_TENANT_ID} -kvs ${AZURE_KEY_VAULT_SECRET} -kvc ${AZURE_KEY_VAULT_CERTIFICATE} -tr http://timestamp.identrust.com -v '${filePath}'`;
        exec(command, { shell: 'powershell.exe' }, (e, stdout, stderr) => {
            if (e instanceof Error) {
                console.error(e);
                return reject(e);
            }

            if (stderr) {
                console.error(stderr);
                return reject(new Error(stderr));
            }

            if (stdout.indexOf('Signing completed successfully') > -1) {
                console.log(stdout);
                return resolve();
            }

            return reject(new Error(stdout));
        })
    }),
        {
        retries: 5,
        onFailedAttempt: async ({error, attemptNumber, retriesLeft, retriesConsumed}) => {
            console.log('Signing file failed', filePath);
            console.log(`Attempt ${attemptNumber} failed. ${retriesLeft} retries left. ${retriesConsumed} retries consumed.`);
            console.error(error);

            console.log('wait 5 sec before retry');
            await setTimeout(5000);
        },
    })
})
