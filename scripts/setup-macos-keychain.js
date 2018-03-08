'use strict';

const cp = require('child_process');
const path = require('path');

function registerKeyChain() {
    const encryptedFile = path.join(__dirname, './certs/mac-cert.p12.enc');
    const decryptedFile = path.join(__dirname, './certs/mac-cert.p12');
    cp.execSync(`openssl aes-256-cbc -K $CERT_KEY -iv $CERT_IV -in ${encryptedFile} -out ${decryptedFile} -d`);

    const keyChain = 'mac-build.keychain';
    cp.execSync(`security create-keychain -p travis ${keyChain}`);
    cp.execSync(`security default-keychain -s ${keyChain}`);
    cp.execSync(`security unlock-keychain -p travis ${keyChain}`);
    cp.execSync(`security set-keychain-settings -t 3600 -u ${keyChain}`);

    cp.execSync(`security import ${decryptedFile} -k ${keyChain} -T /usr/bin/codesign`);
}

module.exports.registerKeyChain = registerKeyChain;
