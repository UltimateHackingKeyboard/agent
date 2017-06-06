'use strict'

const cp = require('child_process')
const path = require('path')

function registerKeyChain() {
    const encryptedFile = path.join(__dirname, '../certs/developer-id-cert.p12.enc')
    const decryptedFile = path.join(__dirname, '../certs/developer-id-cert.p12')
    cp.execSync(`openssl aes-256-cbc -K $encrypted_04061b49eb95_key -iv $encrypted_04061b49eb95_iv -in ${encryptedFile} -out ${decryptedFile} -d`)

    const keyChain = 'mac-build.keychain'
    cp.execSync(`security create-keychain -p travis ${keyChain}`)
    cp.execSync(`security default-keychain -s ${keyChain}`)
    cp.execSync(`security unlock-keychain -p travis ${keyChain}`)
    cp.execSync(`security set-keychain-settings -t 3600 -u ${keyChain}`)

    cp.execSync(`security import ${decryptedFile} -k ${keyChain} -P $KEY_PASSWORD -T /usr/bin/codesign`)
}

module.exports.registerKeyChain = registerKeyChain
