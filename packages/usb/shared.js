require('shelljs/global');

function checkFirmwareImage(imagePath, extension) {
    if (!imagePath) {
        echo('No firmware image specified');
        exit(1);
    }

    if (!imagePath.endsWith(extension)) {
        echo(`Firmware image extension is not ${extension}`);
        exit(1);
    }

    if (!test('-f', imagePath)) {
        echo('Firmware image does not exist');
        exit(1);
    }
}

function getBlhostCmd(pid) {
    let blhostPath;
    switch (process.platform) {
        case 'linux':
            blhostPath = 'linux/amd64/blhost';
            break;
        case 'darwin':
            blhostPath = 'mac/blhost';
            break;
        case 'win32':
            blhostPath = 'win/blhost.exe';
            break;
        default:
            echo('Your operating system is not supported');
            exit(1);
            break;
    }

    return `${__dirname}/blhost/${blhostPath} --usb 0x1d50,0x${pid.toString(16)}`;
}

function execRetry(command) {
    let firstRun = true;
    let remainingRetries = 3;
    let code;
    do {
        if (!firstRun) {
            console.log(`Retrying ${command}`)
        }
        config.fatal = !remainingRetries;
        code = exec(command).code;
        config.fatal = true;
        firstRun = false;
    } while(code && --remainingRetries);
}

const exp = {
    checkFirmwareImage,
    getBlhostCmd,
    execRetry,
}

Object.keys(exp).forEach(function (cmd) {
  global[cmd] = exp[cmd];
});
